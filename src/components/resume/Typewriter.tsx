"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fake-console typewriter (playbook 2.15): recursive setTimeout with 20-400ms
 * jitter per char — irregular reads as human. Starts on first intersection,
 * caret blinks via .caret and retires 1.5s after the line completes.
 */
export default function Typewriter({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const [caret, setCaret] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      setCaret(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let i = 0;

    const type = () => {
      i += 1;
      setShown(i);
      timer =
        i < text.length
          ? setTimeout(type, 20 + Math.random() * 380)
          : setTimeout(() => setCaret(false), 1500);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            io.disconnect();
            timer = setTimeout(type, 20 + Math.random() * 380);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {/* screen readers get the whole line, not the typing performance */}
      <span className="sr-only">{text}</span>
      {/* paper never sees a half-typed line */}
      <span aria-hidden="true" className="hidden print:inline">
        {text}
      </span>
      <span aria-hidden="true" className="print:hidden">
        <span>{text.slice(0, shown)}</span>
        {caret && (
          <span
            aria-hidden="true"
            className="caret inline-block h-[1em] w-[0.55em] bg-accent align-middle"
          />
        )}
      </span>
    </span>
  );
}
