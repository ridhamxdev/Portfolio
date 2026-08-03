# DESIGN.md — LEDGER (portfolio redesign, Aug 2026)

The visual world for this portfolio. Every new component follows this file.
Motion values come from `.claude/ANIMATION-PLAYBOOK.md` (§3 grammar); this file
is the palette/type/layout contract.

## Concept

**LEDGER** — a Swiss-editorial engineering ledger with two worlds:

- **PAPER (default, light):** cool off-white `#F4F4F0`, ink `#101014`, ONE accent:
  ultramarine `#2431FF`. Reads like a printed technical document.
- **VOID (dark):** blue-black `#07080C`, luminous type `#E8EAF2`, ONE accent:
  acid lime `#B8FF2E`. Same layout, inverted physics.
- The theme toggle performs a **circular View-Transition wipe** from the toggle
  button. The swap happens behind the wipe (playbook 2.11 pattern, new visual).

Never mix the two accents in one world. Never use red (retired SÉANCE world).
No horror imagery anywhere.

## Tokens (already in globals.css)

Use Tailwind utilities backed by semantic vars: `bg-bg`, `bg-surface`,
`text-ink`, `text-muted`, `text-faint`, `border-line`, `border-line-strong`,
`bg-accent`, `text-accent`, `text-accent-ink`. Components must never hardcode
hex values — both themes must work automatically.

## Type

- **Display:** Archivo variable, `font-stretch` 118–125%, weight 750–800,
  UPPERCASE. Helpers: `.display-xl`, `.display-lg`, `.display-md`.
- **Body:** Archivo normal width, 400/500. 16–18px, leading 1.55–1.65,
  `text-muted` for paragraphs, `text-ink` for emphasis.
- **Mono:** JetBrains Mono via `.label-mono` (labels, indexes, data). Ration it:
  max ~1 mono label per section.
- Emphasis inside display lines = same family italic or accent color, never a
  different font. No em-dashes anywhere in visible copy (use commas, periods,
  or hyphens).

## Layout

- Container `mx-auto max-w-[1440px] px-5 sm:px-10`.
- Asymmetric editorial grid; generous space (`py-24`+ sections); hairline rules
  (`.hairline` / `border-line`) organize content.
- Radius discipline: `rounded-none` or `rounded-full` ONLY.
- No box-shadows, no backdrop-blur, no glow. Depth = lines + spacing + motion.
- Buttons: pill (`rounded-full border border-line-strong px-6 py-4 font-mono
  text-xs uppercase tracking-[0.18em]`), hover = accent fill with
  `text-accent-ink`. One CTA intent per page. Accent hover color is reserved
  for genuinely interactive elements; plain ledger rows never adopt it.

## Motion (the law)

- Entrances: wrap section in `<Io>` (`@/components/system/Io`), children carry
  `rv-mask` (headlines), `rv-slot`+`rv-rise` (word slots), `rv-fade` (body),
  `rv-rule` (rules), `rv-curtain` (media), `rv-tick` (accent marks). Stagger
  with inline `style={{ "--rv-d": "0.12s" }}`.
- Easing: only the CSS vars `--ease-struct`, `--ease-snap`, `--ease-luxe`,
  `--ease-exit`, `--ease-micro`. GSAP: `expo.inOut` structure, `expo.out`
  decoration tails, `power4.in` exits.
- Durations: micro .1–.3s, standard .6–.9s, structural 1–1.5s. Slow build,
  instant release.
- Scroll-driven sections: JS writes ONE number (`--p`) via rAF lerp (factor
  0.1), CSS derives everything else with calc(). Pause off-screen.
- Respect `prefers-reduced-motion` in every JS effect (bail early).
- Composited props only: transform, opacity, clip-path.

## Voice

Plain, concrete, engineer-confident. No "elevate/seamless/unleash". Facts over
adjectives. All resume/portfolio claims must be verifiable from the repo data
(`src/data/projects.ts`, `src/data/resume.ts`).
