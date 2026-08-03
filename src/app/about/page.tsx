import type { Metadata } from "next";
import Image from "next/image";
import Counter from "@/components/Counter";
import Io from "@/components/system/Io";

export const metadata: Metadata = {
  title: "About — Ridham Goyal",
  description:
    "Ridham Goyal is a full-stack and systems engineer who builds real-time backends, AI decision engines, and shipped products.",
};

const principles = [
  {
    title: "The backend is the product",
    body: "The polish people feel, the instant, reliable, never-loses-your-data kind, is usually a backend decision. I design the data layer and the failure modes first.",
  },
  {
    title: "Ship it, then prove it",
    body: "A project isn't done until it's deployed and someone can click it. Eleven of mine are live right now, not screenshots in a README.",
  },
  {
    title: "Decisions, not just CRUD",
    body: "The work I care about most is systems that decide. Game-theory agents, ML forecasts, LLM features wired into real flows.",
  },
  {
    title: "Boring where it counts",
    body: "ACID transactions, queues, indexes, caches. Unglamorous primitives, used well, are what hold up when traffic shows up.",
  },
];

const stats: [string, string][] = [
  ["17", "Projects shipped"],
  ["11", "Live deployments"],
  ["TS / PY", "Primary stacks"],
  ["2026", "Open to work"],
];

export default function AboutPage() {
  return (
    <main className="relative z-10 mx-auto max-w-[1440px] px-5 pb-32 pt-36 sm:px-10">
      <Io as="header">
        <h1 className="display-xl">
          <span className="rv-mask block">I gravitate to</span>
          <span className="rv-mask block" style={{ "--rv-d": "0.12s" } as React.CSSProperties}>
            the <span className="text-accent">hard parts</span>.
          </span>
        </h1>
      </Io>

      <div className="mt-20 grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* photo */}
        <Io>
          <div className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:mx-0">
            <div className="grayscale transition duration-700 hover:grayscale-0">
              <div className="rv-curtain relative aspect-[3/4] overflow-hidden rounded-none border border-line">
                <Image
                  src="/profile-photo.jpg"
                  alt="Ridham Goyal"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-[68%_center]"
                  priority
                />
              </div>
            </div>
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
              Ridham Goyal / Bengaluru, IN
            </p>
          </div>
        </Io>

        {/* bio */}
        <div>
          <Io className="space-y-6 text-lg leading-relaxed text-muted">
            <p className="rv-fade">
              I&apos;m a full-stack developer who spends most of my time where
              the hard problems live. Real-time backends, event-driven
              architectures, and the AI systems that have to actually make a
              call. I like building the parts of an app that users never see but
              always feel.
            </p>
            <p className="rv-fade" style={{ "--rv-d": "0.12s" } as React.CSSProperties}>
              That&apos;s meant building and shipping{" "}
              <span className="text-ink">EnamDoc</span>, a dental platform now
              in production with real users. Built solo, end to end, SEO and
              all. And before it: a real-time messaging engine on Socket.io, a
              NestJS transaction backend with queues and ACID guarantees, a
              poker agent that uses counterfactual regret minimization, and an
              ML platform that forecasts renewable energy from live weather. The
              throughline is the same: design the data and the failure modes
              first, then build up.
            </p>
            <p className="rv-fade" style={{ "--rv-d": "0.24s" } as React.CSSProperties}>
              I work mostly in the TypeScript and Python ecosystems. Next.js,
              NestJS, React on top; Postgres, Redis, RabbitMQ, Prisma, and
              Docker underneath. When something needs to think, that&apos;s
              where TensorFlow, Gemini, and a bit of game theory come in.
            </p>
          </Io>

          <Io className="mt-14 grid grid-cols-2">
            {stats.map(([value, label], i) => (
              <div
                key={label}
                className={`rv-fade border-t border-line py-6 ${i % 2 === 1 ? "border-l pl-6" : "pr-6"}`}
                style={{ "--rv-d": `${i * 0.08}s` } as React.CSSProperties}
              >
                <Counter value={value} className="display-md text-3xl text-ink" />
                <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
                  {label}
                </div>
              </div>
            ))}
          </Io>
        </div>
      </div>

      {/* principles */}
      <section className="mt-32">
        <Io>
          <h2 className="display-lg rv-mask max-w-3xl text-balance">
            Four things I keep coming back to<span className="text-accent">.</span>
          </h2>
        </Io>

        <div className="mt-14">
          {principles.map((p) => (
            <Io key={p.title} className="relative py-10">
              <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
              <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
                <h3
                  className="display-md rv-mask text-2xl text-ink sm:text-3xl"
                  style={{ "--rv-d": "0.1s" } as React.CSSProperties}
                >
                  {p.title}
                </h3>
                <p
                  className="rv-fade max-w-xl leading-relaxed text-muted"
                  style={{ "--rv-d": "0.2s" } as React.CSSProperties}
                >
                  {p.body}
                </p>
              </div>
            </Io>
          ))}
          <div className="hairline" />
        </div>
      </section>
    </main>
  );
}
