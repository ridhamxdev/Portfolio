"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/data/projects";

const slides = featuredProjects.filter((p) => p.image);

// Pinned horizontal scroll: the section locks to the viewport and the track
// translates sideways as you scroll vertically — the page's signature moment.
export default function ScrollShowcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: skip the pin, let the strip scroll horizontally by hand.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.current?.style.setProperty("overflow-x", "auto");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;

      const horizontal = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Each card lifts as it crosses into frame — driven by the horizontal tween.
      gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontal,
            start: "left 88%",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden">
      <div
        ref={track}
        className="flex h-screen w-max items-center gap-6 px-5 sm:gap-8 sm:px-8"
      >
        {/* Intro panel */}
        <div className="flex h-[68vh] w-[82vw] max-w-[460px] shrink-0 flex-col justify-center">
          <p className="eyebrow mb-5">[ Up close ]</p>
          <h2 className="font-display text-balance text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] tracking-[-0.015em]">
            A closer look at the <span className="italic accent-text">work</span>.
          </h2>
          <p className="mt-6 max-w-sm text-muted">
            Scroll to move sideways through the products — each one shipped, live,
            and built end to end.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-faint">
            <ArrowUpRight size={13} className="text-accent" />
            Drag the scroll
          </span>
        </div>

        {slides.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="showcase-card group relative flex h-[68vh] w-[84vw] max-w-[640px] shrink-0 flex-col overflow-hidden rounded-3xl border border-line bg-surface"
          >
            <div className="relative flex-1 overflow-hidden">
              <Image
                src={p.image!}
                alt={p.title}
                fill
                sizes="(max-width: 640px) 84vw, 640px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <span className="absolute left-5 top-5 font-mono text-xs text-bone/70">
                {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-end justify-between gap-4 p-6 sm:p-8">
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent">
                  {p.category}
                </p>
                <h3 className="mt-2 font-display text-3xl text-bone sm:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-2 truncate text-sm text-muted">{p.tagline}</p>
              </div>
              <ArrowUpRight
                className="h-7 w-7 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                strokeWidth={1.4}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
