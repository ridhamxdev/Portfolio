"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// A procedural dread bed: a detuned sub-bass drone, a dissonant upper tone,
// and a slow heartbeat — all synthesised, no audio files. Off by default
// (browsers block autoplay); the user summons it.
export default function HorrorAudio() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const beatRef = useRef<number | null>(null);

  const teardown = () => {
    if (beatRef.current) window.clearTimeout(beatRef.current);
    beatRef.current = null;
    nodesRef.current.forEach((n) => {
      try {
        (n as OscillatorNode).stop?.();
      } catch {}
      n.disconnect();
    });
    nodesRef.current = [];
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      window.setTimeout(() => ctx.close().catch(() => {}), 900);
    }
    ctxRef.current = null;
    masterRef.current = null;
  };

  const build = () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.setTargetAtTime(0.11, ctx.currentTime, 1.2); // slow fade-in
    master.connect(ctx.destination);
    masterRef.current = master;

    // sub-bass drone — three detuned oscillators through a lowpass
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 320;
    lp.connect(master);
    [55, 55.4, 82.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? "sine" : "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.28 : 0.5;
      o.connect(g).connect(lp);
      o.start();
      nodesRef.current.push(o, g);
    });

    // a faint, slowly-beating dissonant upper tone for unease (minor second)
    const hi = ctx.createGain();
    hi.gain.value = 0.05;
    hi.connect(master);
    [220, 233.1].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain).connect(hi.gain);
      o.connect(hi);
      o.start();
      lfo.start();
      nodesRef.current.push(o, lfo, lfoGain);
    });

    // slow heartbeat — a lub-dub of two quick sub thumps every ~1.5s
    const thump = (t: number, vel: number) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(72, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 0.3);
    };
    const beat = () => {
      const c = ctxRef.current;
      if (!c) return;
      const t = c.currentTime + 0.05;
      thump(t, 0.6);
      thump(t + 0.28, 0.4);
      beatRef.current = window.setTimeout(beat, 1500);
    };
    beat();
  };

  const toggle = () => {
    if (on) {
      teardown();
      setOn(false);
    } else {
      build();
      setOn(true);
    }
  };

  useEffect(() => () => teardown(), []);

  return (
    <button
      onClick={toggle}
      data-cursor
      aria-label={on ? "Silence the dread" : "Summon the dread"}
      className="group fixed bottom-5 right-5 z-[120] flex items-center gap-2.5 rounded-full border border-line-strong bg-void/70 px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-bone"
    >
      {on ? (
        <>
          {/* live equaliser bars */}
          <span className="flex h-3 items-end gap-[2px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2px] bg-accent"
                style={{ animation: `eq 0.7s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </span>
          Sound on
        </>
      ) : (
        <>
          <VolumeX size={13} className="text-faint transition-colors group-hover:text-accent" />
          Sound off
        </>
      )}
      <span className="sr-only">
        {on ? <Volume2 size={13} /> : null}
      </span>
    </button>
  );
}
