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
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
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
    let mesh: Mesh | null = null;
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.morphTargetInfluences && m.morphTargetDictionary && !mesh) mesh = m;
    });
    const dict = (mesh?.morphTargetDictionary ?? {}) as Record<string, number>;
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
      mesh: mesh as Mesh | null,
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
    };
  }, [scene]);

  // Blink state machine — random cadence, quick close, slightly slower open.
  const blink = useRef({ next: 1.4, t: 0, phase: 0 as 0 | 1 | 2, v: 0 });
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;
    const p = state.pointer; // -1..1
    const infl = rig.mesh?.morphTargetInfluences;

    // --- gaze: eyes lead, head follows softer, both clamped to a natural cone
    const gazeX = MathUtils.clamp(p.x, -1, 1);
    const gazeY = MathUtils.clamp(p.y, -1, 1);
    if (rig.eyeL && rig.eyeR) {
      const ey = -gazeX * 0.42; // yaw toward cursor
      const ex = -gazeY * 0.32; // pitch toward cursor
      for (const e of [rig.eyeL, rig.eyeR]) {
        e.rotation.y = MathUtils.lerp(e.rotation.y, ey, 0.12);
        e.rotation.x = MathUtils.lerp(e.rotation.x, ex, 0.12);
      }
    }
    if (root.current) {
      // subtle breathing + head turn toward cursor, layered on the group
      const breathe = Math.sin(t * 1.1) * 0.012;
      root.current.rotation.y = MathUtils.lerp(
        root.current.rotation.y,
        gazeX * 0.22 + Math.sin(t * 0.5) * 0.02,
        0.05
      );
      root.current.rotation.x = MathUtils.lerp(
        root.current.rotation.x,
        -gazeY * 0.14 + breathe,
        0.05
      );
      root.current.position.y = Math.sin(t * 1.1) * 0.006;
    }

    // --- blinking
    const b = blink.current;
    b.t += delta;
    if (b.phase === 0 && b.t >= b.next) {
      b.phase = 1;
      b.t = 0;
    }
    if (b.phase === 1) {
      b.v = Math.min(1, b.v + delta * 14); // close fast
      if (b.v >= 1) b.phase = 2;
    } else if (b.phase === 2) {
      b.v = Math.max(0, b.v - delta * 9); // open a touch slower
      if (b.v <= 0) {
        b.phase = 0;
        b.t = 0;
        b.next = 2 + Math.sin(t * 12.9) * 0.5 + 2.5; // ~2–5s, deterministic-ish
      }
    }
    if (infl) {
      if (rig.blink.l >= 0) infl[rig.blink.l] = b.v;
      if (rig.blink.r >= 0) infl[rig.blink.r] = b.v;

      // --- expression: warms up (slight smile + brow) as the hero scrolls away,
      // and a resting micro-smile at idle so the face never looks lifeless.
      const s = scrollExpr ? heroScroll.p : 0;
      const smile = 0.12 + s * 0.35;
      const brow = 0.08 + s * 0.25;
      if (rig.smile.l >= 0) infl[rig.smile.l] = MathUtils.lerp(infl[rig.smile.l] ?? 0, smile, 0.06);
      if (rig.smile.r >= 0) infl[rig.smile.r] = MathUtils.lerp(infl[rig.smile.r] ?? 0, smile, 0.06);
      if (rig.browUp >= 0) infl[rig.browUp] = MathUtils.lerp(infl[rig.browUp] ?? 0, brow, 0.06);
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
      {/* warm key from screen-left, cool rim from right — cinematic portrait light */}
      <ambientLight intensity={0.55} />
      <spotLight position={[-2.2, 2, 2.4]} angle={0.6} penumbra={0.9} intensity={22} color="#ffd9b0" distance={12} />
      <pointLight position={[2.6, 0.4, 1.6]} intensity={9} color="#8fa2ff" distance={12} decay={1.6} />
      <pointLight position={[0, -1.4, 2]} intensity={4} color="#ffb273" distance={10} decay={2} />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.15}>
          <Face />
        </Bounds>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.6} color="#fff2e6" position={[-2.5, 1.5, 2]} scale={[5, 5, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#aeb8ff" position={[3, -0.5, 1.5]} scale={[4, 4, 1]} />
          <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[0, 0, -3]} scale={4} />
        </Environment>
      </Suspense>

      <ContactShadows position={[0, -1.05, 0]} opacity={0.45} scale={4} blur={2.6} far={2} color="#000000" />

      {debug && <OrbitControls makeDefault />}

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.4} />
        <Vignette eskil={false} offset={0.28} darkness={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
