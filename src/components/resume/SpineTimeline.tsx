"use client";

import { useEffect, useRef } from "react";
import Io from "@/components/system/Io";
import type { ExperienceEntry } from "@/data/resume";

/**
 * Experience with a vertical accent spine. Same channel rig as Hero (playbook
 * 2.8): rAF lerps section progress into one CSS var (--p), gated by an
 * IntersectionObserver; CSS scales the spine fill. JS writes one number.
 */
export default function SpineTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }

    let raf = 0;
    let sp = 0;
    let active = true;
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
    });
    io.observe(el);

    const tick = () => {
      if (active) {
        const r = el.getBoundingClientRect();
        // 0 as the section enters, 1 once its bottom crosses 80% of the viewport
        const p = Math.min(
          1,
          Math.max(0, (window.innerHeight * 0.8 - r.top) / Math.max(1, r.height))
        );
        sp += (p - sp) * 0.1;
        el.style.setProperty("--p", sp.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={section} className="relative" style={{ "--p": 0 } as React.CSSProperties}>
      {/* the spine: static track + accent fill scaled by --p */}
      <div aria-hidden="true" className="resume-spine absolute bottom-0 left-[3px] top-0 w-px">
        <div className="absolute inset-0 bg-line-strong" />
        <div
          className="absolute inset-0 origin-top bg-accent"
          style={{ transform: "scaleY(var(--p))" }}
        />
      </div>

      <div className="flex flex-col gap-16">
        {entries.map((entry, ei) => (
          <Io key={entry.org} className="group relative pl-10">
            {/* node on the spine — snaps to accent when the entry reveals */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-2 h-[7px] w-[7px] border border-line-strong bg-bg transition-colors duration-[600ms] [transition-timing-function:var(--ease-snap)] group-data-[io=in]:border-accent group-data-[io=in]:bg-accent"
            />

            <div className="grid gap-4 lg:grid-cols-[200px_1fr] lg:gap-10">
              <div className="rv-fade" style={{ "--rv-d": "0.05s" } as React.CSSProperties}>
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  {entry.period}
                </div>
                <div className="mt-1.5 font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  {entry.org}
                </div>
              </div>

              <div>
                <h3 className="display-md rv-mask text-ink">{entry.role}</h3>
                <p
                  className="rv-fade mt-3 max-w-2xl leading-relaxed text-muted"
                  style={{ "--rv-d": "0.12s" } as React.CSSProperties}
                >
                  {entry.summary}
                </p>

                <ul className="mt-5 flex flex-col gap-2.5">
                  {entry.points.map((point, i) => (
                    <li
                      key={point}
                      className="rv-fade flex items-start gap-3 text-ink/85"
                      style={{ "--rv-d": `${0.18 + i * 0.07 + ei * 0.02}s` } as React.CSSProperties}
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="rv-fade mt-5 flex flex-wrap gap-x-5 gap-y-2"
                  style={{ "--rv-d": "0.4s" } as React.CSSProperties}
                >
                  {entry.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs uppercase tracking-[0.12em] text-faint"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Io>
        ))}
      </div>
    </div>
  );
}
