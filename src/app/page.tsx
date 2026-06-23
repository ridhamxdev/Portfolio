import Hero from "@/components/Hero";
import Marquee from "@/components/home/Marquee";
import Capabilities from "@/components/home/Capabilities";
import FeaturedWork from "@/components/home/FeaturedWork";
import ScrollShowcase from "@/components/home/ScrollShowcase";
import Stack from "@/components/home/Stack";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import Counter from "@/components/Counter";

const stats = [
  { value: "17", label: "Projects shipped", drift: 34 },
  { value: "11", label: "Live deployments", drift: 12 },
  { value: "05", label: "Problem domains", drift: 26 },
  { value: "'26", label: "Open to work", drift: 8 },
];

export default function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Marquee />
      <Capabilities />
      <ScrollShowcase />
      <FeaturedWork />

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-void px-6 py-10 text-center">
                <Parallax speed={s.drift}>
                  <Counter value={s.value} className="font-display text-5xl text-bone sm:text-6xl" />
                  <div className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    {s.label}
                  </div>
                </Parallax>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Stack />
    </main>
  );
}
