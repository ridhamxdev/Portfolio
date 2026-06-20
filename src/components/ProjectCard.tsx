"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/40 transition-colors duration-300 hover:border-accent/40"
    >
      <Link href={`/projects/${project.slug}`} className="relative block h-48 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 via-surface to-void">
            <span className="font-display text-5xl text-bone/15">{project.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          {project.flagship ? (
            <span className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent backdrop-blur">
              ★ Flagship
            </span>
          ) : (
            <span className="rounded-full border border-line-strong bg-void/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-bone backdrop-blur">
              {project.category}
            </span>
          )}
          {project.links.demo && (
            <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-void/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-bone">{project.title}</h3>
          <span className="font-mono text-[0.65rem] text-faint">{project.year}</span>
        </div>
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <div className="mb-6 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.6rem] text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="group/cta inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-bone transition-colors hover:text-accent"
          >
            Case study
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </Link>
          <div className="flex items-center gap-3 text-faint">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source`}
                className="transition-colors hover:text-bone"
              >
                <Github size={16} />
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                className="transition-colors hover:text-accent"
              >
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
