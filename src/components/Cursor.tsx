"use client";

import { useEffect, useRef, useState } from "react";

// Dual cursor: a precise dot + a lagging ring that swells over interactive targets.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const rp = { ...pos };
    let hovering = false;
    let raf = 0;

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
        dot.current.style.opacity = "1";
      }
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea"
      );
      hovering = !!t;
    };

    const tick = () => {
      rp.x += (pos.x - rp.x) * 0.16;
      rp.y += (pos.y - rp.y) * 0.16;
      if (ring.current) {
        const s = hovering ? 1.9 : 1;
        ring.current.style.transform = `translate3d(${rp.x - 18}px, ${rp.y - 18}px, 0) scale(${s})`;
        ring.current.style.opacity = hovering ? "0.9" : "0.5";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-9 w-9 rounded-full border border-accent/70 opacity-0"
        style={{ willChange: "transform", transition: "opacity 0.2s" }}
      />
    </>
  );
}
