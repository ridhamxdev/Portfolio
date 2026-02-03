"use client";

import { useState } from "react";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"All" | "Backend" | "AI Agent">("All");

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.role === filter || p.role === "Full Stack");

  return (
    <main className="min-h-screen bg-black-100 relative overflow-hidden py-32 px-5">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--accent-primary)]/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6">
            Technical Portfolio
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-10">
            A deep dive into system design, architecture, and execution capabilities.
            Showcasing backend systems and AI flows.
          </p>

          <div className="flex justify-center gap-4">
            {(["All", "Backend", "AI Agent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === tab
                  ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25"
                  : "bg-white/5 text-[var(--text-secondary)] hover:bg-white/10"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <ProjectGrid projects={filteredProjects} />
      </div>
    </main>
  );
}
