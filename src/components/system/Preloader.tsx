"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markIntroDone } from "@/lib/intro";
import { getLenis } from "@/lib/lenis";

const SEEN_KEY = "ledger-intro-seen";

/**
 * Intro sheet (playbook 2.1 architecture, original visual): the name inhales
 * along the width axis while a rule draws and a counter runs; the sheet then
 * lifts, handing off to the hero 0.55s BEFORE it fully clears. Plays once per
 * session.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage blocked */
    }

    if (seen || reduced || !root.current) {
      setHidden(true);
      markIntroDone();
      return;
    }

    document.documentElement.classList.add("is-locked");
    getLenis()?.stop();

    const unlock = () => {
      document.documentElement.classList.remove("is-locked");
      getLenis()?.start();
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          unlock();
          setHidden(true);
        },
      });

      tl.fromTo(rule.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0)
        .fromTo(
          words.current,
          { yPercent: 112 },
          { yPercent: 0, duration: 1, stagger: 0.12 },
          0.15
        )
        .fromTo(
          root.current,
          { "--wdth": 62 },
          { "--wdth": 125, duration: 1.6, ease: "expo.out" },
          0.2
        );

      const n = { v: 0 };
      tl.to(
        n,
        {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current)
              count.current.textContent = String(Math.round(n.v)).padStart(3, "0");
          },
        },
        0.2
      );

      // Departure: everything accelerates out (power4.in), then the sheet lifts.
      tl.to(words.current, { yPercent: -112, duration: 0.7, ease: "power4.in", stagger: 0.08 }, 1.95)
        .to(rule.current, { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.in" }, 2.0)
        .to(count.current, { opacity: 0, duration: 0.3, ease: "power4.in" }, 2.1)
        .to(root.current, { yPercent: -100, duration: 0.85, ease: "power4.in" }, 2.45)
        // Overlapped handoff: the hero starts while the sheet is still lifting.
        // The seen-flag is written HERE, not at effect start, so StrictMode's
        // dev double-mount replays the intro instead of skipping it.
        .call(
          () => {
            markIntroDone();
            try {
              sessionStorage.setItem(SEEN_KEY, "1");
            } catch {
              /* storage blocked */
            }
          },
          [],
          2.75
        );
    }, root);

    return () => {
      ctx.revert();
      unlock();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="intro-sheet fixed inset-0 z-[300] flex flex-col justify-between bg-bg px-5 py-6 sm:px-10"
      style={{ "--wdth": 62 } as React.CSSProperties}
    >
      <span className="label-mono">Portfolio / 2026</span>

      <div className="relative">
        <div ref={rule} className="hairline mb-6 origin-left" style={{ transform: "scaleX(0)" }} />
        <div
          className="display-xl flex flex-wrap gap-x-[0.35em] text-ink"
          style={{ fontVariationSettings: "'wdth' var(--wdth)" }}
        >
          {["RIDHAM", "GOYAL"].map((w, i) => (
            <span key={w} className="overflow-clip pb-[0.08em] -mb-[0.08em]">
              <span
                ref={(el) => {
                  words.current[i] = el;
                }}
                className="inline-block translate-y-[112%]"
              >
                {w}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between font-mono text-sm text-muted">
        <span className="label-mono">Full-stack / Systems</span>
        <span className="text-2xl text-ink">
          <span ref={count}>000</span>
          <span className="text-muted"> / 100</span>
        </span>
      </div>
    </div>
  );
}
