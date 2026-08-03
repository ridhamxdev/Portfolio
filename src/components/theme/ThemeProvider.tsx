"use client";

/**
 * Two worlds: PAPER (light, default) and VOID (dark). The swap itself is a
 * circular View-Transition reveal that grows from the toggle button, so the
 * theme change reads as a physical aperture opening, never a flash
 * (playbook 2.11: hide the swap behind a physical transition).
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

export type ThemeMode = "light" | "dark";
export const THEME_KEY = "portfolio-theme";

type ThemeContextValue = {
  mode: ThemeMode;
  dark: boolean;
  /** Toggle the world; pass the pointer origin so the wipe grows from it. */
  toggle: (origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function apply(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

function persist(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage blocked; in-memory only */
  }
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  // SSR paints light; a returning dark visitor is upgraded before first paint
  // by the no-flash script, and React state syncs here.
  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setMode("dark");
  }, []);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: ThemeMode = mode === "dark" ? "light" : "dark";
      const doc = document as DocWithVT;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const swap = () => {
        apply(next);
        setMode(next);
        persist(next);
      };

      if (reduced || !doc.startViewTransition) {
        swap();
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const vt = doc.startViewTransition(swap);
      vt.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            {
              duration: 900,
              easing: "cubic-bezier(0.86, 0, 0.07, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {
          /* a skipped view transition is a normal outcome */
        });
    },
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, dark: mode === "dark", toggle }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { mode: "light", dark: false, toggle: () => {} };
  return ctx;
}

/** Set data-theme from storage before first paint. Anything but "dark" is light. */
export const themeNoFlashScript = `(function(){try{var m=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=(m==='dark')?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;
