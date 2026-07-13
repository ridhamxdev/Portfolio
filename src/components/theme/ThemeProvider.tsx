"use client";

/**
 * Theme mode — NORMAL (the original "Observatory" portfolio) vs HORROR
 * (the "Séance" overlay). Normal is the strict default; horror is opt-in.
 *
 * Contract used across the app:
 *  - `useTheme().horror` (boolean) gates every horror-only effect.
 *  - `<html data-theme="horror">` drives all horror CSS (scoped in globals.css).
 *  - Choice persists in localStorage under THEME_KEY.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeMode = "normal" | "horror";
export const THEME_KEY = "portfolio-theme";

type ThemeContextValue = {
  mode: ThemeMode;
  horror: boolean;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR + first paint are always normal; a returning horror visitor is upgraded
  // on mount (and by the no-flash script in layout) to avoid a hydration mismatch.
  const [mode, setModeState] = useState<ThemeMode>("normal");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(THEME_KEY)) as ThemeMode | null;
    if (saved === "horror") {
      setModeState("horror");
      applyMode("horror");
    } else {
      applyMode("normal");
    }
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    applyMode(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked — fall back to in-memory only */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === "horror" ? "normal" : "horror");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, horror: mode === "horror", toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  // Outside the provider (or during isolated renders) fall back to normal so a
  // missing provider can never accidentally surface horror.
  if (!ctx) return { mode: "normal", horror: false, toggle: () => {}, setMode: () => {} };
  return ctx;
}

/** No-flash script: set data-theme from storage before first paint. Default normal. */
export const themeNoFlashScript = `(function(){try{var m=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=(m==='horror')?'horror':'normal';}catch(e){document.documentElement.dataset.theme='normal';}})();`;
