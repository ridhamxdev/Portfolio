"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";

const links = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setVisible(y < 110 || y < last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: visible ? 0 : -120 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[100]"
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled ? "border-b border-line bg-void/70 backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
          {/* wordmark */}
          <Link href="/" aria-label="Home" className="group flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 group-hover:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-display text-lg leading-none text-bone transition-colors group-hover:text-accent sm:text-xl">
              Ridham Goyal
            </span>
          </Link>

          {/* right cluster */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex items-center gap-1 sm:gap-4">
              {links.map((l) => {
                const active = pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group relative px-2 py-1 font-mono text-[0.7rem] uppercase tracking-[0.16em]"
                  >
                    <span
                      className={
                        active ? "text-bone" : "text-muted transition-colors group-hover:text-bone"
                      }
                    >
                      {l.label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-2 right-2 h-px bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* live local time — small editorial signal of availability */}
            <span className="hidden items-center gap-2 border-l border-line pl-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-faint md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/80" />
              Bengaluru {time}
            </span>

            <Magnetic className="inline-block">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-[#160a02]"
              >
                Contact
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
