import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import Io from "@/components/system/Io";

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

import { cleanDashes as clean } from "@/lib/text";

/** Split a long description into one or two readable paragraphs. */
function toParagraphs(text: string): string[] {
  const sentences = clean(text)
    .split(/\.\s+(?=[A-Z])/)
    .map((s, i, arr) => (i < arr.length - 1 ? `${s}.` : s));
  if (sentences.length <= 2) return [sentences.join(" ")];
  const mid = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, mid).join(" "), sentences.slice(mid).join(" ")];
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
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  const facts = project.facts ?? [
    { label: "Role", value: "Solo developer" },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
  ];
  const paragraphs = toParagraphs(project.description);

  return (
    <main className="relative z-10 mx-auto max-w-[1440px] px-5 pb-32 pt-36 sm:px-10">
      {/* Header */}
      <Io as="header">
        <Link
          href="/projects"
          className="rv-fade inline-block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          Work / back to index
        </Link>
        <h1
          className="display-xl rv-mask mt-8 max-w-5xl text-balance"
          style={{ "--rv-d": "0.05s" } as React.CSSProperties}
        >
          {project.title}
        </h1>
        <p
          className="rv-fade mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          style={{ "--rv-d": "0.18s" } as React.CSSProperties}
        >
          {clean(project.tagline)}
        </p>
      </Io>

      {/* Facts strip */}
      <Io className="mt-14 flex flex-wrap gap-y-6">
        {facts.map((f, i) => (
          <div
            key={f.label}
            className="rv-fade border-l border-line px-6 first:border-l-0 first:pl-0 sm:px-10"
            style={{ "--rv-d": `${i * 0.08}s` } as React.CSSProperties}
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">
              {f.label}
            </p>
            <p className="mt-1.5 text-ink">{f.value}</p>
          </div>
        ))}
      </Io>

      {/* Media */}
      {project.image && (
        <Io as="section" className="mt-14">
          <figure className="rv-curtain relative aspect-[16/10] overflow-clip border border-line bg-surface">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover"
              priority
            />
          </figure>
        </Io>
      )}

      {/* Body */}
      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Io className="space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="rv-fade leading-relaxed text-muted"
              style={{ "--rv-d": `${i * 0.1}s` } as React.CSSProperties}
            >
              {para}
            </p>
          ))}
        </Io>

        <Io>
          <h2 className="rv-fade font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            Highlights
          </h2>
          <ul className="mt-5 space-y-4">
            {project.highlights.map((h, i) => (
              <li
                key={h}
                className="rv-fade flex gap-3"
                style={{ "--rv-d": `${0.1 + i * 0.07}s` } as React.CSSProperties}
              >
                <span className="rv-tick mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                <span className="text-ink/85">{clean(h)}</span>
              </li>
            ))}
          </ul>

          <div
            className="rv-fade mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6"
            style={{ "--rv-d": "0.4s" } as React.CSSProperties}
          >
            {project.techStack.map((t) => (
              <span
                key={t}
                className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint"
              >
                {t}
              </span>
            ))}
          </div>
        </Io>
      </div>

      {/* Links — one pill, one text link, never two pills */}
      {(project.links.demo || project.links.repo) && (
        <Io className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-6">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rv-fade group inline-flex items-center gap-3 rounded-full border border-line-strong px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              Visit live site
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rv-fade link-underline font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted hover:text-ink"
              style={{ "--rv-d": "0.1s" } as React.CSSProperties}
            >
              Source on GitHub
            </a>
          )}
        </Io>
      )}

      {/* Prev / next */}
      <Io className="mt-28">
        <div className="rv-rule hairline" />
        <div className="grid gap-10 pt-10 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}`} className="rv-fade group">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
              Previous
            </p>
            <p className="display-md mt-3 text-ink transition-colors duration-300 group-hover:text-accent">
              {prev.title}
            </p>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="rv-fade group sm:text-right"
            style={{ "--rv-d": "0.08s" } as React.CSSProperties}
          >
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">Next</p>
            <p className="display-md mt-3 text-ink transition-colors duration-300 group-hover:text-accent">
              {next.title}
            </p>
          </Link>
        </div>
      </Io>
    </main>
  );
}
