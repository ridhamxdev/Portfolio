"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

// Dual cursor: a precise dot + a lagging ring that swells over interactive targets.
export default function Cursor() {
  const { horror } = useTheme();
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

    // Blood trail: a small pool of droplets that bleed out behind the cursor.
    // Horror mode only — the default cursor is just the clean dot + ring.
    const trail: HTMLDivElement[] = [];
    const TRAIL = 6;
    if (horror) {
      for (let i = 0; i < TRAIL; i++) {
        const d = document.createElement("div");
        d.className = "cursor-blood pointer-events-none fixed left-0 top-0 z-[199] rounded-full";
        const s = 6 - i * 0.7;
        d.style.width = `${s}px`;
        d.style.height = `${s}px`;
        d.style.background = "radial-gradient(circle, #e0413a, #6d0a10)";
        d.style.opacity = "0";
        d.style.willChange = "transform, opacity";
        document.body.appendChild(d);
        trail.push(d);
      }
    }
    const hist: { x: number; y: number }[] = [];

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x - 3}px, ${pos.y - 3}px, 0)`;
        dot.current.style.opacity = "1";
      }
      hist.unshift({ x: pos.x, y: pos.y });
      if (hist.length > TRAIL * 4) hist.pop();
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
      // drip the trail droplets along the recent path, fading with age
      trail.forEach((d, i) => {
        const h = hist[i * 4];
        if (!h) return;
        const half = (6 - i * 0.7) / 2;
        d.style.transform = `translate3d(${h.x - half}px, ${h.y - half + i * 1.5}px, 0)`;
        d.style.opacity = `${Math.max(0, 0.5 - i * 0.08)}`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      trail.forEach((d) => d.remove());
    };
  }, [horror]);

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
