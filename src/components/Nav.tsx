"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { getLenis } from "@/lib/lenis";

const links = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];

export default function Nav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setVisible(y < 110 || y < prev);
  });

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : -96 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="no-print fixed inset-x-0 top-0 z-[100]"
      onFocusCapture={() => setVisible(true)}
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled ? "border-b border-line bg-bg/95" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-10">
          <Link
            href="/"
            aria-label="Home"
            className="display-md whitespace-nowrap text-[0.85rem] uppercase leading-none tracking-tight text-ink transition-colors duration-300 hover:text-accent sm:text-[1.05rem]"
          >
            Ridham Goyal
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="flex items-center">
              {links.map((l) => {
                const active = pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group relative px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] sm:px-3"
                  >
                    <span
                      className={
                        active
                          ? "text-ink"
                          : "text-muted transition-colors duration-300 group-hover:text-ink"
                      }
                    >
                      {l.label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-2.5 right-2.5 h-px bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
              <a
                href="#contact"
                onClick={(e) => {
                  const lenis = getLenis();
                  if (lenis) {
                    e.preventDefault();
                    lenis.scrollTo("#contact");
                  }
                }}
                className="px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-ink sm:px-3"
              >
                Contact
              </a>
            </nav>

            <ThemeToggle className="ml-2" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
