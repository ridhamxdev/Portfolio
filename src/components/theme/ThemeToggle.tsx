"use client";

import { useTheme } from "./ThemeProvider";

/**
 * An aperture: a ring holding a disc that eclipses between full (paper) and
 * new-moon (void). Clicking hands the pointer position to the provider so the
 * circular wipe grows from exactly here.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to the light world" : "Switch to the dark world"}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong transition-colors duration-300 hover:border-accent ${className}`}
      data-cursor
    >
      <span className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-ink transition-colors duration-300 group-hover:border-accent">
        {/* the eclipsing disc slides across on toggle — hold-then-snap curve */}
        <span
          className="absolute inset-0 rounded-full bg-ink transition-transform duration-500 group-hover:bg-accent"
          style={{
            transform: dark ? "translateX(55%)" : "translateX(0%)",
            transitionTimingFunction: "var(--ease-snap)",
          }}
        />
      </span>
    </button>
  );
}
