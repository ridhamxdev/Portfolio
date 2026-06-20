"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { projects, categories } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

const Gallery = dynamic(() => import("@/components/three/ProjectsGallery3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 rounded-full border border-accent/30 border-t-accent animate-spin" />
    </div>
  ),
});

export default function ProjectsExplorer() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [active, setActive] = useState(0);
  const [cmd, setCmd] = useState({ index: 0, seq: 0 });

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  const safeActive = Math.min(active, filtered.length - 1);
  const current = filtered[safeActive];

  const changeFilter = (f: (typeof categories)[number]) => {
    setFilter(f);
    setActive(0);
    setCmd((c) => ({ index: 0, seq: c.seq + 1 }));
  };

  const go = (i: number) => {
    const idx = (i + filtered.length) % filtered.length;
    setCmd((c) => ({ index: idx, seq: c.seq + 1 }));
  };

  return (
    <div>
      {/* filters */}
      <Reveal>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => changeFilter(c)}
              className={`rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-all duration-300 ${
                filter === c
                  ? "border-accent bg-accent text-[#160a02]"
                  : "border-line text-muted hover:border-line-strong hover:text-bone"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {/* 3D gallery */}
      <div className="relative mt-8 h-[44vh] min-h-[340px] w-full">
        <Gallery
          key={filter}
          projects={filtered}
          onActive={setActive}
          command={cmd}
        />
      </div>

      {/* caption */}
      <div className="mx-auto mt-2 max-w-3xl text-center">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                {current.category} · {current.year}
              </p>
              <h3 className="mt-3 font-display text-4xl text-bone sm:text-5xl">
                {current.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-muted">{current.tagline}</p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href={`/projects/${current.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-void transition-transform hover:scale-[1.03]"
                >
                  Case study
                  <ArrowUpRight size={14} />
                </Link>
                {current.links.demo && (
                  <a
                    href={current.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent"
                  >
                    Live demo
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {current.links.repo && (
                  <a
                    href={current.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Source"
                    className="inline-flex items-center justify-center rounded-full border border-line-strong p-2.5 text-muted transition-colors hover:text-bone"
                  >
                    <Github size={15} />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* nav */}
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            onClick={() => go(safeActive - 1)}
            aria-label="Previous"
            className="rounded-full border border-line p-3 text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            {filtered.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => go(i)}
                aria-label={`Go to ${p.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeActive ? "w-6 bg-accent" : "w-1.5 bg-faint hover:bg-muted"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(safeActive + 1)}
            aria-label="Next"
            className="rounded-full border border-line p-3 text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">
          Drag, scroll, or tap a card to explore
        </p>
      </div>

      {/* full index grid */}
      <div className="mt-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <h3 className="font-display text-3xl text-bone sm:text-4xl">
              Full index
              <span className="ml-3 font-mono text-sm text-faint">
                {String(filtered.length).padStart(2, "0")}
              </span>
            </h3>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
