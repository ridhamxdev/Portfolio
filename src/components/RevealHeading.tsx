"use client";

import { motion } from "framer-motion";

// Mask reveal: the heading rises into view from behind a clipping line.
// The non-transformed wrapper is what's observed, so the trigger fires
// reliably (observing the translated child can push it out of view).
export default function RevealHeading({
  children,
  className,
  delay = 0,
  as = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}) {
  const Tag = motion[as];
  return (
    <motion.div
      className="overflow-hidden pb-[0.14em]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <Tag
        className={className}
        variants={{
          hidden: { y: "115%", opacity: 0 },
          show: { y: "0%", opacity: 1 },
        }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
