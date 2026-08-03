"use client";

import { useEffect, useRef } from "react";

/**
 * The reveal workhorse (playbook 2.7): ONE IntersectionObserver watches every
 * <Io> block and flips data-io to "in". All entrance animation is CSS keyed
 * off that attribute (.rv-mask, .rv-rise, .rv-fade, .rv-rule, .rv-curtain,
 * .rv-tick in globals.css). No per-element JS, no per-section observers.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    // Printing must never capture half-revealed state: flip everything in.
    window.addEventListener("beforeprint", () => {
      document
        .querySelectorAll<HTMLElement>("[data-io]")
        .forEach((el) => (el.dataset.io = "in"));
    });
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.io = "in";
            observer?.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
  }
  return observer;
}

export default function Io({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "span" | "header" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reveal instantly if the intro/preloader era already scrolled past us.
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-io="out" className={className}>
      {children}
    </Tag>
  );
}
