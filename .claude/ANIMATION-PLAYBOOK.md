# ANIMATION TECHNIQUE PLAYBOOK
### Reference: vansiadev.vercel.app → Target: original Next.js 16 + Tailwind v4 portfolio
*Everything in §1–3 is verified from deployed-code audits (bundle, HTML, CSS). §4 is the differentiation plan.*

---

## 1. VERIFIED TECH STACK (reference site)

| Layer | What's actually shipped | Evidence |
|---|---|---|
| Framework | **Astro v5.7.13** (NOT Next.js) — per-section island scripts, one React island in the hero | meta generator tag, `/_astro/` bundles |
| Animation core | **GSAP 3.13.0** + CSSPlugin | `Ticker.Cil3FhVt.js` banner |
| GSAP plugins | **ScrollTrigger 3.13.0** (Observer bundled), **SplitText 3.13.0** (Club), **DrawSVGPlugin 3.13.0** (registered but *unused*), **EasePack** (`slow(0.15,0.6)` used once) | plugin banners in section bundles |
| Smooth scroll | **Lenis 1.3.3**, instantiated with **zero options** (`new Lenis()`) | `window.lenisVersion` |
| GSAP↔Lenis glue | `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` — the canonical pattern, verbatim | `index...DDfz7pHO.js` |
| NOT present | ScrollSmoother, Flip, Draggable, MotionPath, CustomEase, three.js, framer-motion, lottie, barba/swup, locomotive, matter.js, backdrop-filter, CSS `filter`, `clamp()`, `@property`, scroll-snap, view-timeline | negative greps confirmed |
| Infra patterns | Custom `Emitter` event bus (`tick/scroll/resize/mousemove`), global IntersectionObserver dispatching `intersect` CustomEvents, custom elements (`<a-work>`, `<a-separator>`) with `attributeChangedCallback`, sections pause rAF work when off-screen | bundle reads |
| Fonts | Self-hosted woff2, preloaded, `font-display:swap`: Bigger Display 700 (display), PP Editorial New 400/200 (serif body), PP Fraktion Mono 400/700 | CSS `@font-face` |
| Color system | Strict 2-color: `--color-primary:#f40c3f`, `--color-secondary:#160000`, `--color-shadow:#540000`, `--color-white:#fff0eb`; `.theme-contrasted` swaps primary→`#fff2ed` | `:root` vars |

**Key takeaway:** the "premium" feel comes from ~90% hand-rolled systems (CSS-var rigs, rAF lerps, canvas physics) with GSAP as the sequencer — not from heavyweight libraries. Only **one** ScrollTrigger on the whole page. No pinning, no WebGL, no blur.

---

## 2. TECHNIQUE INVENTORY

Each entry: **mechanics → measured values → Next.js App Router implementation note.** Global assumption for all notes: `'use client'` components, `useGSAP(() => {...}, { scope: containerRef })` from `@gsap/react` (auto-cleanup via `gsap.context`), Lenis in a top-level provider.

### 2.1 Intro preloader sequence (the "expensive first impression")
- **Mechanics:** Fixed full-screen overlay (`.site-intro`, hardcoded `#F40C3F`, `z-index:50`) over a page wrapper at inline `opacity:0`, with `<html class="is-scroll-blocked">` locking scroll. One master timeline: logo bars `fromTo(scaleY:0 → 1)`, then `set(transformOrigin:"50% 0")` + `fromTo(scaleY:1 → 0, immediateRender:false)` (wipe in from bottom, wipe out through top), while 3 border divs draw in. At the end it fires `document.dispatchEvent(new CustomEvent("intro"))` at offset `"-=1.85"` — sections listen for `intro` to start their own entrances *before* the overlay fully clears.
- **Values:** bars in: `1s power4.inOut, stagger .15`; bars out: `1s power4.in, stagger .1` at absolute time `2`; borders: `from(scaleY:0, 3s, power3.inOut)` at time `1`; handoff overlap `-=1.85`.
- **Next.js:** Preloader as client component in `app/layout.tsx` (or template); replace the CustomEvent with a small zustand store / React context flag (`introDone`) that hero/section `useGSAP` effects gate on; lock scroll via `lenis.stop()` + restore in the timeline's `onComplete`. Keep `immediateRender:false` on the second `fromTo` — it's what makes the two-phase wipe work.

### 2.2 Lenis + GSAP single-ticker integration
- **Mechanics:** Lenis is *not* self-rAF'd; GSAP's ticker drives it (`gsap.ticker.add(t => lenis.raf(t*1000))`), `lagSmoothing(0)` disabled so scroll never desyncs, `lenis.on('scroll', ScrollTrigger.update)`. `window.lenis` exposed globally. `data-lenis-prevent` on scrollable sub-areas.
- **Next.js:** `LenisProvider` client component wrapping `{children}` in layout; expose via context. Do the ticker wiring once in the provider's `useGSAP`; every other component reads scroll from ScrollTrigger, never adds its own listener.

### 2.3 Anchor nav with hand-rolled easing
- **Mechanics:** Nav links call `lenis.scrollTo(target, { duration: 1.5, easing: s => s<.5 ? 16*s**5 : 1+16*(--s)**5 })` — a quintic in-out, snappier than Lenis defaults.
- **Next.js:** Same call in nav `onClick`; prevent default on hash links so Next router doesn't jump.

### 2.4 SplitText char "slot-machine" hero
- **Mechanics:** `new SplitText(words, {type:"words,chars", charsClass:"char", wordsClass:"word"})`; each char wrapped in `.char__inner` carrying `data-letter`, rendered as a **tri-stacked glyph** via `content: attr(data-letter) attr(data-letter) attr(data-letter)` (three copies stacked vertically inside an overflow-hidden slot). Intro tween slides the stack; afterwards an idle rAF randomly "rolls" chars by toggling classes `to-top/right/bottom/left` mapped to CSS keyframes `s-hero-move-to-*` (`translate3d(±100%)`).
- **Values:** intro: `fromTo(y:"-200%" → "-100%", 2s, expo.inOut, stagger .02)` at time `.45`; idle roll gated by `Math.random() > .01` per tick per char (≈ rare, organic); roll keyframes `1s cubic-bezier(.86,0,.07,1) forwards`.
- **Next.js:** SplitText 3.13 is now free with GSAP; run inside `useGSAP` **after** `document.fonts.ready` (the bundle literally warns "SplitText called before fonts loaded"). Revert split on cleanup. Idle roller = one `gsap.ticker` callback, removed on unmount; gate on section visibility (IO) to avoid off-screen work.

### 2.5 Hero master reveal (clip-path + layered offsets)
- **Mechanics:** After `intro` fires: title block revealed with polygon clip-path unfold (top edge grows downward), a spacer collapses (`scaleY:.025, y:-height`), waves island rises from below, star asset spins in late.
- **Values:** `fromTo(clipPath: "polygon(0 0,100% 0,100% 0,0 0)" → full rect, 1s, expo.inOut)` at `1`; waves `from(y:"100%", 1.35s, expo.out)`; star `from(rotate:90, 2s, expo.out)` at `1.5`. Note the pattern: **aggressive inOut for structure, long expo.out tails for decoration.**
- **Next.js:** One timeline in the hero's `useGSAP`, `paused:true`, `.play()` on the intro-done flag.

### 2.6 The one true ScrollTrigger: scrubbed work section ("sticky-in-CSS", no pin)
- **Mechanics:** The section sets its own scroll runway in JS: `el.style.setProperty("--height", Math.max(workCount,5)*50 + "lvh")` and the inner scene is `position:sticky` in CSS — **no ScrollTrigger pinning** (avoids pin-spacer jank with Lenis). A single scrubbed master timeline drives everything: mask blow-up, clip-path inset release, a **plain JS object tween** (`fromTo(this, {animationProgress:0},{animationProgress:1e4, ease:"power1.out"})`) consumed by a canvas render, and a tween of a **custom-element attribute**: `fromTo(workEls, {attr:{progress:1}}, {attr:{progress:-1}, ease:"slow(0.15,0.6)", stagger:.25})` — each `<a-work>` observes `progress` in `attributeChangedCallback`, writes it to `--progress`, and plays/pauses its `<video>` near center.
- **Values:** `scrollTrigger:{ start:"top 25%", end:"bottom 75%", scrub: 1 }`; mask `scale:1→maxScale, .75s of timeline, power4.in`; `clipPath:"inset(0 1rem)"→"inset(0 0)"`, `.75s, power3.in`; card carousel transform lives in **CSS**: `rotateY(calc(var(--progress)*-20deg)) translate3d(calc(var(--progress)*(50vw + 100%) - 50%), …, calc(var(--progress)*var(--progress)*-5rem)) scale(var(--size))` — JS writes one number, CSS does the quadratic depth math.
- **Next.js:** Same architecture: tall section (`style={{height: 'calc(var(--n)*50lvh)'}}`) + `sticky top-0 h-screen` child; one scrubbed timeline in `useGSAP`. Instead of custom elements, tween `--progress` directly on card refs (`gsap.quickSetter(el, "--progress")` or `attr` on data-attrs) and keep the heavy transform math in Tailwind arbitrary values / CSS. Play/pause videos in an `onUpdate` threshold check.

### 2.7 IntersectionObserver reveal system (the workhorse)
- **Mechanics:** ONE global IO watches every `[data-intersect]` element, dispatches an `intersect` CustomEvent and toggles state classes `is-in-view` / `is-out-of-view-top` / `is-out-of-view-bottom`. All entrance animations are **CSS transitions keyed off these classes** (clip-path inset reveals, translate/scale), so GSAP isn't needed for routine reveals — and directional classes give free "exit up vs exit down" awareness.
- **Next.js:** One `useIntersect` hook (or a provider owning a single IO) that sets a `data-state` attribute; author reveals as Tailwind variants (`data-[state=in-view]:translate-y-0` etc.). This is cheaper and more robust than N ScrollTriggers for simple reveals.

### 2.8 Lerped scroll progress → CSS custom properties
- **Mechanics:** Per section, a rAF tick computes viewport progress (`ScrollTrigger.positionInViewport()` used purely as math), then smooths it: `sp += (p - sp) * 0.1` (or `0.2`), and writes `--scroll-progress` / `--offset-y` on the section. CSS consumes it for parallax-ish drift. Sections skip the tick entirely when IO says off-screen.
- **Next.js:** `gsap.ticker.add` per section inside `useGSAP`, guarded by the IO state; write vars with `gsap.quickSetter(el, "--scroll-progress")`. Lerp factors 0.1–0.2 are the reference's "weight".

### 2.9 CSS-variable math channels (parabolas for free)
- **Mechanics:** JS writes one raw var; CSS derives curves: `--head: calc((var(--progress) - .5) * -2); --ahead: calc(var(--head) * var(--head))` — a parabola (peak at center of travel) computed in CSS and fed into transforms. Also `--bg-p` gradient fill (QR tile fills row-by-row via hard-stop gradient), `--distortion` scaling `perspective` in em units.
- **Next.js:** Adopt wholesale — it's the single highest-leverage pattern here: one `quickSetter` per section, unlimited derived motion in CSS. Tailwind v4's CSS-first config makes registering these vars trivial.

### 2.10 Custom scrollbar
- **Mechanics:** Native scrollbar hidden (`scrollbar-width:none`); fixed-right custom track + thumb driven by `window.scrollProgress`, writing `--scrollbar-height` / `--scrollbar-top`, thumb positioned `translate:-50% var(--scrollbar-top)`; draggable (drag maps back to scroll position); collapses via `scale:0 1` axis-collapse during transitions. Thumb hover: `scale .2s cubic-bezier(.215,.61,.355,1)`.
- **Next.js:** Client component reading Lenis's `scroll` event → progress var; drag handler calls `lenis.scrollTo(fraction * limit, {immediate:false})`.

### 2.11 Theme toggle wipe
- **Mechanics:** A fixed full-screen `.site-contrast-mask` (`background:#f40c3f; mix-blend-mode:darken; translate3d(-100%,0,0)`). Toggle: `fromTo(mask, {x:"0"}, {x:"-100%", duration:1, ease:"expo.inOut", onComplete: () => { html.classList.toggle("theme-contrasted"); emit("contrastchange") }})` — the blend-mode mask wipes across, the actual var swap happens *behind* the wipe, so the theme change reads as a physical squeegee, not a flash.
- **Next.js:** Identical; swap a class on `<html>` (next-themes or manual). This beats the usual crossfade — steal the *pattern*, change the visual (see §4).

### 2.12 CTA "breathing" pulse loop
- **Mechanics:** Infinite timeline: slow inhale, instant exhale. `tl = gsap.timeline({repeat:-1, repeatDelay:.5}); tl.fromTo(btn, {scale:.85},{scale:1.05, duration:2.7, ease:"power2.in"}); tl.to(btn, {scale:.85, duration:.15, ease:"power4.out"})`. The **18:1 duration asymmetry** is the whole trick — it reads as alive, not looping.
- **Next.js:** Trivial; kill on unmount (useGSAP handles it). Pause when off-screen.

### 2.13 Magnetic hover zone + iris button
- **Mechanics:** `.js-hover` rig around the GO button (magnetic follow via the mousemove bus + lerp — same spring math as 2.16). Button opens with a clip-path iris: `circle(0 at 50% 50%)` → `circle(50%)`, close `.6s cubic-bezier(.86,0,.07,1)`, open `1s cubic-bezier(1,0,0,1) .2s` — the `(1,0,0,1)` curve holds at 0 then snaps, mechanical-shutter feel. Cursor-adjacent element transitions `width .1s, background-color .1s` easeOutCubic.
- **Next.js:** Magnetic = `onMouseMove` → `gsap.quickTo(el, "x"/"y", {duration:.4, ease:"power3"})`; reset with `quickTo(0)` on leave. Iris = CSS transition on a state class.

### 2.14 Per-char CTA slice choreography (pure CSS orchestra)
- **Mechanics:** "To Infinity" chars each contain **4 duplicate slice spans**; animation is entirely CSS keyframes driven by per-char custom props: `--delay` steps .1s→1s per char, `--offset` variants .02s+.04s/.08s/.12s per slice, `--toggle-delay: calc(var(--delay) + var(--offset) + .45s)`. Keyframes: `s-cta-char-up-down` (0 → -52% → +52% → 0 with **different easing per keyframe segment**: out-cubic, in-out-quad, in-quart) and `s-cta-char-toggle` (hard opacity swap at 50.01% between stacked layers).
- **Next.js:** Author as CSS with `style={{'--delay': `${i*0.1}s`}}` per char — zero JS runtime cost, infinitely looping, GPU-only. Per-keyframe `animation-timing-function` switching is the pro move; copy the technique, not the shape.

### 2.15 Fake-console typewriter + binary separators
- **Mechanics:** Empty div JS-filled char-by-char with randomized per-char delays **20–400ms** (irregular = human), caret via `site-head-caret` blink keyframe. `<a-separator>` strips of 1/0 char spans revealed with `blink-in .3s cubic-bezier(1,0,0,1) forwards` — the flicker keyframe (opacity 0 at 0/30/60%, 1 at 15/45/75/100%) gives a neon-stutter entrance.
- **Next.js:** Typewriter = recursive `setTimeout` with `20 + Math.random()*380`; separators = map over chars with staggered `animation-delay`.

### 2.16 Hand-rolled spring/physics systems (no library)
Three separate rigs, all using the same two-line spring: `v += (target - current) * k; v *= damping` with k≈.075 and damping≈.9:
- **SCTA wave grid:** points get velocity from cursor (`vx += Math.cos(angle)*force*.5*strength; vx *= .9`), custom decay `easeOut(t) = 1 - 2^(-10t)`, SVG path `d` rebuilt every tick; GSAP only fades wave opacity in (`1.2s expo.inOut, delay .3, overwrite:true`).
- **SMyWay draggable 3D throws:** objects positioned entirely by CSS vars `--x/--y/--z/--rx/--ry/--rz/--s` composed into one transform under `perspective:40rem`; gravity `vy += .5`; objects fly in from `z:-20000`; spring-follow while dragging; on vanish, the **sprite-sheet mask dissolve**: `mask:url(sprite-vanish.png) left/3000% 100%; animation: vanish .75s steps(29,end) both` (30-frame disintegration with zero JS).
- **SAbout canvas smileys:** hovering award rows throws canvas-drawn smiley particles: `vy = Math.random()*-10-5; tick: vy += .45; rotation += vr`.
- **Next.js:** Keep these as plain classes/functions driven by one `gsap.ticker` callback per section; render targets are CSS vars or a `<canvas>` ref. Do NOT reach for a physics lib for this scale.

### 2.17 Clip-path text & image reveal vocabulary (22 uses)
- **Line horizon reveals:** `clip-path: inset(calc(100% - .03em) 0 0 0)` → `inset(0)` in staged steps (.03/.06/.09em thresholds = 3-line stagger) — text emerges from its own baseline.
- **Split-half text:** two stacked copies clipped `inset(calc(50% + .01em) 0 -100% 0)` / mirrored — meet at the middle.
- **Corner-polygon wipes:** `polygon(100% 0,100% 0,100% 100%,100% 100%)` → full rect.
- **Icons with zero SVG elements:** `clip-path: var(--path)` where `--path: path('M8 0C3.58…')` inline — GitHub/LinkedIn logos are clipped `<span>`s that inherit `currentColor` for free.
- **Next.js:** All CSS-transition-driven off IO state classes (2.7). The `.01em`/`.03em` fudge values prevent shimmer at clip edges — keep them.

### 2.18 steps() mechanical morph & instant-after-delay
- **Mechanics:** `v-mutate` keyframes morph a decor box through 3 shapes (square → dotted ellipse rotate(15deg) → pill rotate(-5deg)) with `steps(1)` over 5s infinite — hard cuts, blueprint feel. Sprite dissolve uses `steps(29,end)`. Separately, the "instant-after-delay" trick: `transition: transform 0s linear .3s` (property snaps after a beat — used to reset things invisibly).
- **Next.js:** Pure CSS; great for decorative "engineering drawing" furniture.

### 2.19 Duplicated-layer lens distortion ("Live Long & Prosper")
- **Mechanics:** Same text rendered twice — `--distorted` wrapper and `--normal` wrapper — with the distorted copy under `perspective: calc(var(--distortion) * .7em)` (perspective *in em, scaled by a JS-written var*); scroll/pointer drives `--distortion`, creating a lens/warp with zero WebGL and zero filters.
- **Next.js:** Two stacked spans + one quickSetter var. Cheap magic.

### 2.20 System hygiene (why it never jitters)
- One event bus for `tick/scroll/resize/mousemove`; sections subscribe/unsubscribe on IO visibility. `will-change` used deliberately (34×, mostly `transform`/`scale`). Zero box-shadows, zero filters/blur — everything animatable stays on the compositor. Browser-sniff classes (`is-safari`, `is-android`) for targeted fallbacks. Scroll locked during intro (`is-scroll-blocked`). Videos: `preload="metadata"`, muted, loop, played only near viewport center.
- **Next.js:** Replicate with: single Lenis+ticker provider, IO provider, `next/dynamic` for heavy sections, and the same "no blur, no shadow, composited-props-only" discipline.

---

## 3. POLISH VOCABULARY (steal these numbers)

### Easing palette — two vocabularies, used with intent
**JS (GSAP) tweens:**
| Ease | Count | Role |
|---|---|---|
| `expo.inOut` | 9 | structural moves: clip reveals, wipes, theme mask — "the machine acting" |
| `power4.inOut` | 6 | intro logo bars, big blocks |
| `power4.in` / `power3.in` | 4/2 | exits & scrub-timeline accelerations (things *leaving* accelerate) |
| `expo.out` | 4 | decorative long tails: waves, star rotation — "settle" |
| `power3.inOut` | 4 | border draws |
| `slow(0.15,0.6)` | 1 | the work-card drift (plateau in the middle = readable cards) |
| hand-rolled quintic | 1 | anchor scrolling |

**CSS cubic-beziers (frequency-ranked):**
- `(.86,0,.07,1)` ×9 — house inOut-quint; anything structural in CSS
- `(1,0,0,1)` ×8 — **the signature**: full hold-then-snap, shutter/mechanical feel (iris open, color snaps, blink-in)
- `(.23,1,.32,1)` ×7 — outQuint for long luxe settles (`scale 1.8s .6s`, `2s .4s`)
- `(.55,.055,.675,.19)` ×6 — inCubic for departures
- `(.215,.61,.355,1)` ×5 — outCubic for micro-interactions (.1–.5s)
- `(.19,1,.22,1)` ×2 — outExpo with 1s delay for late arrivals
- **Zero** default `ease`/`ease-in-out` anywhere. Every curve is chosen.

### Duration grammar
- Micro-interactions: **.1–.3s** (cursor-adjacent, color, thumb)
- Standard moves: **.6–.8s** (CSS), **.75/1s** (GSAP)
- Hero/structural: **1–1.5s** (+ **1.35s/2s** decorative tails)
- Ceremony: **2–3s** (border draws, char cascade), always inOut or out
- The asymmetry rule: slow build → instant release (2.7s in / 0.15s out pulse; `(1,0,0,1)` everywhere). Tension-and-snap is the brand.

### Staggers
- Chars: **.02** · list items/lines: **.1–.15** · big cards: **.25** · logo bars: **.1/.15** · CSS per-char delays: **.1s steps up to 1s**, slice offsets **.02/.04/.08/.12s**, derived delays via `calc()` chains.

### Choreography patterns
1. **Overlap everything:** intro hands off at `-=1.85`; absolute position params (`,1`, `,.45`, `,1.5`) instead of sequential chaining. Nothing waits for anything to finish.
2. **Structure-then-ornament:** aggressive inOut reveals the frame; expo.out tails animate decoration 0.5s later, twice as long.
3. **Two-curve motion:** different bezier per property on one element (`translate 1s outQuint, scale 1.5s (.86,0,.07,1)`) — motion feels compound, organic.
4. **Per-keyframe easing switches** inside one @keyframes block (CTA chars).
5. **Randomness gates** for idle life: `Math.random() > .01` per frame, typewriter 20–400ms jitter.
6. **JS writes one number, CSS does the math:** quadratic depth (`var(--progress)*var(--progress)`), parabola channels, gradient fills.
7. **Lerp constants:** scroll smoothing `0.1–0.2`; springs `k=.075, damping=.9`; gravity `.45–.5/frame`.
8. **Radius discipline:** only `0`, `50%`, `999rem` — sharp or round, nothing in between. Line-heights: display **0.8**, body **1.48**; tracking **-.025em** body, **+.04–.15em** mono labels.

---

## 4. WHAT TO DO DELIBERATELY DIFFERENTLY

The reference's identity = red 2-color monochrome, brutalist-terminal, single vertical page, DOM/canvas-2D only, no cursor, no pinning, serif body + display sans. Original ≠ copying any of those. Concrete opportunities:

1. **Own the WebGL layer they don't have.** The reference fakes 3D with CSS perspective and 2D canvas. You have Three.js: make the signature hero an R3F scene — e.g., a shader-distorted plane behind split-text, or scroll-morphing geometry — driven by the *same* architecture (one scrubbed value → uniform, lerped at 0.1). Use `drei`'s `<View>` to keep one canvas across sections. This alone makes the site categorically un-comparable.

2. **Use pinning + horizontal scroll where they used sticky-vertical.** Their work section is a vertical sticky runway with a rotateY carousel. Do a **pinned horizontal gallery** (`ScrollTrigger pin + x-scrub + containerAnimation` for nested triggers) or a pinned "chapter" storytelling section — techniques the reference provably never uses (only one ScrollTrigger, zero pins).

3. **WebGL image/video distortion on hover instead of plain `<video>` cards.** Their cards are muted videos with a CSS carousel. Do curl/RGB-shift/displacement shaders on project media (R3F + custom material), with the hover intensity fed through the same spring math (`v += (t-c)*.075; v *= .9`).

4. **Add the two classic tools they skipped: custom cursor and page transitions.** No cursor element exists in their markup, and the site is single-page (sitemap = "/" only). You're on App Router: build real routes (`/work/[slug]`) with **Flip-plugin shared-element transitions** (card → case-study hero) or Next View Transitions + Framer Motion `AnimatePresence` for exit choreography. A magnetic blend-mode cursor that morphs over interactive zones is instant differentiation.

5. **Different theme mechanic, same wipe philosophy.** Keep the "physical transition hides the swap" pattern (2.11) but change the physics: a **View Transition API circular reveal from the toggle button**, or an R3F shader dissolve — not a horizontal blend-mode squeegee. And use a different palette archetype entirely (their space: red/near-black warm monochrome — go e.g. cool paper-white editorial with one electric accent, or deep-space dark with luminous type).

6. **Variable font + `@property` motion — modern CSS they don't touch.** Reference uses static weights, no `@property`, no `clamp()`, no scroll-driven animations. Animate `font-variation-settings` (weight/width) on scroll or hover for headline "breathing", register animation vars with `@property` for transition-able custom properties (their `--progress` rigs can't transition; yours can), use `clamp()` fluid type, and ship CSS `animation-timeline: scroll()` as progressive enhancement for reveals.

7. **Different layout archetype.** Theirs: full-bleed centered vertical scenes, 4-col awards grid, no page container. Options they don't occupy: asymmetric editorial grid with hung punctuation and rulers, a bento/index "table of contents" homepage where rows expand (Flip), or a split-screen layout with an independent sticky media pane. Keep their *rhythm system* idea (`--padding` var scaling both spacing AND type size per section — genuinely great) but with your own scale.

8. **Steal the invisible systems, not the visuals.** Port verbatim: single ticker + Lenis wiring (2.2), one-IO reveal system (2.7), CSS-var-as-animation-channel with CSS-side math (2.9), off-screen rAF pausing, the easing frequency table and duration grammar (§3), "no blur/no shadow/composited-only" performance discipline, and the slow-build/instant-snap asymmetry. These are the parts that read as "expensive" and are invisible to plagiarism — the tri-stacked slot chars, binary separators, red monochrome, VV bar logo, smileys, and "To Infinity" slice text are the parts that read as "copied" and must not appear.

**Priority build order for the redesign:** Lenis/ticker provider + IO system → preloader with overlapped handoff → R3F hero signature moment → pinned horizontal work gallery with shader media → Flip page transitions → custom cursor → theme reveal → idle-life details (randomized micro-motion, breathing CTA with your own shape).