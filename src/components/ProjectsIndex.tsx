"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects, categories } from "@/data/projects";
import Io from "@/components/system/Io";

type Filter = (typeof categories)[number];

/**
 * Editorial index of all projects: typographic filter row, ledger rows,
 * and a lerp-following image preview on fine pointers (playbook 3.7: 0.12).
 */
export default function ProjectsIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [fine, setFine] = useState(false);
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const snap = useRef(false);
  const raf = useRef(0);

  const counts = useMemo(() => {
    const m = {} as Record<Filter, number>;
    for (const c of categories) {
      m[c] = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
    }
    return m;
  }, []);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  // ONE rAF loop lerps the preview panel toward the cursor. Skipped entirely
  // on touch / coarse pointers and for reduced-motion users.
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;
    setFine(true);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      const panel = panelRef.current;
      if (panel) {
        if (snap.current) {
          pos.current.x = target.current.x;
          pos.current.y = target.current.y;
          snap.current = false;
        }
        pos.current.x += (target.current.x - pos.current.x) * 0.12;
        pos.current.y += (target.current.y - pos.current.y) * 0.12;
        panel.style.transform = `translate3d(${pos.current.x - 170}px, ${pos.current.y - 127.5}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="mt-10">
      {/* Category filter — typographic, counts as data */}
      <Io className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
        {categories.map((c, i) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={`rv-fade relative pb-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
              style={{ "--rv-d": `${i * 0.05}s` } as React.CSSProperties}
            >
              {c}
              <span className="ml-2 text-faint">{counts[c]}</span>
              <span
                className={`absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transitionTimingFunction: "var(--ease-luxe)" }}
              />
            </button>
          );
        })}
      </Io>

      {/* Ledger rows */}
      <div className="mt-10" onMouseLeave={() => setPreview(null)}>
        {filtered.map((p, i) => {
          const num = String(projects.indexOf(p) + 1).padStart(2, "0");
          return (
            <Io key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                onMouseEnter={() => {
                  if (fine && p.image) {
                    if (!preview) snap.current = true;
                    setPreview({ src: p.image, alt: p.title });
                  } else {
                    setPreview(null);
                  }
                }}
                className="rv-fade group grid grid-cols-[2.5rem_1fr_1.5rem] items-baseline gap-x-4 border-t border-line px-1 py-6 hover:bg-surface sm:grid-cols-[3.5rem_1fr_auto_1.75rem] sm:gap-x-6 sm:px-2"
                style={{ "--rv-d": `${(i % 5) * 0.06}s` } as React.CSSProperties}
              >
                <span className="font-mono text-[0.7rem] text-faint">{num}</span>

                <span className="min-w-0">
                  <span className="display-md block text-ink transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted sm:hidden">
                    {p.category} / {p.year}
                  </span>
                </span>

                <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted sm:block">
                  {p.category} / {p.year}
                </span>

                <ArrowUpRight
                  size={16}
                  className="self-center text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </Link>
            </Io>
          );
        })}
        <div className="hairline" />
      </div>

      {/* Cursor-following preview — fine pointers only, pointer-events off */}
      {fine && preview && (
        <div
          ref={panelRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 h-[255px] w-[340px] overflow-clip border border-line bg-surface"
          style={{ transform: "translate3d(-200%, -200%, 0)" }}
        >
          <Image
            key={preview.src}
            src={preview.src}
            alt=""
            fill
            sizes="340px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
