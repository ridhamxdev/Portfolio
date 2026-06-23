"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import RevealHeading from "@/components/RevealHeading";
import { featuredProjects } from "@/data/projects";

export default function FeaturedWork() {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26 });
  const y = useSpring(my, { stiffness: 220, damping: 26 });

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX + 24);
    my.set(e.clientY - 110);
  };

  const active = hover !== null ? featuredProjects[hover] : null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8" onMouseMove={onMove}>
      <div className="flex items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">[ Selected work ]</p>
          </Reveal>
          <RevealHeading className="display-lg text-balance" delay={0.05}>
            Things I&apos;ve <span className="font-display italic accent-text">shipped</span>.
          </RevealHeading>
        </div>
        <Reveal>
          <Link
            href="/projects"
            className="link-underline hidden shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-bone sm:block"
          >
            All 17 projects →
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 border-t border-line">
        {featuredProjects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.04}>
            <Link
              href={`/projects/${p.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors duration-300 sm:gap-8 sm:py-9"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="font-mono text-xs text-faint transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-3xl leading-none text-bone transition-transform duration-300 group-hover:translate-x-2 sm:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-2.5 truncate font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  {p.category} — {p.tagline}
                </p>
              </div>
              <ArrowUpRight
                className="h-6 w-6 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent sm:h-8 sm:w-8"
                strokeWidth={1.4}
              />
            </Link>
          </Reveal>
        ))}
      </div>

      <Link
        href="/projects"
        className="link-underline mt-10 inline-block font-mono text-xs uppercase tracking-[0.16em] text-muted hover:text-bone sm:hidden"
      >
        All 17 projects →
      </Link>

      {/* cursor-following preview */}
      <motion.div
        style={{ x, y, opacity: active ? 1 : 0, scale: active ? 1 : 0.85 }}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[180px] w-[290px] overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl lg:block"
      >
        {active?.image ? (
          <Image
            src={active.image}
            alt={active.title}
            fill
            sizes="290px"
            className="object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-surface-2 to-void p-5">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">
              Source
            </span>
            <span className="font-display text-2xl text-bone">{active?.title}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-void/90 to-transparent" />
      </motion.div>
    </section>
  );
}
