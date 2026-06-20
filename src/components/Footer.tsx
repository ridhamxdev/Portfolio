"use client";

import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import Magnetic from "@/components/Magnetic";

const socials = [
  { label: "LinkedIn", handle: "/ridham-goyal", href: "https://www.linkedin.com/in/ridham-goyal-025b422a0/", Icon: IconBrandLinkedin },
  { label: "GitHub", handle: "@ridhamxdev", href: "https://github.com/ridhamxdev", Icon: IconBrandGithub },
  { label: "Twitter / X", handle: "@Ridham572806", href: "https://x.com/Ridham572806", Icon: IconBrandX },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-line px-5 pb-10 pt-24 sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <p className="eyebrow mb-8">[ Currently open to new opportunities ]</p>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display-lg max-w-2xl text-balance">
            Let&apos;s build something
            <br />
            that actually <span className="font-display italic accent-text">ships</span>.
          </h2>

          <Magnetic className="inline-block self-start lg:self-auto">
            <a
              href="https://www.linkedin.com/in/ridham-goyal-025b422a0/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-void transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a conversation
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
        </div>

        <div className="my-14 hairline" />

        <div className="grid gap-3 sm:grid-cols-3">
          {socials.map(({ label, handle, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-line bg-surface/40 p-5 transition-colors duration-300 hover:border-accent/50"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted transition-colors group-hover:text-accent" />
                <span className="flex flex-col">
                  <span className="text-sm text-bone">{label}</span>
                  <span className="font-mono text-xs text-muted">{handle}</span>
                </span>
              </span>
              <ArrowUpRight size={16} className="text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Ridham Goyal — Built with Next.js · Three.js · GSAP</span>
          <a href="#" className="group flex items-center gap-2 text-muted transition-colors hover:text-bone">
            Back to top
            <ArrowUp size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
