"use client";

import { Skull } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/**
 * A skull that slides across a bone-track. Dormant (bone-white, still) in normal
 * mode; awakened — sliding across, glowing blood-red — when Séance/horror is on.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { horror, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      onClick={toggle}
      aria-checked={horror}
      aria-label={horror ? "Switch to normal mode" : "Switch to horror mode"}
      title={horror ? "Exit Séance — back to normal" : "Enter Séance — horror mode"}
      className={`group relative inline-flex h-8 w-[3.5rem] shrink-0 items-center rounded-full border px-1 transition-colors duration-500 ${
        horror
          ? "border-accent/70 bg-accent/[0.14] shadow-[0_0_18px_-3px_rgba(193,18,31,0.75),inset_0_0_12px_-5px_rgba(193,18,31,0.9)]"
          : "border-line-strong bg-void/60 hover:border-accent/50"
      } ${className}`}
    >
      {/* faint skull ghost on the far side you're sliding toward */}
      <Skull
        aria-hidden
        strokeWidth={1.4}
        className={`pointer-events-none absolute h-3.5 w-3.5 transition-opacity duration-500 ${
          horror ? "left-1.5 text-accent/40 opacity-100" : "right-1.5 text-bone/25 opacity-100"
        }`}
      />

      {/* sliding skull knob */}
      <motion.span
        initial={false}
        animate={{ x: horror ? "1.5rem" : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-500 ${
          horror ? "bg-accent/25" : "bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
        }`}
      >
        <Skull
          strokeWidth={1.7}
          className={`h-4 w-4 transition-colors duration-500 ${
            horror ? "text-accent" : "text-bone/75 group-hover:text-bone"
          }`}
          style={horror ? { filter: "drop-shadow(0 0 6px rgba(193,18,31,0.95))" } : undefined}
        />
      </motion.span>
    </button>
  );
}
