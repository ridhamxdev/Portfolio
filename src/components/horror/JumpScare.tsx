"use client";

import { useEffect, useRef, useState } from "react";

// A single violent lunge per visit. A screaming, bleeding skull slams out of the
// dark with a color-invert flash, a hard camera shake, and a layered scream.
// Fires once — on a mid-scroll crossing, or after a grace period if the visitor
// never gets there — so the shock always lands but never repeats. Reduced-motion
// visitors are spared entirely.
export default function JumpScare() {
  const [active, setActive] = useState(false);
  const armed = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fire = () => {
      if (!armed.current) return;
      armed.current = false;
      setActive(true);
      scream();
      document.documentElement.classList.add("scare-shake-hard");
      window.setTimeout(() => {
        setActive(false);
        document.documentElement.classList.remove("scare-shake-hard");
      }, 620);
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (p > 0.4 && p < 0.72) fire();
    };

    // A short, ugly scream: a noise burst under a descending dissonant cluster
    // with vibrato — no lingering audio graph, the context closes itself.
    const scream = () => {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const ctx = new AC();
        const t = ctx.currentTime;

        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, t);
        master.gain.exponentialRampToValueAtTime(0.55, t + 0.02);
        master.gain.setValueAtTime(0.55, t + 0.34);
        master.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        master.connect(ctx.destination);

        // white-noise impact burst
        const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const nf = ctx.createBiquadFilter();
        nf.type = "bandpass";
        nf.frequency.setValueAtTime(1400, t);
        nf.frequency.exponentialRampToValueAtTime(320, t + 0.5);
        nf.Q.value = 0.7;
        const ng = ctx.createGain();
        ng.gain.value = 0.5;
        noise.connect(nf).connect(ng).connect(master);
        noise.start(t);
        noise.stop(t + 0.6);

        // a screaming, detuned cluster falling like a shriek
        const vib = ctx.createOscillator();
        vib.frequency.value = 7;
        const vibGain = ctx.createGain();
        vibGain.gain.value = 22;
        vib.connect(vibGain);
        vib.start(t);
        vib.stop(t + 0.6);

        [640, 655, 812, 240].forEach((f) => {
          const o = ctx.createOscillator();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(f, t);
          o.frequency.exponentialRampToValueAtTime(f * 0.32, t + 0.55);
          vibGain.connect(o.frequency);
          o.connect(master);
          o.start(t);
          o.stop(t + 0.6);
        });

        window.setTimeout(() => ctx.close().catch(() => {}), 900);
      } catch {}
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // safety net — if they never hit the scroll band, still get them
    const grace = window.setTimeout(fire, 11000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(grace);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-black"
      style={{ animation: "scareInvert 0.62s steps(3) forwards" }}
    >
      <svg
        viewBox="0 0 400 460"
        className="h-[122vmin] w-[122vmin]"
        style={{
          filter: "drop-shadow(0 0 10vmin rgba(193,18,31,0.95))",
          animation: "scareSkullIn 0.5s cubic-bezier(0.3,0,0.2,1) forwards",
        }}
      >
        <defs>
          <radialGradient id="skullShade" cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#efe9df" />
            <stop offset="62%" stopColor="#cfc6b8" />
            <stop offset="100%" stopColor="#8f8578" />
          </radialGradient>
          <linearGradient id="scareBlood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c1121f" />
            <stop offset="100%" stopColor="#450509" />
          </linearGradient>
        </defs>

        {/* cranium + jaw silhouette */}
        <path
          fill="url(#skullShade)"
          stroke="#2a2521"
          strokeWidth="2"
          d="M200 20
             C110 20 58 84 58 172
             C58 224 78 258 96 286
             C108 304 104 322 118 334
             C120 356 118 372 132 380
             C140 402 150 420 170 430
             C182 436 176 452 200 452
             C224 452 218 436 230 430
             C250 420 260 402 268 380
             C282 372 280 356 282 334
             C296 322 292 304 304 286
             C322 258 342 224 342 172
             C342 84 290 20 200 20 Z"
        />

        {/* eye sockets — deep, angry, angled inward */}
        <path
          fill="#050403"
          d="M96 150 C120 120 168 122 178 168 C182 190 160 214 128 212 C100 210 80 182 96 150 Z"
        />
        <path
          fill="#050403"
          d="M304 150 C280 120 232 122 222 168 C218 190 240 214 272 212 C300 210 320 182 304 150 Z"
        />
        {/* wet red glint deep in the sockets */}
        <ellipse cx="140" cy="176" rx="16" ry="12" fill="#6d0a10" />
        <ellipse cx="260" cy="176" rx="16" ry="12" fill="#6d0a10" />

        {/* nasal cavity */}
        <path fill="#050403" d="M200 214 L182 268 C190 278 210 278 218 268 Z" />

        {/* blood pouring from the sockets */}
        <path
          fill="url(#scareBlood)"
          d="M126 208 C120 250 132 300 128 348 C126 366 138 366 140 348 C146 300 138 250 148 210 Z"
        />
        <path
          fill="url(#scareBlood)"
          d="M272 208 C280 244 270 288 276 330 C278 346 266 348 264 330 C258 292 264 250 252 210 Z"
        />

        {/* gnashing teeth — upper row + gaping lower jaw */}
        <g fill="#e9e2d6" stroke="#2a2521" strokeWidth="1.5">
          <path d="M150 300 h16 v34 q-8 8 -16 0 Z" />
          <path d="M170 302 h18 v40 q-9 9 -18 0 Z" />
          <path d="M192 303 h16 v42 q-8 9 -16 0 Z" />
          <path d="M212 302 h18 v40 q-9 9 -18 0 Z" />
          <path d="M234 300 h16 v34 q-8 8 -16 0 Z" />
        </g>
        <g fill="#d9d2c6" stroke="#2a2521" strokeWidth="1.5">
          <path d="M158 392 h15 v-30 q-7 -7 -15 0 Z" />
          <path d="M177 396 h16 v-34 q-8 -8 -16 0 Z" />
          <path d="M197 397 h16 v-35 q-8 -8 -16 0 Z" />
          <path d="M217 396 h16 v-34 q-8 -8 -16 0 Z" />
        </g>
        {/* cranial fracture */}
        <path
          fill="none"
          stroke="#2a2521"
          strokeWidth="2.4"
          strokeLinecap="round"
          d="M198 22 L214 60 L190 92 L212 128"
        />
      </svg>

      {/* blood wash + a hard black vignette to slam the focus in */}
      <div className="absolute inset-0 bg-accent/35 mix-blend-multiply" />
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 42vmin rgba(0,0,0,0.97)" }}
      />
    </div>
  );
}
