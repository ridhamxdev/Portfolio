import type { Metadata } from "next";
import Io from "@/components/system/Io";
import ProjectsIndex from "@/components/ProjectsIndex";

export const metadata: Metadata = {
  title: "Work — Ridham Goyal",
  description:
    "An index of shipped projects: real-time backends, AI decision engines, and full-stack products with live deployments.",
};

export default function ProjectsPage() {
  return (
    <main className="relative z-10 mx-auto max-w-[1440px] px-5 pb-32 pt-36 sm:px-10">
      <Io as="header">
        <h1 className="display-xl rv-mask text-balance">
          The work<span className="text-accent">.</span>
        </h1>
        <p
          className="rv-fade mt-6 max-w-xl text-lg leading-relaxed text-muted"
          style={{ "--rv-d": "0.15s" } as React.CSSProperties}
        >
          Seventeen shipped projects. Eleven are deployed and clickable right now.
        </p>
        <div
          className="rv-rule hairline mt-12"
          style={{ "--rv-d": "0.25s" } as React.CSSProperties}
        />
      </Io>

      <ProjectsIndex />
    </main>
  );
}
