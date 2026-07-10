"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Lightformer,
  ContactShadows,
  Bounds,
  OrbitControls,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { Group, Mesh, MathUtils, Object3D, WebGLRenderer } from "three";
import { heroScroll } from "@/lib/heroScroll";

const MODEL = "/models/facecap.glb";

// The face scan ships KTX2-compressed textures; teach the GLTF loader to
// transcode them with the Basis worker served from /public/basis.
function useFaceGLTF(gl: WebGLRenderer) {
  return useGLTF(MODEL, true, true, (loader) => {
    const ktx2 = new KTX2Loader()
      .setTranscoderPath("/basis/")
      .detectSupport(gl);
    // @ts-expect-error drei's GLTFLoader accepts a KTX2Loader
    loader.setKTX2Loader(ktx2);
  });
}

// ARKit blendshape names differ across exporters (facecap uses `eyeBlink_L`,
// Ready Player Me uses `eyeBlinkLeft`). Resolve by trying every known spelling
// so this same rig drives Ridham's real avatar once it's dropped in.
function morphIndex(dict: Record<string, number>, ...names: string[]) {
  for (const n of names) if (dict[n] !== undefined) return dict[n];
  return -1;
}

function Face({ scrollExpr = true }: { scrollExpr?: boolean }) {
  const gl = useThree((s) => s.gl);
  const { scene } = useFaceGLTF(gl);
  const root = useRef<Group>(null);

  // Pull out the morph-target mesh and the aimable eye/head nodes once.
  const rig = useMemo(() => {
    let found: Mesh | undefined;
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.morphTargetInfluences && m.morphTargetDictionary && !found) found = m;
    });
    const mesh: Mesh | null = found ?? null;
    const dict = (found?.morphTargetDictionary ?? {}) as Record<string, number>;
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
      mesh,
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

  // Blink state machine — mostly slow, with the odd unsettling rapid double-blink.
  const blink = useRef({ next: 1.4, t: 0, phase: 0 as 0 | 1 | 2, v: 0, dbl: false });
  // Twitch: brief involuntary head jerk at rare intervals — the body glitches.
  const twitch = useRef({ next: 4, t: 0, x: 0, y: 0 });
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;
    const p = state.pointer; // -1..1
    const infl = rig.mesh?.morphTargetInfluences;

    // --- gaze: a slow, deliberate lock-on that lags then settles — a dead stare
    const gazeX = MathUtils.clamp(p.x, -1, 1);
    const gazeY = MathUtils.clamp(p.y, -1, 1);
    if (rig.eyeL && rig.eyeR) {
      const ey = -gazeX * 0.5; // eyes over-rotate slightly — too aware
      const ex = -gazeY * 0.36;
      for (const e of [rig.eyeL, rig.eyeR]) {
        e.rotation.y = MathUtils.lerp(e.rotation.y, ey, 0.055);
        e.rotation.x = MathUtils.lerp(e.rotation.x, ex, 0.055);
      }
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

    if (root.current) {
      // shallow, laboured breathing + slow tracking head turn + micro twitch
      const breathe = Math.sin(t * 0.85) * 0.02;
      root.current.rotation.y = MathUtils.lerp(
        root.current.rotation.y,
        gazeX * 0.26 + Math.sin(t * 0.31) * 0.03 + tw.x,
        0.035
      );
      root.current.rotation.x = MathUtils.lerp(
        root.current.rotation.x,
        -gazeY * 0.16 + breathe + tw.y,
        0.04
      );
      root.current.position.y = Math.sin(t * 0.85) * 0.01;
      root.current.rotation.z = Math.sin(t * 0.19) * 0.03 + tw.x * 0.5; // faint head tilt
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
    if (infl) {
      if (rig.blink.l >= 0) infl[rig.blink.l] = b.v;
      if (rig.blink.r >= 0) infl[rig.blink.r] = b.v;

      // --- expression: resting dread (jaw cracked open, brows drawn down),
      // deepening into a wide-eyed menace as the hero scrolls away.
      const s = scrollExpr ? heroScroll.p : 0;
      const jaw = 0.05 + s * 0.14; // mouth hangs slightly, then more
      const browDown = 0.1 + s * 0.4; // furrow — set via browInnerUp negative feel
      const wide = 0.08 + s * 0.5; // eyes widen unnaturally on scroll
      if (rig.jaw >= 0) infl[rig.jaw] = MathUtils.lerp(infl[rig.jaw] ?? 0, jaw, 0.05);
      // browInnerUp lifted only a touch; rely on wide eyes for menace
      if (rig.browUp >= 0) infl[rig.browUp] = MathUtils.lerp(infl[rig.browUp] ?? 0, browDown * 0.3, 0.05);
      if (rig.wide.l >= 0) infl[rig.wide.l] = MathUtils.lerp(infl[rig.wide.l] ?? 0, wide, 0.05);
      if (rig.wide.r >= 0) infl[rig.wide.r] = MathUtils.lerp(infl[rig.wide.r] ?? 0, wide, 0.05);
      // kill any resting smile so it never reads friendly
      if (rig.smile.l >= 0) infl[rig.smile.l] = MathUtils.lerp(infl[rig.smile.l] ?? 0, 0, 0.1);
      if (rig.smile.r >= 0) infl[rig.smile.r] = MathUtils.lerp(infl[rig.smile.r] ?? 0, 0, 0.1);
    }
  });

  // facecap is authored ~2 units tall and centred near y=0; frame it as a bust.
  return (
    <group ref={root} position={[0, -0.15, 0]} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function LivingPortrait({ debug = false }: { debug?: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: !debug, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.05, 1.35], fov: 34 }}
      style={{ background: debug ? "#20222a" : "transparent" }}
    >
      {/* corpse light: dim cold ambient, a low blood key from below (horror
          underlight), and a hard cold rim so the skull edge reads in the dark */}
      <ambientLight intensity={0.16} color="#8390a0" />
      <pointLight position={[0, -1.7, 1.6]} intensity={7} color="#d21b23" distance={9} decay={1.8} />
      <spotLight position={[-2.4, 0.3, 2]} angle={0.55} penumbra={1} intensity={7} color="#5c6d78" distance={12} />
      <pointLight position={[2.8, 1.6, 0.4]} intensity={5} color="#9fb0c4" distance={12} decay={1.7} />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.15}>
          <Face />
        </Bounds>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.1} color="#3a4650" position={[-2.5, 1.5, 2]} scale={[5, 5, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#8f1015" position={[0.5, -2, 1.5]} scale={[4, 4, 1]} />
          <Lightformer form="ring" intensity={0.4} color="#20262e" position={[0, 0, -3]} scale={4} />
        </Environment>
      </Suspense>

      <ContactShadows position={[0, -1.05, 0]} opacity={0.6} scale={4} blur={2.4} far={2} color="#000000" />

      {debug && <OrbitControls makeDefault />}

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.35} />
        <ChromaticAberration offset={[0.0018, 0.0012]} radialModulation={false} modulationOffset={0} />
        <Noise premultiply opacity={0.16} />
        <Vignette eskil={false} offset={0.16} darkness={0.92} />
      </EffectComposer>
    </Canvas>
  );
}
