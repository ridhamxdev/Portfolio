"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";
import RevealHeading from "@/components/RevealHeading";

const groups = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C / C++"],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Node.js", "NestJS", "Express", "Django"],
  },
  {
    label: "Data & infra",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Docker"],
  },
  {
    label: "AI & messaging",
    items: ["TensorFlow", "Gemini", "Socket.io", "RabbitMQ", "Celery"],
  },
];

export default function Stack() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stack-row").forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
        tl.from(row.querySelector(".stack-rule"), {
          scaleX: 0,
          duration: 0.7,
          ease: "power3.out",
          transformOrigin: "left",
        })
          .from(
            row.querySelectorAll(".stack-item"),
            { y: 26, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.04 },
            "-=0.45"
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8">
      <Reveal>
        <p className="eyebrow mb-5">[ Toolkit ]</p>
      </Reveal>
      <RevealHeading className="display-lg max-w-3xl text-balance" delay={0.05}>
        The tools I reach for, by <span className="font-display italic accent-text">layer</span>.
      </RevealHeading>

      <div ref={root} className="mt-14">
        {groups.map((g, i) => (
          <div key={g.label} className="stack-row relative py-8">
            <span className="stack-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[200px_1fr] md:gap-8">
              <span className="stack-item pt-1 font-mono text-xs uppercase tracking-[0.18em] text-faint">
                {String(i + 1).padStart(2, "0")} / {g.label}
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {g.items.map((t) => (
                  <span
                    key={t}
                    className="stack-item cursor-default font-display text-2xl text-bone/85 transition-colors duration-300 hover:text-accent sm:text-3xl"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
