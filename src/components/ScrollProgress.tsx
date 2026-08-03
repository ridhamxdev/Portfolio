"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A 2px accent rule across the top that tracks reading progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print fixed inset-x-0 top-0 z-[150] h-[2px] origin-left bg-accent"
    />
  );
}
