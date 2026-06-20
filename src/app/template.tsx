"use client";

import { motion } from "framer-motion";

// Opacity-only page transition (no transform — keeps `position: fixed`
// children like the work-index preview anchored to the viewport).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
