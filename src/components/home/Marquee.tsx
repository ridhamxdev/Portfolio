"use client";

import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
} from "framer-motion";
import { Skull } from "lucide-react";
import BloodDrip from "@/components/horror/BloodDrip";
import { useTheme } from "@/components/theme/ThemeProvider";

// Pure tech terms — the default marquee.
const baseItems = [
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

// Macabre phrases spliced in only when horror mode is on.
const horrorItems = [
  "Distributed systems",
  "Raised from the dead",
  "Real-time",
  "Event-driven",
  "AI agents",
  "Buried in production",
  "Machine learning",
  "Microservices",
  "Socket.io",
  "NestJS",
  "Redis",
  "It never sleeps",
  "RabbitMQ",
  "Prisma",
  "Next.js",
  "PostgreSQL",
  "Docker",
];

export default function Marquee() {
  const { horror } = useTheme();
  const items = horror ? horrorItems : baseItems;
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });

  return (
    <section className="relative border-y border-line bg-void-2/60 py-6">
      <motion.div style={{ skewX }} className="edge-fade-x flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...items, ...items].map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-2xl text-bone/80 sm:text-3xl">{t}</span>
              {horror ? (
                <Skull className="h-5 w-5 shrink-0 text-accent/70" strokeWidth={1.4} />
              ) : (
                <span aria-hidden className="shrink-0 text-lg text-accent/60">✦</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>
      <BloodDrip />
    </section>
  );
}
