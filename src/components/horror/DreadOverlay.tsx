"use client";

import { useEffect, useRef } from "react";

// The site bleeds from the edges the deeper you descend — a red inset vignette
// whose intensity tracks scroll depth, with a faint pulse near the bottom.
export default function DreadOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        // ease-in so the dread arrives late
        const e = p * p;
        el.style.opacity = `${0.15 + e * 0.6}`;
        el.style.setProperty("--spread", `${18 + e * 26}vmin`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[58] opacity-0"
      style={{
        // @ts-expect-error custom property
        "--spread": "18vmin",
        boxShadow:
          "inset 0 0 var(--spread) rgba(109,10,16,0.9), inset 0 0 8vmin rgba(193,18,31,0.35)",
        animation: "dreadPulse 4s ease-in-out infinite",
      }}
    />
  );
}
