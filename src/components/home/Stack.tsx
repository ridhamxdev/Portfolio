"use client";

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
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8">
      <Reveal>
        <p className="eyebrow mb-5">[ Toolkit ]</p>
      </Reveal>
      <RevealHeading className="display-lg max-w-3xl text-balance" delay={0.05}>
        The tools I reach for, by <span className="font-display italic accent-text">layer</span>.
      </RevealHeading>

      <div className="mt-14">
        {groups.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.05}>
            <div className="grid grid-cols-1 gap-3 border-t border-line py-8 md:grid-cols-[200px_1fr] md:gap-8">
              <span className="pt-1 font-mono text-xs uppercase tracking-[0.18em] text-faint">
                {String(i + 1).padStart(2, "0")} / {g.label}
              </span>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {g.items.map((t) => (
                  <span
                    key={t}
                    className="cursor-default font-display text-2xl text-bone/85 transition-colors duration-300 hover:text-accent sm:text-3xl"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
