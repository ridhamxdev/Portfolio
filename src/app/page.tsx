import Hero from "@/components/Hero";
import Marquee from "@/components/home/Marquee";
import Capabilities from "@/components/home/Capabilities";
import FeaturedWork from "@/components/home/FeaturedWork";
import Stack from "@/components/home/Stack";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

const stats = [
  { value: "16", label: "Projects shipped" },
  { value: "10", label: "Live deployments" },
  { value: "05", label: "Problem domains" },
  { value: "'26", label: "Open to work" },
];

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <Capabilities />
      <FeaturedWork />

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-void px-6 py-10 text-center">
                <Counter value={s.value} className="font-display text-5xl text-bone sm:text-6xl" />
                <div className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Stack />
    </main>
  );
}
