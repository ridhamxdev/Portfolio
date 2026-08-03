"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { onIntroDone } from "@/lib/intro";

/**
 * The signature surface (playbook §4.1): a full-bleed GL plane drawing
 * topographic iso-lines of a drifting noise field. The pointer bends the
 * terrain, scroll raises the water level, and every sixth contour is drawn
 * in the accent. All motion reaches the shader as single lerped numbers
 * (factor ~0.08), the same architecture as the CSS-var rigs.
 *
 * Lifecycle rules (review-hardened): the Canvas never unmounts on scroll —
 * visibility only switches the frameloop, so the GL context, noise phase and
 * reveal state persist. Reduced-motion renders a static field on demand
 * frames driven by explicit invalidate() calls.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform float uScroll;
  uniform float uReveal;
  uniform vec3 uInk;
  uniform vec3 uAccent;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(11.7, 5.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * vec2(uAspect, 1.0) * 2.4;
    vec2 pt = (uPointer * 0.5 + 0.5) * vec2(uAspect, 1.0) * 2.4;

    // The pointer bends the terrain into a smooth lens. Displacement is the
    // offset itself times a gaussian falloff, so it vanishes cleanly at the
    // centre (no normalize() singularity, no starburst) and the deformation
    // sits exactly under the cursor.
    vec2 toP = p - pt;
    float press = exp(-dot(toP, toP) * 1.6);
    vec2 disp = toP * press * 0.5;

    float n = fbm(p * 1.05 + vec2(uTime * 0.045, -uTime * 0.028) + disp);
    n += uScroll * 0.55 + press * 0.3;

    float levels = 24.0;
    float t = n * levels;
    float f = abs(fract(t) - 0.5);
    float w = fwidth(t);
    float line = 1.0 - smoothstep(0.0, w * 1.4, f);

    float idx = floor(t + 0.5);
    float major = step(0.75, fract(idx / 6.0 + 0.05)); // every 6th contour
    vec3 col = mix(uInk, uAccent, major);
    float alpha = line * mix(0.13, 0.85, major) * uReveal;

    gl_FragColor = vec4(col, alpha);
  }
`;

function readThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  const ink = cs.getPropertyValue("--ink").trim() || "#101014";
  const accent = cs.getPropertyValue("--accent").trim() || "#2431ff";
  return { ink: new THREE.Color(ink), accent: new THREE.Color(accent) };
}

function Field({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const target = useRef({ x: 0, y: 0, reveal: 0 });
  const state = useRef({ x: 0, y: 0, reveal: 0, scroll: 0, t: reduced ? 14 : 0 });

  // Stable identity for the lifetime of the material — three.js captures the
  // uniforms object at program compile, so it must never be recreated.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uReveal: { value: 0 },
      uInk: { value: new THREE.Color("#101014") },
      uAccent: { value: new THREE.Color("#2431ff") },
    }),
    []
  );

  useEffect(() => {
    const applyColors = () => {
      const { ink, accent } = readThemeColors();
      uniforms.uInk.value.copy(ink);
      uniforms.uAccent.value.copy(accent);
      invalidate();
    };
    applyColors();
    const mo = new MutationObserver(applyColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const off = onIntroDone(() => {
      target.current.reveal = 1;
      if (reduced) state.current.reveal = 1; // no lerp frames to spend
      invalidate();
    });

    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!reduced) window.addEventListener("mousemove", onMove);

    return () => {
      mo.disconnect();
      off();
      window.removeEventListener("mousemove", onMove);
    };
  }, [uniforms, reduced, invalidate]);

  useFrame((three, delta) => {
    const s = state.current;
    const tg = target.current;
    const scrollTarget = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));

    // Pointer tracks a touch tighter than scroll so the lens sits under the
    // cursor without feeling laggy; both stay within the house lerp band.
    s.x += (tg.x - s.x) * 0.12;
    s.y += (tg.y - s.y) * 0.12;
    s.scroll += (scrollTarget - s.scroll) * 0.08;
    s.reveal += (tg.reveal - s.reveal) * 0.035;
    if (!reduced) s.t += delta;

    uniforms.uTime.value = s.t;
    uniforms.uPointer.value.set(s.x, s.y);
    uniforms.uScroll.value = s.scroll;
    uniforms.uReveal.value = reduced ? tg.reveal : s.reveal;
    uniforms.uAspect.value = three.size.width / Math.max(1, three.size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ContourField({ className = "" }: { className?: string }) {
  // Synchronous init: rendered client-only (ssr:false), so matchMedia is safe
  // here and `reduced` never flips after the shader compiles.
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // pause GPU work when the hero is off-screen (playbook 2.20) — the loop
    // stops but the context and state persist
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <Field reduced={reduced} />
      </Canvas>
    </div>
  );
}
