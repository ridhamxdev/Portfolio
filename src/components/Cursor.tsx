"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dual cursor: a precise accent dot plus a lagging ring (lerp 0.16) that
 * swells over interactive targets. Fine pointers only; reduced motion off.
 */
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
    let moved = false;
    let raf = 0;

    const move = (e: MouseEvent) => {
      if (!moved) {
        moved = true;
        rp.x = e.clientX;
        rp.y = e.clientY;
      }
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
        dot.current.style.opacity = "1";
      }
    };

    const over = (e: MouseEvent) => {
      hovering = !!(e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea, label"
      );
    };

    const leave = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const enter = () => {
      if (ring.current) ring.current.style.opacity = "";
    };

    const tick = () => {
      rp.x += (pos.x - rp.x) * 0.16;
      rp.y += (pos.y - rp.y) * 0.16;
      if (ring.current && moved) {
        const s = hovering ? 1.8 : 1;
        ring.current.style.transform = `translate3d(${rp.x - 16}px, ${rp.y - 16}px, 0) scale(${s})`;
        ring.current.style.opacity = hovering ? "0.95" : "0.55";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="no-print pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        aria-hidden
        className="no-print pointer-events-none fixed left-0 top-0 z-[200] h-8 w-8 rounded-full border border-ink/40 opacity-0"
        style={{ willChange: "transform", transition: "opacity 0.2s var(--ease-micro)" }}
      />
    </>
  );
}
