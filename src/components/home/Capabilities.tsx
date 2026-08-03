import Io from "@/components/system/Io";

/** Three layers of the stack as ledger rows: rule draws, title rises, body fades. */
const pillars = [
  {
    title: "Backend & systems",
    body: "APIs that hold up under load. ACID-safe transactions, message queues, caching layers, and schemas indexed for the queries that actually run.",
    tags: ["NestJS", "RabbitMQ", "Redis", "Prisma"],
  },
  {
    title: "Real-time",
    body: "Live experiences built on Socket.io. Presence, typing, media streams, and reconnection logic that keeps state in sync when the network doesn't cooperate.",
    tags: ["Socket.io", "WebSockets", "Event-driven"],
  },
  {
    title: "AI & decision engines",
    body: "Systems that decide. CFR game-theory agents, ML forecasting pipelines, and LLM features wired into real product flows, not demos.",
    tags: ["CFR", "TensorFlow", "Gemini", "FastAPI"],
  },
];

export default function Capabilities() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-28 sm:px-10">
      <Io>
        <h2 className="display-lg rv-mask max-w-3xl text-balance">
          What I build<span className="text-accent">.</span>
        </h2>
      </Io>

      <div className="mt-14">
        {pillars.map((p, i) => (
          <Io key={p.title} className="relative py-10">
            <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
              <h3
                className="display-md rv-mask text-2xl text-ink sm:text-3xl"
                style={{ "--rv-d": "0.1s" } as React.CSSProperties}
              >
                {p.title}
              </h3>
              <div>
                <p
                  className="rv-fade max-w-xl leading-relaxed text-muted"
                  style={{ "--rv-d": "0.2s" } as React.CSSProperties}
                >
                  {p.body}
                </p>
                <div
                  className="rv-fade mt-5 flex flex-wrap gap-x-5 gap-y-2"
                  style={{ "--rv-d": `${0.28 + i * 0.02}s` } as React.CSSProperties}
                >
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Io>
        ))}
        <div className="hairline" />
      </div>
    </section>
  );
}
