import type { Metadata } from "next";
import Link from "next/link";
import Io from "@/components/system/Io";
import Counter from "@/components/Counter";
import Typewriter from "@/components/resume/Typewriter";
import PrintButton from "@/components/resume/PrintButton";
import SpineTimeline from "@/components/resume/SpineTimeline";
import { profile, links, experience, skills, stats, education, selectedSlugs } from "@/data/resume";
import { projects, type Project } from "@/data/projects";

export const metadata: Metadata = {
  title: "Resume — Ridham Goyal",
  description: profile.summary,
};

// Copy discipline (DESIGN.md): no em/en dashes reach the page.
const cleanDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ", ");

export default function ResumePage() {
  const selected = selectedSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  return (
    <main className="resume-root relative z-10 mx-auto max-w-[1200px] px-5 pb-32 pt-36 sm:px-10">
      {/* ---- header ---- */}
      <Io as="header">
        <h1 className="display-xl rv-mask">{profile.name}</h1>

        <p className="mt-6 font-mono text-sm text-muted">
          <Typewriter text="Full-Stack & Systems Engineer / Bengaluru, IN" />
        </p>

        <div
          className="rv-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-3"
          style={{ "--rv-d": "0.3s" } as React.CSSProperties}
        >
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-mono text-xs tracking-[0.16em] text-ink"
            >
              <span className="uppercase text-muted">{l.name}</span> {l.label}
            </a>
          ))}
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
            {profile.availability}
          </span>
        </div>

        <div
          className="rv-rule mt-10 hairline"
          style={{ "--rv-d": "0.45s" } as React.CSSProperties}
        />
      </Io>

      {/* ---- stats strip ---- */}
      <Io className="mt-14">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map(([value, label], i) => (
            <div
              key={label}
              className="rv-fade border-l border-line-strong pl-5 first:border-l-0 first:pl-0 md:pl-8 max-md:odd:border-l-0 max-md:odd:pl-0"
              style={{ "--rv-d": `${0.1 + i * 0.08}s` } as React.CSSProperties}
            >
              <Counter value={value} className="display-lg block text-ink" />
              <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-faint">
                {label}
              </div>
            </div>
          ))}
        </div>
      </Io>

      {/* ---- experience ---- */}
      <section className="mt-28">
        <Io>
          <h2 className="display-lg rv-mask">Experience</h2>
        </Io>
        <div className="mt-12">
          <SpineTimeline entries={experience} />
        </div>
      </section>

      {/* ---- selected work ---- */}
      <section className="mt-28">
        <Io>
          <h2 className="display-lg rv-mask">Selected work</h2>
        </Io>
        <div className="mt-12">
          {selected.map((p, i) => (
            <Io key={p.slug} className="relative">
              <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
              <div
                className="rv-fade grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-6"
                style={{ "--rv-d": `${0.08 + i * 0.06}s` } as React.CSSProperties}
              >
                <div>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="display-md text-ink transition-colors duration-300 hover:text-accent"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {cleanDashes(p.tagline)}
                  </p>
                </div>
                <span className="font-mono text-xs text-faint">{p.year}</span>
              </div>
            </Io>
          ))}
          <div className="hairline" />
        </div>
      </section>

      {/* ---- skills ---- */}
      <section className="mt-28">
        <Io>
          <h2 className="display-lg rv-mask">Skills</h2>
        </Io>
        <div className="mt-12">
          {skills.map((group) => (
            <Io key={group.label} className="relative py-6">
              <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_1fr] md:gap-8">
                <span
                  className="rv-fade pt-0.5 font-mono text-xs uppercase tracking-[0.18em] text-faint"
                  style={{ "--rv-d": "0.08s" } as React.CSSProperties}
                >
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {group.items.map((item, i) => (
                    <span
                      key={item}
                      className="rv-fade text-base text-ink/85"
                      style={{ "--rv-d": `${0.12 + i * 0.03}s` } as React.CSSProperties}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Io>
          ))}
          <div className="hairline" />
        </div>
      </section>

      {/* Ridham: add entries to `education` in src/data/resume.ts and this
          section appears here automatically, nothing else to wire up. */}
      {education.length > 0 && (
        <section className="mt-28">
          <Io>
            <h2 className="display-lg rv-mask">Education</h2>
          </Io>
          <div className="mt-12">
            {education.map((e, i) => (
              <Io key={e.school} className="relative">
                <span className="rv-rule absolute inset-x-0 top-0 block h-px bg-line-strong" />
                <div
                  className="rv-fade grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-6"
                  style={{ "--rv-d": `${0.08 + i * 0.06}s` } as React.CSSProperties}
                >
                  <div>
                    <h3 className="display-md text-ink">{e.school}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.degree}</p>
                  </div>
                  <span className="font-mono text-xs text-faint">{e.period}</span>
                </div>
              </Io>
            ))}
            <div className="hairline" />
          </div>
        </section>
      )}

      {/* ---- footer row ---- */}
      <Io className="mt-28">
        <div className="rv-rule hairline" />
        <div className="mt-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <p
            className="rv-fade font-mono text-xs uppercase tracking-[0.16em] text-muted"
            style={{ "--rv-d": "0.1s" } as React.CSSProperties}
          >
            References and full project details on request.
          </p>
          <div className="rv-fade" style={{ "--rv-d": "0.2s" } as React.CSSProperties}>
            <PrintButton />
          </div>
        </div>
      </Io>
    </main>
  );
}
