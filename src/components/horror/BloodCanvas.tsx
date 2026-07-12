"use client";

import { useEffect, useRef } from "react";

// Wet, running blood on a full-screen canvas. Drips crawl down from the top edge
// and pool; clicking anywhere throws a splatter; every so often a fresh splatter
// blooms on its own. Blood persists (the canvas is never cleared) so the page
// slowly bleeds. pointer-events:none — it never blocks the site underneath.
export default function BloodCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const RED = ["#c1121f", "#8a0d16", "#6d0a10", "#450509"];
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

    // one irregular blood blob with a faint wet highlight
    const blob = (x: number, y: number, r: number, color: string, alpha = 0.9) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const pts = 9;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const rr = r * (0.72 + Math.random() * 0.5);
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // wet specular dot
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = "#e0413a";
      ctx.beginPath();
      ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // a splatter: a core, scattered satellites, and a few flung streaks
    const splatter = (x: number, y: number, scale = 1) => {
      const base = pick(RED);
      blob(x, y, (14 + Math.random() * 10) * scale, base, 0.92);
      const n = 10 + Math.floor(Math.random() * 10);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = (10 + Math.random() * 60) * scale;
        blob(
          x + Math.cos(a) * d,
          y + Math.sin(a) * d,
          (1.5 + Math.random() * 5) * scale,
          pick(RED),
          0.6 + Math.random() * 0.35
        );
      }
      // thin flung streaks
      ctx.save();
      ctx.strokeStyle = base;
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2;
        const len = (20 + Math.random() * 50) * scale;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = (1 + Math.random() * 2.5) * scale;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    };

    // running drips that grow downward, then pool at the bottom of their run
    type Drip = { x: number; y: number; end: number; w: number; c: string; v: number; pooled: boolean };
    const drips: Drip[] = [];
    const spawnDrip = (x?: number) => {
      if (drips.length > 26) return;
      drips.push({
        x: x ?? Math.random() * W,
        y: -4,
        end: (H * 0.25) + Math.random() * H * 0.6,
        w: 1.4 + Math.random() * 3.2,
        c: pick(RED),
        v: 0.5 + Math.random() * 1.4,
        pooled: false,
      });
    };

    // seed some drips + a couple of corner splatters at start
    for (let i = 0; i < 7; i++) spawnDrip();
    splatter(W * 0.08, H * 0.06, 1.1);
    splatter(W * 0.94, H * 0.1, 0.9);

    let raf = 0;
    let frame = 0;
    const tick = () => {
      frame++;
      // extend each active drip a little — never clearing, so the trail stays wet
      for (const d of drips) {
        if (d.pooled) continue;
        const step = d.v;
        ctx.save();
        ctx.strokeStyle = d.c;
        ctx.lineCap = "round";
        ctx.lineWidth = d.w;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        d.y += step + Math.random() * step;
        d.x += (Math.random() - 0.5) * 0.6;
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
        // a swelling bead at the leading edge
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = d.c;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.w * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (d.y >= d.end) {
          d.pooled = true;
          blob(d.x, d.end, d.w * 2.4 + Math.random() * 6, d.c, 0.8);
        }
      }
      // occasional fresh drip; rarer spontaneous splatter
      if (frame % 90 === 0) spawnDrip();
      if (frame % 520 === 0) {
        splatter(Math.random() * W, Math.random() * H * 0.7, 0.7 + Math.random() * 0.6);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onClick = (e: MouseEvent) => splatter(e.clientX, e.clientY, 0.85 + Math.random() * 0.6);
    const onResize = () => size(); // note: resizing wipes the canvas — acceptable
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[52]"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
