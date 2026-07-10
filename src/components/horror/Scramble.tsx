"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01†✝⸸☠";

// Decodes text from static when it scrolls into view — a cursed transmission
// resolving into words. Each character locks in on its own staggered schedule.
export default function Scramble({
  text,
  className = "",
  as: Tag = "span",
  once = true,
}: {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const run = () => {
      const queue = [...text].map((to, i) => ({
        to,
        start: Math.floor(i * 2 + Math.abs(Math.sin(i * 12.9) * 18)),
        end: Math.floor(i * 2 + 18 + Math.abs(Math.sin(i * 4.3) * 26)),
      }));
      let frame = 0;
      const tick = () => {
        let out = "";
        let complete = 0;
        for (const q of queue) {
          if (frame >= q.end) {
            complete++;
            out += q.to;
          } else if (frame >= q.start) {
            // flicker a random glyph, occasionally in blood red
            const g = GLYPHS[Math.floor(Math.abs(Math.sin(frame * 7 + q.start)) * GLYPHS.length) % GLYPHS.length];
            out += `<span class="text-accent/80">${g}</span>`;
          } else {
            out += q.to === " " ? " " : "";
          }
        }
        el.innerHTML = out;
        if (complete === queue.length) return;
        frame++;
        raf.current = requestAnimationFrame(tick);
      };
      tick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && (!done.current || !once)) {
            done.current = true;
            run();
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [text, once]);

  return (
    // @ts-expect-error dynamic tag with ref
    <Tag ref={ref} className={className} suppressHydrationWarning>
      {display}
    </Tag>
  );
}
