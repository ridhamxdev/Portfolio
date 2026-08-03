"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects } from "@/data/projects";
import Io from "@/components/system/Io";
import { getLenis } from "@/lib/lenis";
import { cleanDashes } from "@/lib/text";

/**
 * Pinned horizontal gallery (playbook §4.2 — the technique the reference
 * never uses). gsap.matchMedia owns the desktop pin: entering the breakpoint
 * builds it and stamps data-pinned (which flips the layout via group-data
 * variants); leaving reverts everything back to the native snap scroller
 * that touch, reduced-motion, and no-JS users always get. Each card receives
 * ONE number (--cp) from the tween's own onUpdate and CSS does the parallax
 * math (§2.9).
 */
const cards = featuredProjects.slice(0, 6);

export default function WorkRail() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current || !track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const wrapEl = wrap.current!;
      const trackEl = track.current!;
      wrapEl.dataset.pinned = "1";
      // Lenis smoothing should own the wheel during the pin; the attribute is
      // only needed for the mobile native scroller.
      trackEl.removeAttribute("data-lenis-prevent");

      const cardEls = gsap.utils.toArray<HTMLElement>(".rail-card", trackEl);
      const setCp = () => {
        const mid = window.innerWidth / 2;
        for (const el of cardEls) {
          const r = el.getBoundingClientRect();
          const p = (r.left + r.width / 2 - mid) / window.innerWidth;
          el.style.setProperty("--cp", Math.max(-1, Math.min(1, p)).toFixed(3));
        }
      };

      const distance = () => trackEl.scrollWidth - window.innerWidth;
      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        // runs on every rendered frame, including the scrub catch-up tail
        onUpdate: setCp,
        scrollTrigger: {
          trigger: wrapEl,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      setCp();

      // Cards translated offscreen by the scrub must stay keyboard-reachable:
      // focusing one drives the scroll to the pin progress that shows it.
      const st = tween.scrollTrigger!;
      const handlers = cardEls.map((el, i) => {
        const onFocus = () => {
          const y = st.start + ((st.end - st.start) * i) / Math.max(1, cardEls.length - 1);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { duration: 0.6 });
          else window.scrollTo(0, y);
        };
        el.addEventListener("focus", onFocus);
        return onFocus;
      });

      return () => {
        cardEls.forEach((el, i) => el.removeEventListener("focus", handlers[i]));
        cardEls.forEach((el) => el.style.removeProperty("--cp"));
        delete wrapEl.dataset.pinned;
        trackEl.setAttribute("data-lenis-prevent", "");
      };
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return (
    <section ref={wrap} className="group relative overflow-clip border-t border-line">
      <Io className="flex items-end justify-between px-5 pb-8 pt-20 sm:px-10 group-data-[pinned]:absolute group-data-[pinned]:inset-x-0 group-data-[pinned]:top-0 group-data-[pinned]:z-10">
        <h2 className="display-lg rv-mask type-breathe">Selected work</h2>
        <Link
          href="/projects"
          className="rv-fade link-underline hidden font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-ink sm:block"
          style={{ "--rv-d": "0.15s" } as React.CSSProperties}
        >
          Full index / 17
        </Link>
      </Io>

      <div
        ref={track}
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-16 sm:px-10 group-data-[pinned]:h-screen group-data-[pinned]:snap-none group-data-[pinned]:items-end group-data-[pinned]:overflow-visible group-data-[pinned]:pb-20"
      >
        {cards.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-hv
            className="rail-card group/card relative w-[78vw] max-w-[560px] shrink-0 snap-start sm:w-[52vw] group-data-[pinned]:w-[38vw]"
            style={{ "--cp": 0 } as React.CSSProperties}
          >
            <div className="relative aspect-[4/3] overflow-clip border border-line bg-surface">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 1024px) 78vw, 38vw"
                  className="object-cover"
                  style={{ transform: "translateX(calc(var(--cp) * -6%)) scale(1.12)" }}
                />
              ) : (
                <div className="flex h-full flex-col justify-between p-8">
                  <span className="display-lg text-line-strong transition-colors duration-500 group-hover/card:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-3 w-3 self-end bg-accent" />
                </div>
              )}
              <span className="absolute inset-0 border-2 border-accent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="display-md hv-cast text-ink group-hover/card:text-accent group-focus-within/card:text-accent">
                {p.title}
              </span>
              <span className="flex shrink-0 items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                {p.category} / {p.year}
                <ArrowUpRight
                  size={13}
                  className="text-faint transition-colors duration-300 group-hover/card:text-accent"
                />
              </span>
            </div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              {cleanDashes(p.tagline)}
            </p>
          </Link>
        ))}

        <Link
          href="/projects"
          data-hv
          className="group/card flex w-[60vw] max-w-[420px] shrink-0 snap-start items-center justify-center border border-line bg-surface group-data-[pinned]:w-[24vw]"
        >
          <span className="display-md hv-cast flex items-center gap-3 text-ink group-hover/card:text-accent group-focus-within/card:text-accent">
            All 17 projects
            <ArrowUpRight size={22} />
          </span>
        </Link>
      </div>
    </section>
  );
}
