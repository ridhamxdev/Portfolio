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

const items = [
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
              <Skull className="h-5 w-5 shrink-0 text-accent/70" strokeWidth={1.4} />
            </span>
          ))}
        </div>
      </motion.div>
      <BloodDrip />
    </section>
  );
}
