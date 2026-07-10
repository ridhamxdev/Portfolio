"use client";

import { useEffect, useRef, useState } from "react";
import { Skull } from "lucide-react";

// A single, rare lunge. Fires once, at a mid-scroll depth, on a fraction of
// visits so it stays a shock and never a gimmick. A distorted face slams to
// full screen for a few frames with a shake and a synth stinger, then vanishes.
export default function JumpScare() {
  const [active, setActive] = useState(false);
  const armed = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // ~55% of loads are "cursed" — the rest never see it
    if (Math.random() > 0.55) return;

    const onScroll = () => {
      if (!armed.current) return;
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (p > 0.5 && p < 0.66) {
        armed.current = false;
        fire();
      }
    };

    const fire = () => {
      setActive(true);
      stinger();
      document.documentElement.classList.add("scare-shake");
      window.setTimeout(() => {
        setActive(false);
        document.documentElement.classList.remove("scare-shake");
      }, 260);
    };

    // brief dissonant stinger — dies immediately, no lingering audio graph
    const stinger = () => {
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();
        const t = ctx.currentTime;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.32, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        g.connect(ctx.destination);
        [180, 190, 372, 61].forEach((f) => {
          const o = ctx.createOscillator();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(f, t);
          o.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.26);
          o.connect(g);
          o.start(t);
          o.stop(t + 0.3);
        });
        window.setTimeout(() => ctx.close().catch(() => {}), 500);
      } catch {}
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-black"
      style={{ animation: "scareFlash 0.26s steps(2) forwards" }}
    >
      {/* a skull slamming out of the dark, bleeding light */}
      <Skull
        className="h-[130vmin] w-[130vmin] text-bone"
        strokeWidth={0.5}
        style={{
          filter: "drop-shadow(0 0 8vmin rgba(193,18,31,0.9))",
          animation: "scareLunge 0.26s cubic-bezier(0.3,0,0.2,1) forwards",
        }}
      />
      <div className="absolute inset-0 bg-accent/30 mix-blend-multiply" />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 45vmin rgba(0,0,0,0.96)" }}
      />
    </div>
  );
}
