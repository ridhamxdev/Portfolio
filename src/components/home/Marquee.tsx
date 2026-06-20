"use client";

import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";

const items = [
  "Distributed systems",
  "Real-time",
  "Event-driven",
  "AI agents",
  "Machine learning",
  "Microservices",
  "Socket.io",
  "NestJS",
  "Redis",
  "RabbitMQ",
  "Prisma",
  "Next.js",
  "PostgreSQL",
  "Docker",
];

export default function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });

  return (
    <section className="relative border-y border-line py-6">
      <motion.div style={{ skewX }} className="edge-fade-x flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...items, ...items].map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-2xl text-bone/80 sm:text-3xl">{t}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
