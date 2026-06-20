"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

// Counts up to a numeric value when scrolled into view; passes non-numeric
// values (e.g. "'26", "TS / PY") through unchanged.
export default function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const numeric = /^\d+$/.test(value);
  const [display, setDisplay] = useState(numeric ? "0".padStart(value.length, "0") : value);

  useEffect(() => {
    if (!inView || !numeric) return;
    const end = parseInt(value, 10);
    const controls = animate(0, end, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v)).padStart(value.length, "0")),
    });
    return () => controls.stop();
  }, [inView, numeric, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
