"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  Float,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { AdditiveBlending, Group, MathUtils } from "three";
import { heroScroll } from "@/lib/heroScroll";

// Camera dollies back and drifts down as the hero scrolls away — the system
// recedes into the void instead of just being overlaid by the next section.
function ScrollRig() {
  useFrame((state) => {
    const p = heroScroll.p;
    state.camera.position.z = MathUtils.lerp(state.camera.position.z, 7 + p * 3.4, 0.06);
    // scroll dolly + gentle pointer parallax
    state.camera.position.y = MathUtils.lerp(
      state.camera.position.y,
      p * -0.7 + state.pointer.y * 0.28,
      0.05
    );
    state.camera.position.x = MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.5,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// A fibonacci-sphere graph: nodes = services, edges = the connections between them.
function useGraph(count: number, radius: number) {
  return useMemo(() => {
    const nodes: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      nodes.push([
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
        Math.cos(phi) * radius,
      ]);
    }
    const edges: number[] = [];
    const thr = radius * 0.78;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < thr) {
          edges.push(...nodes[i], ...nodes[j]);
        }
      }
    }
    return { nodes, edges: new Float32Array(edges) };
  }, [count, radius]);
}

function System() {
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const ring1 = useRef<Group>(null);
  const ring2 = useRef<Group>(null);
  const { nodes, edges } = useGraph(48, 2.75);

  useFrame((state, delta) => {
    if (spin.current) {
      // Spin accelerates as the hero scrolls past — a parting flourish.
      spin.current.rotation.y += delta * (0.06 + heroScroll.p * 0.7);
      spin.current.rotation.x += delta * 0.012;
    }
    // Counter-rotating orbital rings — the "observatory" gyroscope.
    if (ring1.current) ring1.current.rotation.z += delta * 0.22;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.16;
    if (tilt.current) {
      tilt.current.rotation.y = MathUtils.lerp(
        tilt.current.rotation.y,
        state.pointer.x * 0.5,
        0.04
      );
      tilt.current.rotation.x = MathUtils.lerp(
        tilt.current.rotation.x,
        -state.pointer.y * 0.36,
        0.04
      );
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {/* molten chrome core */}
        <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
          <mesh>
            <icosahedronGeometry args={[1.25, 14]} />
            <MeshDistortMaterial
              color="#1a1622"
              metalness={1}
              roughness={0.06}
              distort={0.36}
              speed={1.7}
              envMapIntensity={2.6}
            />
          </mesh>
        </Float>

        {/* connections */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#ff8a3d"
            transparent
            opacity={0.16}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* nodes */}
        {nodes.map((p, i) => {
          const hot = i % 6 === 0;
          return (
            <mesh key={i} position={p}>
              <sphereGeometry args={[hot ? 0.058 : 0.03, 16, 16]} />
              <meshBasicMaterial color={hot ? "#ffb273" : "#c8ccff"} />
            </mesh>
          );
        })}
      </group>

      {/* glowing orbital rings around the core */}
      <group ref={ring1} rotation={[Math.PI / 2.3, 0.35, 0]}>
        <mesh>
          <torusGeometry args={[2.0, 0.006, 8, 240]} />
          <meshBasicMaterial
            color="#ff8a3d"
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group ref={ring2} rotation={[Math.PI / 2.8, -0.5, 0.4]}>
        <mesh>
          <torusGeometry args={[2.32, 0.005, 8, 240]} />
          <meshBasicMaterial
            color="#8f9bff"
            transparent
            opacity={0.42}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <Sparkles
        count={110}
        scale={[13, 9, 7]}
        size={1.4}
        speed={0.25}
        opacity={0.45}
        color="#9a98b0"
      />
    </group>
  );
}

export default function Constellation() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 42 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      {/* warm key + cool rim: hard speculars that make the chrome read as molten */}
      <pointLight position={[-4, 2.5, 4]} intensity={55} color="#ff8a3d" distance={22} decay={1.4} />
      <pointLight position={[4, -1, 3]} intensity={28} color="#7d8bff" distance={22} decay={1.4} />

      <ScrollRig />
      <System />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3.4} color="#ff8a3d" position={[-3.5, 2, 2]} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffb273" position={[-1, -2.5, 3]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#5c6cff" position={[3.5, -1.5, 2]} scale={[5, 5, 1]} />
        <Lightformer form="ring" intensity={1.3} color="#ffffff" position={[0, 0, -4]} scale={4} />
        <Lightformer form="circle" intensity={1.2} color="#ffffff" position={[0, 3, -3]} scale={3} />
      </Environment>

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={1.2} luminanceThreshold={0.14} luminanceSmoothing={0.3} />
        <Vignette eskil={false} offset={0.22} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
