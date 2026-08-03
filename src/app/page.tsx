import Hero from "@/components/Hero";
import Marquee from "@/components/home/Marquee";
import WorkRail from "@/components/home/WorkRail";
import Capabilities from "@/components/home/Capabilities";
import Stack from "@/components/home/Stack";
import Counter from "@/components/Counter";
import Io from "@/components/system/Io";

const stats = [
  { value: "17", label: "Projects shipped" },
  { value: "11", label: "Live deployments" },
  { value: "05", label: "Problem domains" },
  { value: "'26", label: "Open to work" },
];

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <WorkRail />
      <Capabilities />

      <section className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-10">
        <Io className="relative grid grid-cols-2 md:grid-cols-4">
          <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
          {stats.map((s, i) => (
            <div key={s.label} className="border-line px-2 py-12 text-center md:border-l md:first:border-l-0">
              <div className="rv-fade" style={{ "--rv-d": `${i * 0.1}s` } as React.CSSProperties}>
                <Counter value={s.value} className="display-lg text-ink" />
                <div className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
          <span className="rv-rule absolute inset-x-0 bottom-0 block h-px bg-line-strong" style={{ "--rv-d": "0.2s" } as React.CSSProperties} />
        </Io>
      </section>

      <Stack />
    </main>
  );
}
