"use client";

import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import Io from "@/components/system/Io";
import { getLenis } from "@/lib/lenis";

const socials = [
  { label: "LinkedIn", handle: "/ridham-goyal", href: "https://www.linkedin.com/in/ridham-goyal-025b422a0/", Icon: IconBrandLinkedin },
  { label: "GitHub", handle: "@ridhamxdev", href: "https://github.com/ridhamxdev", Icon: IconBrandGithub },
  { label: "Twitter / X", handle: "@Ridham572806", href: "https://x.com/Ridham572806", Icon: IconBrandX },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-line-strong px-5 pb-10 pt-24 sm:px-10">
      <Io className="mx-auto max-w-[1440px]">
        <p className="label-mono mb-8 flex items-center gap-3">
          <span className="rv-tick inline-block h-2 w-2 bg-accent" />
          Open to new opportunities
        </p>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display-lg max-w-3xl text-balance">
            <span className="rv-mask block">Let&apos;s build something</span>
            <span className="rv-mask block" style={{ "--rv-d": "0.12s" } as React.CSSProperties}>
              that actually <span className="text-accent">ships</span>.
            </span>
          </h2>

          <div className="rv-fade self-start lg:self-auto">
            <Magnetic className="inline-block">
              <a
                href="https://www.linkedin.com/in/ridham-goyal-025b422a0/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
              >
                Start a conversation
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="rv-rule my-14 hairline" />

        <div className="grid gap-px sm:grid-cols-3">
          {socials.map(({ label, handle, href, Icon }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rv-fade group flex items-center justify-between border-t border-line py-5 pr-2 hover:border-accent sm:border-t-0 sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0"
              style={{ "--rv-d": `${0.1 + i * 0.1}s` } as React.CSSProperties}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted transition-colors duration-300 group-hover:text-accent" stroke={1.5} />
                <span className="flex flex-col">
                  <span className="text-sm text-ink">{label}</span>
                  <span className="font-mono text-xs text-muted">{handle}</span>
                </span>
              </span>
              <ArrowUpRight
                size={16}
                className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Ridham Goyal / Next.js · Three.js · GSAP</span>
          <button
            type="button"
            onClick={() => {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2 text-muted transition-colors duration-300 hover:text-ink"
          >
            Back to top
            <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </Io>
    </footer>
  );
}
