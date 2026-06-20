import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Github, Check } from "lucide-react";
import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not found" };
  return {
    title: `${project.title} — Ridham Goyal`,
    description: project.summary,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="relative z-10 mx-auto max-w-[1100px] px-5 pb-32 pt-36 sm:px-8">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-bone"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        All work
      </Link>

      {/* header */}
      <Reveal>
        <div className="mt-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
            {project.flagship && "★ Flagship · "}
            {project.category} · {project.year}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-snug text-bone/80">
            {project.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#160a02] transition-transform hover:scale-[1.03]"
              >
                Visit live site
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent"
              >
                <Github size={15} /> Source code
              </a>
            )}
          </div>
        </div>
      </Reveal>

      {/* media */}
      <Reveal delay={0.1}>
        <div className="relative mt-14 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-line bg-surface">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1100px) 100vw, 1100px"
              className="object-cover object-top"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-2 via-surface to-void">
              <Github size={40} className="text-faint" />
              <span className="font-display text-6xl text-bone/15">{project.title}</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-faint">
                {project.links.repo ? "Source-available · no public deploy" : "Private build"}
              </span>
            </div>
          )}
        </div>
      </Reveal>

      {/* body */}
      <div className="mt-20 grid gap-14 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div>
            <p className="eyebrow mb-5">[ Overview ]</p>
            <p className="text-xl leading-relaxed text-bone/85">{project.description}</p>

            <p className="eyebrow mb-6 mt-14">[ Engineering highlights ]</p>
            <ul className="space-y-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-4">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="text-muted">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="h-fit rounded-2xl border border-line bg-surface/40 p-7 lg:sticky lg:top-28">
            <p className="eyebrow mb-5">[ Stack ]</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-bone/80"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="my-7 hairline" />

            <dl className="space-y-4 font-mono text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-faint uppercase tracking-wider">Domain</dt>
                <dd className="text-right text-bone">{project.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-faint uppercase tracking-wider">Year</dt>
                <dd className="text-bone">{project.year}</dd>
              </div>
              {project.facts ? (
                project.facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4">
                    <dt className="text-faint uppercase tracking-wider">{f.label}</dt>
                    <dd className="text-right text-bone">{f.value}</dd>
                  </div>
                ))
              ) : (
                <div className="flex justify-between gap-4">
                  <dt className="text-faint uppercase tracking-wider">Status</dt>
                  <dd className={project.links.demo ? "text-accent" : "text-bone"}>
                    {project.links.demo ? "Live" : "Source"}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </Reveal>
      </div>

      {/* next */}
      <Link
        href={`/projects/${next.slug}`}
        className="group mt-28 flex items-center justify-between border-t border-line pt-10"
      >
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            Next project
          </p>
          <p className="mt-2 font-display text-4xl text-bone transition-colors group-hover:text-accent sm:text-6xl">
            {next.title}
          </p>
        </div>
        <ArrowUpRight
          className="h-8 w-8 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent sm:h-12 sm:w-12"
          strokeWidth={1.2}
        />
      </Link>
    </main>
  );
}
