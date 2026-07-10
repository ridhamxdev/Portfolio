"use client";

import { Skull, Bone } from "lucide-react";

// A colossal skull bleeding through the dark — a watermark behind a section.
export function SkullWatermark({
  className = "",
  size = 640,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none ${className}`}
    >
      <Skull
        style={{ width: size, height: size }}
        strokeWidth={0.4}
        className="text-accent/[0.05]"
      />
    </div>
  );
}

// Crossed bones — a small skeletal divider glyph.
export function Crossbones({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative inline-flex h-5 w-5 ${className}`}>
      <Bone className="absolute inset-0 h-5 w-5 rotate-45 text-bone/40" strokeWidth={1.5} />
      <Bone className="absolute inset-0 h-5 w-5 -rotate-45 text-bone/40" strokeWidth={1.5} />
    </span>
  );
}
