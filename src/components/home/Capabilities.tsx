"use client";

import Reveal from "@/components/Reveal";
import RevealHeading from "@/components/RevealHeading";
import { Server, Radio, BrainCircuit } from "lucide-react";

const pillars = [
  {
    Icon: Server,
    title: "Backend & systems",
    body: "APIs that hold up under load — ACID-safe transactions, message queues, caching layers, and schemas indexed for the queries that actually run.",
    tags: ["NestJS", "RabbitMQ", "Redis", "Prisma"],
  },
  {
    Icon: Radio,
    title: "Real-time",
    body: "Live experiences built on Socket.io — presence, typing, media streams, and reconnection logic that keeps state in sync when the network doesn't cooperate.",
    tags: ["Socket.io", "WebSockets", "Event-driven"],
  },
  {
    Icon: BrainCircuit,
    title: "AI & decision engines",
    body: "Systems that decide — CFR game-theory agents, ML forecasting pipelines, and LLM features wired into real product flows, not demos.",
    tags: ["CFR", "TensorFlow", "Gemini", "FastAPI"],
  },
];

export default function Capabilities() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8">
      <Reveal>
        <p className="eyebrow mb-5">[ What I do ]</p>
      </Reveal>
      <RevealHeading className="display-lg max-w-3xl text-balance" delay={0.05}>
        Three layers of the stack, <span className="font-display italic accent-text">engineered</span> end to end.
      </RevealHeading>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08} className="bg-void">
            <div className="group flex h-full flex-col gap-5 bg-surface/30 p-8 transition-colors duration-500 hover:bg-surface/70 lg:p-10">
              <div className="flex items-center justify-between">
                <p.Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              </div>
              <h3 className="font-display text-3xl text-bone">{p.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{p.body}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted"
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
