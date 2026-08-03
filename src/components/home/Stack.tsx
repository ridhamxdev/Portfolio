import Io from "@/components/system/Io";

const groups = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C / C++"] },
  { label: "Frameworks", items: ["React", "Next.js", "Node.js", "NestJS", "Express", "Django"] },
  { label: "Data & infra", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Docker"] },
  { label: "AI & messaging", items: ["TensorFlow", "Gemini", "Socket.io", "RabbitMQ", "Celery"] },
];

export default function Stack() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-28 sm:px-10">
      <Io>
        <h2 className="display-lg rv-mask max-w-3xl text-balance">
          The toolkit, by layer<span className="text-accent">.</span>
        </h2>
      </Io>

      <div className="mt-14">
        {groups.map((g, gi) => (
          <Io key={g.label} className="relative py-8">
            <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr] md:gap-8">
              <span
                className="rv-fade pt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-faint"
                style={{ "--rv-d": "0.1s" } as React.CSSProperties}
              >
                {g.label}
              </span>
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {g.items.map((t, i) => (
                  <span
                    key={t}
                    className="rv-fade display-md text-2xl text-ink/85 sm:text-3xl"
                    style={{ "--rv-d": `${0.12 + i * 0.05 + gi * 0.02}s` } as React.CSSProperties}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Io>
        ))}
        <div className="hairline" />
      </div>
    </section>
  );
}
