// Tiny shared signal: the hero's scroll progress (0 → 1), written by the DOM
// (framer scrollYProgress) and read inside the R3F render loop, which lives in
// a separate reconciler and can't subscribe to React state cheaply per frame.
export const heroScroll = { p: 0 };
