import type Lenis from "lenis";

/**
 * The single Lenis instance, owned by SmoothScroll. Kept in module state
 * (not on window) so consumers get real types and there is exactly one
 * scroll authority.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
