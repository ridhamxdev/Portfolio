"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Magnetic from "@/components/Magnetic";
import { onIntroDone } from "@/lib/intro";

const ContourField = dynamic(() => import("@/components/three/ContourField"), { ssr: false });

/**
 * Hero: full-width display statement laid OVER the contour field, which owns
 * the right edge. Entrances are gated on the preloader handoff, not scroll.
 * The headline's width axis relaxes as you scroll away (var --p, lerped).
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => onIntroDone(() => setDone(true)), []);

  // Lerped channels (playbook 2.8): JS writes ONE number per channel, CSS does
  // the math. --p drives the width relax on scroll; --wght-prox lets the
  // headline gain mass as the cursor nears it (RESPOND, never idle).
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let px = -9999;
    let py = -9999;
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let sp = 0;
    let pr = 0;
    let active = true;
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
    });
    io.observe(el);

    const tick = () => {
      if (active) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight / 2)));
        sp += (p - sp) * 0.12;
        el.style.setProperty("--p", sp.toFixed(4));

        if (fine) {
          // distance from the pointer to the headline box (0 while inside it)
          let tgt = 0;
          const h = headline.current;
          if (h) {
            const b = h.getBoundingClientRect();
            const dx = Math.max(b.left - px, 0, px - b.right);
            const dy = Math.max(b.top - py, 0, py - b.bottom);
            tgt = Math.max(0, 1 - Math.hypot(dx, dy) / 380);
          }
          pr += (tgt - pr) * 0.12;
          el.style.setProperty("--wght-prox", (pr * 45).toFixed(1));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      ref={section}
      data-io={done ? "in" : "out"}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-clip px-5 pb-16 pt-28 sm:px-10"
      style={{ "--p": 0 } as React.CSSProperties}
    >
      {/* Full-bleed survey terrain — the pointer lens tracks 1:1 because the
          plane now spans the whole window (matching the pointer's window-space
          coords). A soft left-anchored scrim keeps the headline crisp. */}
      <ContourField className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/45 to-transparent sm:via-bg/25 sm:to-bg/0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <h1
          ref={headline}
          className="display-xl rv-cast wx-relax text-ink"
          style={{
            // width relaxes 125 -> 105 as the hero scrolls away (--p, lerped);
            // the cast entrance comes from the rv-cast class.
            "--wx-range": -20,
            // sized so the longest line stays a single slot on desktop
            fontSize: "clamp(2.6rem, 7.2vw, 6.6rem)",
          } as React.CSSProperties}
        >
          <span className="rv-slot block">
            <span className="rv-rise block">Systems that</span>
          </span>
          <span className="rv-slot block">
            <span className="rv-rise block" style={{ "--rv-d": "0.12s" } as React.CSSProperties}>
              decide<span className="text-accent">,</span>
            </span>
          </span>
          <span className="rv-slot block">
            <span className="rv-rise block" style={{ "--rv-d": "0.24s" } as React.CSSProperties}>
              products that ship<span className="text-accent">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p
            className="rv-fade max-w-md text-lg leading-relaxed text-muted"
            style={{ "--rv-d": "0.45s" } as React.CSSProperties}
          >
            Full-stack engineer in Bengaluru. Real-time backends, AI decision
            engines, and shipped products with real users.
          </p>

          <div className="rv-fade" style={{ "--rv-d": "0.55s" } as React.CSSProperties}>
            <Magnetic className="inline-block">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
              >
                See the work
                <span className="inline-block h-2 w-2 bg-accent transition-colors duration-300 group-hover:bg-accent-ink" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
