"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import {
  Group,
  Mesh,
  MathUtils,
  Object3D,
  Euler,
  MeshStandardMaterial,
  Color,
} from "three";
import { heroScroll } from "@/lib/heroScroll";

// A Ready Player Me avatar — full body, full ARKit blendshapes, plain embedded
// textures (no Draco/KTX2). We drop the body and float just the head as a
// haunting bust; the same rig that drove the old face scan drives it unchanged.
const MODEL = "/models/harry.glb";

// Meshes below the neck — removed so the framing sees only a floating head.
const BODY_PARTS = [
  "Wolf3D_Body",
  "Wolf3D_Outfit_Top",
  "Wolf3D_Outfit_Bottom",
  "Wolf3D_Outfit_Footwear",
];

// Head framing. The RPM head sits ~1.6m up its (removed) body; we scale it up and
// drop the whole group so the FACE — not the neck — fills the frame. We aim the
// camera at eye level rather than auto-fitting the head+neck box (which framed the
// neck and made the camera look up the nose). Tuned by screenshot.
const FACE_SCALE = 2.0;
const FACE_Y = -3.34; // ≈ -(eye height) * FACE_SCALE → eyes land ~1/3 down the frame
const HEAD_PITCH = 0.16; // constant forward tilt so the face meets the viewer

useGLTF.preload(MODEL);

// ARKit blendshape names differ across exporters (facecap uses `eyeBlink_L`,
// Ready Player Me uses `eyeBlinkLeft`). Resolve by trying every known spelling
// so this same rig drives Ridham's real avatar once it's dropped in.
function morphIndex(dict: Record<string, number>, ...names: string[]) {
  for (const n of names) if (dict[n] !== undefined) return dict[n];
  return -1;
}

function Face({ scrollExpr = true }: { scrollExpr?: boolean }) {
  const { scene } = useGLTF(MODEL);
  const root = useRef<Group>(null);

  // Pull out the morph meshes and the aimable eye/head bones once. Also drop the
  // body here (during render) so it's gone before <Bounds> measures the scene.
  const rig = useMemo(() => {
    for (const n of BODY_PARTS) {
      const o = scene.getObjectByName(n);
      o?.parent?.remove(o);
    }
    // RPM spreads morphs across the face AND teeth meshes — keep both so the jaw
    // and teeth open together. Indices line up (identical target order).
    const meshes: Mesh[] = [];
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.morphTargetInfluences && m.morphTargetDictionary) meshes.push(m);
    });
    const dict = (meshes[0]?.morphTargetDictionary ?? {}) as Record<string, number>;
    const eyeL =
      scene.getObjectByName("grp_eyeLeft") ||
      scene.getObjectByName("eyeLeft") ||
      scene.getObjectByName("LeftEye");
    const eyeR =
      scene.getObjectByName("grp_eyeRight") ||
      scene.getObjectByName("eyeRight") ||
      scene.getObjectByName("RightEye");
    const head =
      scene.getObjectByName("head") ||
      scene.getObjectByName("Head") ||
      scene.getObjectByName("grp_transform");
    return {
      meshes,
      dict,
      eyeL: eyeL as Object3D | undefined,
      eyeR: eyeR as Object3D | undefined,
      head: head as Object3D | undefined,
      blink: {
        l: morphIndex(dict, "eyeBlink_L", "eyeBlinkLeft"),
        r: morphIndex(dict, "eyeBlink_R", "eyeBlinkRight"),
      },
      smile: {
        l: morphIndex(dict, "mouthSmile_L", "mouthSmileLeft"),
        r: morphIndex(dict, "mouthSmile_R", "mouthSmileRight"),
      },
      browUp: morphIndex(dict, "browInnerUp"),
      jaw: morphIndex(dict, "jawOpen"),
      squint: {
        l: morphIndex(dict, "eyeSquint_L", "eyeSquintLeft"),
        r: morphIndex(dict, "eyeSquint_R", "eyeSquintRight"),
      },
      wide: {
        l: morphIndex(dict, "eyeWide_L", "eyeWideLeft"),
        r: morphIndex(dict, "eyeWide_R", "eyeWideRight"),
      },
    };
  }, [scene]);

  // Realism-first treatment: KEEP the scan's real skin texture and only nudge it
  // a touch cool and pallid so it fits the dark site without wiping the human tone.
  // Solid and opaque — no ghost transparency. Kept for a faint living emissive
  // breath that lifts as the face laughs.
  const skinMats = useRef<MeshStandardMaterial[]>([]);
  useEffect(() => {
    skinMats.current = [];
    scene.traverse((o) => {
      const m = o as Mesh;
      const mat = m.material as MeshStandardMaterial | undefined;
      if (!mat || !("color" in mat)) return;
      const name = o.name.toLowerCase();
      if (name.includes("eye")) {
        // natural, wet-looking eyes — leave the scanned colour, just glaze them
        mat.roughness = 0.2;
        mat.metalness = 0.05;
        if ("emissive" in mat) mat.emissiveIntensity = 0;
      } else if (name.includes("head") || name.includes("body") || name.includes("skin")) {
        // skin only: preserve the albedo, add a slight cool, pallid, sleepless cast
        mat.color.lerp(new Color("#dcd6cf"), 0.14);
        if ("emissive" in mat) mat.emissive.set("#1a0d0a"); // faint warm subsurface
        mat.emissiveIntensity = 0.12;
        mat.roughness = Math.min(1, (mat.roughness ?? 0.62) + 0.04); // skin isn't glossy
        mat.metalness = 0;
        mat.envMapIntensity = 0.9;
        skinMats.current.push(mat);
      }
      // hair, glasses, teeth: left exactly as authored so they read real
      mat.needsUpdate = true;
    });
  }, [scene]);

  // Blink state machine — mostly slow, with the odd unsettling rapid double-blink.
  const blink = useRef({ next: 1.4, t: 0, phase: 0 as 0 | 1 | 2, v: 0, dbl: false });
  // Twitch: brief involuntary head jerk at rare intervals — the body glitches.
  const twitch = useRef({ next: 4, t: 0, x: 0, y: 0 });
  const time = useRef(0);
  // The RPM head/eye bones have a rest tilt — capture it once so we aim RELATIVE
  // to the bind pose instead of snapping the head to a broken orientation.
  const bases = useRef<{ head?: Euler; eyeL?: Euler; eyeR?: Euler }>({});

  // Laugh: on a loop the spirit throws its head back and cackles — the jaw pulses
  // in time with a synthesised maniacal laugh, echoing into the dark.
  const laugh = useRef({
    active: false,
    t: 0,
    next: 7 + Math.random() * 6, // first cackle a few seconds in
    bursts: [] as { at: number; dur: number; amp: number }[],
    total: 0,
  });
  // Web Audio is gated behind a user gesture; build/resume the context on the
  // first interaction and keep an echo (delay) send for a ghostly tail.
  const audio = useRef<{ ctx: AudioContext | null; echo: DelayNode | null }>({
    ctx: null,
    echo: null,
  });
  useEffect(() => {
    const ensure = () => {
      const a = audio.current;
      if (a.ctx) {
        a.ctx.resume?.();
        return;
      }
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AC();
        const echo = ctx.createDelay(1.0);
        echo.delayTime.value = 0.23;
        const fb = ctx.createGain();
        fb.gain.value = 0.36; // regenerating tail
        const wet = ctx.createGain();
        wet.gain.value = 0.5;
        echo.connect(fb).connect(echo);
        echo.connect(wet).connect(ctx.destination);
        audio.current = { ctx, echo };
      } catch {}
    };
    window.addEventListener("pointerdown", ensure);
    window.addEventListener("keydown", ensure);
    window.addEventListener("scroll", ensure, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", ensure);
      window.removeEventListener("keydown", ensure);
      window.removeEventListener("scroll", ensure);
    };
  }, []);

  // Schedule a cackle: build the rhythm of "ha" bursts, then voice them.
  const triggerLaugh = () => {
    const bursts: { at: number; dur: number; amp: number }[] = [];
    const n = 6 + Math.floor(Math.random() * 4); // 6–9 "ha"s
    let cursor = 0.12;
    for (let i = 0; i < n; i++) {
      const dur = 0.12 + Math.random() * 0.08;
      bursts.push({ at: cursor, dur, amp: 0.7 + Math.random() * 0.3 });
      cursor += dur + 0.05 + Math.random() * 0.06;
    }
    const lg = laugh.current;
    lg.active = true;
    lg.t = 0;
    lg.bursts = bursts;
    lg.total = cursor + 0.5; // let the echo hang

    const a = audio.current;
    if (!a.ctx) return;
    a.ctx.resume?.();
    const ctx = a.ctx;
    const t0 = ctx.currentTime + 0.02;
    const base = 150 + Math.random() * 60;
    bursts.forEach((b, i) => {
      const t = t0 + b.at;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3 * b.amp, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + b.dur);
      g.connect(ctx.destination);
      if (a.echo) g.connect(a.echo);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 720 - i * 22; // vowel darkens as it descends
      bp.Q.value = 4;
      bp.connect(g);
      const f = base * Math.pow(0.94, i); // each "ha" drops in pitch — menacing
      [f, f * 1.006, f * 1.5].forEach((freq, k) => {
        const o = ctx.createOscillator();
        o.type = k === 2 ? "triangle" : "sawtooth";
        o.frequency.setValueAtTime(freq * 1.06, t);
        o.frequency.exponentialRampToValueAtTime(freq * 0.9, t + b.dur);
        o.connect(bp);
        o.start(t);
        o.stop(t + b.dur + 0.02);
      });
    });
  };

  // Track the cursor across the WHOLE page, not just this canvas. `state.pointer`
  // only updates while the mouse is over the small hero canvas, so the stare would
  // freeze the moment you moved onto text. A window-level listener keeps the eyes
  // locked on you anywhere on the page.
  const ptr = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1); // -1..1, up is +
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;
    const p = ptr.current; // whole-viewport cursor, -1..1

    // capture the bind-pose rotations once, the first frame each bone exists
    if (!bases.current.head && rig.head) bases.current.head = rig.head.rotation.clone();
    if (!bases.current.eyeL && rig.eyeL) bases.current.eyeL = rig.eyeL.rotation.clone();
    if (!bases.current.eyeR && rig.eyeR) bases.current.eyeR = rig.eyeR.rotation.clone();
    const bH = bases.current.head;

    // --- gaze: a deliberate lock-on that settles fast enough to feel aware, but
    // still with a touch of lag so it reads as watching, not snapping.
    const gazeX = MathUtils.clamp(p.x, -1, 1);
    const gazeY = MathUtils.clamp(p.y, -1, 1);
    const bEL = bases.current.eyeL;
    const bER = bases.current.eyeR;
    if (rig.eyeL && rig.eyeR && bEL && bER) {
      const ey = -gazeX * 0.5; // eyeballs turn to follow, over-aware
      const ex = -gazeY * 0.32;
      rig.eyeL.rotation.y = MathUtils.lerp(rig.eyeL.rotation.y, bEL.y + ey, 0.14);
      rig.eyeL.rotation.x = MathUtils.lerp(rig.eyeL.rotation.x, bEL.x + ex, 0.14);
      rig.eyeR.rotation.y = MathUtils.lerp(rig.eyeR.rotation.y, bER.y + ey, 0.14);
      rig.eyeR.rotation.x = MathUtils.lerp(rig.eyeR.rotation.x, bER.x + ex, 0.14);
    }

    // --- twitch scheduler
    const tw = twitch.current;
    tw.t += delta;
    if (tw.t >= tw.next) {
      tw.x = (Math.sin(t * 91.7) ) * 0.06;
      tw.y = (Math.cos(t * 57.3) ) * 0.05;
      tw.next = tw.t + 3 + Math.abs(Math.sin(t * 3.1)) * 5; // every ~3–8s
    }
    tw.x = MathUtils.lerp(tw.x, 0, 0.08);
    tw.y = MathUtils.lerp(tw.y, 0, 0.08);

    // --- laugh scheduler: idle, then cackle, then fall quiet and re-arm
    const lg = laugh.current;
    let laughJaw = 0; // 0..1 jaw drive from the current "ha"
    let laughOn = 0; // 0/1 whether we're mid-cackle (head thrown back)
    if (lg.active) {
      lg.t += delta;
      for (const bu of lg.bursts) {
        const d = lg.t - bu.at;
        if (d > -0.04 && d < bu.dur) {
          laughJaw = Math.max(laughJaw, Math.sin((d / bu.dur) * Math.PI) * bu.amp);
        }
      }
      laughOn = 1;
      if (lg.t >= lg.total) {
        lg.active = false;
        lg.t = 0;
        lg.next = 15 + Math.abs(Math.sin(t * 4.3)) * 20; // ~15–35s until the next
      }
    } else {
      lg.next -= delta;
      if (lg.next <= 0) triggerLaugh();
    }

    // --- head turn: pivot the actual neck/head bone so the body would stay put,
    // tracking the cursor, breathing, twitching, and thrown BACK while it laughs
    const breathe = Math.sin(t * 0.85) * 0.02;
    const headBack = laughOn * 0.16 + laughJaw * 0.06;
    if (rig.head && bH) {
      rig.head.rotation.y = MathUtils.lerp(
        rig.head.rotation.y,
        bH.y + gazeX * 0.34 + Math.sin(t * 0.31) * 0.03 + tw.x,
        laughOn ? 0.18 : 0.07
      );
      rig.head.rotation.x = MathUtils.lerp(
        rig.head.rotation.x,
        bH.x + HEAD_PITCH - gazeY * 0.2 + breathe + tw.y - headBack,
        laughOn ? 0.2 : 0.075
      );
      rig.head.rotation.z = MathUtils.lerp(
        rig.head.rotation.z,
        bH.z + Math.sin(t * 0.19) * 0.03 + tw.x * 0.5 + laughJaw * 0.04,
        0.1
      );
    }
    if (root.current) {
      // a slow, ghostly vertical drift for the floating head
      root.current.position.y = FACE_Y + Math.sin(t * 0.8) * 0.012;
    }

    // --- a faint living warmth under the skin, lifting a touch as it laughs.
    // The face stays fully solid and real — no ghost transparency.
    if (skinMats.current.length) {
      const glow = 0.12 + Math.sin(t * 1.1) * 0.02 + laughOn * 0.14 + laughJaw * 0.1;
      for (const mat of skinMats.current) mat.emissiveIntensity = glow;
    }

    // --- blinking (with occasional snap double-blink)
    const b = blink.current;
    b.t += delta;
    if (b.phase === 0 && b.t >= b.next) {
      b.phase = 1;
      b.t = 0;
      b.dbl = Math.sin(t * 7.7) > 0.55; // sometimes blink twice
    }
    if (b.phase === 1) {
      b.v = Math.min(1, b.v + delta * 18); // snap shut
      if (b.v >= 1) b.phase = 2;
    } else if (b.phase === 2) {
      b.v = Math.max(0, b.v - delta * 8); // linger open — heavy lids
      if (b.v <= 0) {
        if (b.dbl) {
          b.dbl = false;
          b.phase = 1;
        } else {
          b.phase = 0;
          b.t = 0;
          b.next = 2.5 + Math.abs(Math.sin(t * 12.9)) * 4; // long dead-eyed gaps
        }
      }
    }
    // Drive a morph on every mesh that owns it (face + teeth share indices).
    const face = rig.meshes[0]?.morphTargetInfluences;
    const cur = (i: number) => (i >= 0 && face ? face[i] ?? 0 : 0);
    const set = (i: number, v: number) => {
      if (i < 0) return;
      for (const mm of rig.meshes) {
        const mi = mm.morphTargetInfluences;
        if (mi && i < mi.length) mi[i] = v;
      }
    };
    if (face) {
      set(rig.blink.l, b.v);
      set(rig.blink.r, b.v);

      // --- expression: resting dread (jaw cracked open, brows drawn down),
      // deepening into a wide-eyed menace as the hero scrolls away.
      const s = scrollExpr ? heroScroll.p : 0;
      // jaw hangs at rest, opens with scroll, and gapes in time with each "ha"
      const jaw = 0.05 + s * 0.14 + laughJaw * 0.8;
      const browDown = 0.1 + s * 0.4; // furrow — set via browInnerUp negative feel
      const wide = 0.08 + s * 0.5; // eyes widen unnaturally on scroll
      // a laugh is a rictus grin, not a friendly one — force the smile up mid-cackle
      const grin = laughOn * (0.55 + laughJaw * 0.35);
      const jawEase = laughOn ? 0.55 : 0.05; // snap the jaw during the laugh
      set(rig.jaw, MathUtils.lerp(cur(rig.jaw), jaw, jawEase));
      set(rig.browUp, MathUtils.lerp(cur(rig.browUp), browDown * 0.3, 0.05));
      set(rig.wide.l, MathUtils.lerp(cur(rig.wide.l), wide, 0.05));
      set(rig.wide.r, MathUtils.lerp(cur(rig.wide.r), wide, 0.05));
      // eyes crush to squinting slits while it cackles
      set(rig.squint.l, MathUtils.lerp(cur(rig.squint.l), laughOn * 0.6, 0.2));
      set(rig.squint.r, MathUtils.lerp(cur(rig.squint.r), laughOn * 0.6, 0.2));
      // grin only appears mid-laugh — a rictus — otherwise stays flat and cold
      set(rig.smile.l, MathUtils.lerp(cur(rig.smile.l), grin, 0.25));
      set(rig.smile.r, MathUtils.lerp(cur(rig.smile.r), grin, 0.25));
    }
  });

  // Body removed in the rig memo; scale up and drop the group so the face — not
  // the neck — sits at camera level (see FACE_SCALE / FACE_Y).
  return (
    <group ref={root} position={[0, FACE_Y, 0]} scale={FACE_SCALE}>
      <primitive object={scene} />
    </group>
  );
}

export default function LivingPortrait({ debug = false }: { debug?: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: !debug, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 1.25], fov: 32 }}
      style={{ background: debug ? "#20222a" : "transparent" }}
    >
      {/* realistic 3-point lighting so the scanned skin reads as human flesh:
          a soft warm key, a cool fill, a cold rim — plus a low blood underlight
          kept dim, just for the site's mood */}
      <ambientLight intensity={0.5} color="#ccd5df" />
      <spotLight position={[2.2, 2.4, 2.6]} angle={0.6} penumbra={0.9} intensity={18} color="#fff1e0" distance={16} decay={2} />
      <pointLight position={[-2.8, 0.4, 1.8]} intensity={4} color="#7d94b0" distance={12} decay={2} />
      <pointLight position={[0, 1.2, -2.4]} intensity={5} color="#aeb9c6" distance={12} decay={2} />
      <pointLight position={[0, -1.9, 1.3]} intensity={2} color="#8f1116" distance={7} decay={2.2} />

      <Suspense fallback={null}>
        <Face />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} color="#fff4e8" position={[2, 2, 2]} scale={[6, 6, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#8ea3bd" position={[-3, 0.5, 1.5]} scale={[5, 5, 1]} />
          <Lightformer form="rect" intensity={0.8} color="#6d0a10" position={[0, -2.2, 1]} scale={[4, 3, 1]} />
          <Lightformer form="ring" intensity={0.3} color="#141a20" position={[0, 0, -3]} scale={4} />
        </Environment>
      </Suspense>

      {debug && <OrbitControls makeDefault />}

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0.72} luminanceSmoothing={0.3} />
        <Noise premultiply opacity={0.05} />
        <Vignette eskil={false} offset={0.22} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
