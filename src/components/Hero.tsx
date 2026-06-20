"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";

const Constellation = dynamic(() => import("@/components/three/Constellation"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 rounded-full border border-accent/40 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full border border-accent/20" />
      </div>
    </div>
  ),
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 115 });
      gsap.set([".hero-eyebrow", ".hero-sub", ".hero-cta", ".hero-foot"], {
        opacity: 0,
        y: 18,
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.8 })
        .to(".hero-line", { yPercent: 0, duration: 1.15, stagger: 0.1 }, "-=0.4")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .to(".hero-foot", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-8"
    >
      {/* 3D stage — full bleed on mobile, right side on desktop */}
      <motion.div style={{ scale: stageScale, y: stageY }} className="absolute inset-0 lg:left-[40%]">
        <Constellation />
      </motion.div>

      {/* legibility scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent lg:via-void/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 mx-auto w-full max-w-[1400px]">
        <p className="hero-eyebrow eyebrow mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Full-stack · Systems · AI — India
        </p>

        <h1 className="font-display max-w-[15ch] text-[clamp(2.9rem,6.4vw,6.2rem)] leading-[0.96] tracking-[-0.02em]">
          <span className="block overflow-hidden py-[0.05em]">
            <span className="hero-line inline-block">Engineering the</span>
          </span>
          <span className="block overflow-hidden py-[0.05em]">
            <span className="hero-line inline-block">
              <span className="italic accent-text">invisible</span> systems
            </span>
          </span>
          <span className="block overflow-hidden py-[0.05em]">
            <span className="hero-line inline-block">behind the screen.</span>
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-md text-lg leading-relaxed text-muted">
          I&apos;m Ridham Goyal — I build real-time backends, AI decision
          engines, and full-stack products engineered for throughput,
          reliability, and scale.
        </p>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
          <Magnetic className="inline-block">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2.5 rounded-full bg-bone px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] text-void transition-transform duration-300 hover:scale-[1.03]"
            >
              Explore the work
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Magnetic>
          <Link
            href="/#contact"
            className="link-underline font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-bone"
          >
            Get in touch
          </Link>
        </div>

        <div className="hero-foot mt-20 flex max-w-[1400px] items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.18em] text-faint">
          <span className="flex items-center gap-2">
            <ArrowDown size={13} className="animate-bounce text-accent" />
            Scroll to explore
          </span>
          <span className="hidden sm:block">16 shipped · 10 live</span>
        </div>
      </motion.div>
    </section>
  );
}
