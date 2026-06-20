import type { Metadata } from "next";
import ProjectsExplorer from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Work — Ridham Goyal",
  description:
    "A 3D index of shipped projects: real-time backends, AI decision engines, and full-stack products with live deployments.",
};

export default function ProjectsPage() {
  return (
    <main className="relative z-10 mx-auto max-w-[1400px] px-5 pb-32 pt-36 sm:px-8">
      <header className="mb-12 max-w-3xl">
        <p className="eyebrow mb-6">[ The work — 16 projects ]</p>
        <h1 className="display-lg text-balance">
          Systems, shipped and <span className="font-display italic accent-text">live</span>.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Drag through the gallery to browse, or scan the full index below. Ten
          of these are deployed and clickable right now.
        </p>
      </header>

      <ProjectsExplorer />
    </main>
  );
}
