import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

export const metadata: Metadata = {
  title: "About — Ridham Goyal",
  description:
    "Ridham Goyal is a full-stack and systems engineer who builds real-time backends, AI decision engines, and shipped products.",
};

const principles = [
  {
    title: "The backend is the product",
    body: "The polish people feel — instant, reliable, never-loses-your-data — is usually a backend decision. I design the data layer and the failure modes first.",
  },
  {
    title: "Ship it, then prove it",
    body: "A project isn't done until it's deployed and someone can click it. Eight of mine are live right now, not screenshots in a README.",
  },
  {
    title: "Decisions, not just CRUD",
    body: "The work I care about most is systems that decide — game-theory agents, ML forecasts, LLM features wired into real flows.",
  },
  {
    title: "Boring where it counts",
    body: "ACID transactions, queues, indexes, caches. Unglamorous primitives, used well, are what hold up when traffic shows up.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative z-10 mx-auto max-w-[1400px] px-5 pb-32 pt-36 sm:px-8">
      <Reveal>
        <p className="eyebrow mb-6">[ About ]</p>
        <h1 className="display-lg max-w-4xl text-balance">
          I&apos;m Ridham — I gravitate to the{" "}
          <span className="font-display italic accent-text">hard parts</span> of
          software.
        </h1>
      </Reveal>

      <div className="mt-20 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* photo */}
        <Reveal>
          <div className="group relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-line lg:sticky lg:top-28 lg:mx-0">
            <Image
              src="/profile-photo.jpg"
              alt="Ridham Goyal"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover object-[68%_center] grayscale transition-all duration-700 group-hover:grayscale-0"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-cool/15 mix-blend-soft-light" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-bone">
              Ridham Goyal — Bengaluru, IN
            </div>
          </div>
        </Reveal>

        {/* bio */}
        <Reveal delay={0.1}>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              I&apos;m a full-stack developer who spends most of my time where the
              hard problems live — real-time backends, event-driven
              architectures, and the AI systems that have to actually make a
              call. I like building the parts of an app that users never see but
              always feel.
            </p>
            <p>
              That&apos;s meant building and shipping <span className="text-bone">EnamDoc</span>{" "}
              — a dental platform now in production with real users — solo, end
              to end, SEO and all. And before it: a real-time messaging engine on
              Socket.io, a NestJS transaction backend with queues and ACID
              guarantees, a poker agent that uses counterfactual regret
              minimization, and an ML platform that forecasts renewable energy
              from live weather. The throughline is the same: design the data and
              the failure modes first, then build up.
            </p>
            <p>
              I work mostly in the TypeScript and Python ecosystems — Next.js,
              NestJS, React on top; Postgres, Redis, RabbitMQ, Prisma, and
              Docker underneath. When something needs to think, that&apos;s where
              TensorFlow, Gemini, and a bit of game theory come in.
            </p>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {[
                ["16", "Projects shipped"],
                ["10", "Live deployments"],
                ["TS / PY", "Primary stacks"],
                ["2026", "Open to work"],
              ].map(([v, l]) => (
                <div key={l} className="bg-void p-6">
                  <Counter value={v} className="font-display text-3xl text-bone" />
                  <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* principles */}
      <section className="mt-32">
        <Reveal>
          <p className="eyebrow mb-5">[ How I work ]</p>
          <h2 className="display-lg max-w-3xl text-balance">
            Four things I keep coming <span className="font-display italic accent-text">back to</span>.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.08} className="bg-void">
              <div className="flex h-full flex-col gap-4 bg-surface/30 p-8 transition-colors duration-500 hover:bg-surface/70 lg:p-10">
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
                <h3 className="font-display text-2xl text-bone sm:text-3xl">{p.title}</h3>
                <p className="leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
