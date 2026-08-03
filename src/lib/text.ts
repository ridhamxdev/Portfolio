/**
 * Copy discipline (DESIGN.md): no em/en dashes reach the page. Project data
 * predates the rule, so every consumer normalizes through this ONE helper —
 * identical strings must render identically on every page.
 */
export const cleanDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ", ");
