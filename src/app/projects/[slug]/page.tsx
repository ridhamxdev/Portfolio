"use client";

import { useParams } from "next/navigation";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Cpu, Server, Network } from "lucide-react";
import React from "react";

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black-100 text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
                    <Link href="/projects" className="text-[var(--accent-primary)] hover:underline">
                        Return to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black-100 py-32 px-5 relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-12 transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Projects
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="text-sm font-mono py-1 px-3 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                            {project.role}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        {project.title}
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-8">
                        {project.fullDescription}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {project.links.repo && (
                            <a
                                href={project.links.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all font-medium border border-white/10"
                            >
                                <Github size={20} /> Source Code
                            </a>
                        )}
                        {project.links.demo && (
                            <a
                                href={project.links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white transition-all font-medium shadow-lg shadow-[var(--accent-primary)]/25"
                            >
                                <ExternalLink size={20} /> Live Demo
                            </a>
                        )}
                    </div>
                </motion.div>

                <section className="mb-20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Cpu className="text-[var(--accent-primary)]" /> Core Technology
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-4 py-2 bg-[var(--card-bg)] border border-white/10 rounded-lg text-[var(--text-primary)] text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    {(project.systemDesign) && (
                        <motion.section
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[var(--card-bg)] p-8 rounded-2xl border border-white/5"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Server className="text-blue-400" /> System Design
                            </h3>
                            <h4 className="text-lg font-semibold text-[var(--accent-primary)] mb-4">
                                {project.systemDesign.headline}
                            </h4>
                            <ul className="space-y-4">
                                {project.systemDesign.points.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-[var(--text-secondary)]">
                                        <span className="text-[var(--accent-primary)] mt-1.5">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.section>
                    )}

                    {(project.architecture) && (
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-[var(--card-bg)] p-8 rounded-2xl border border-white/5"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Network className="text-purple-400" /> Architecture
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                {project.architecture.description}
                            </p>
                            <div className="w-full h-48 bg-black/50 rounded-lg border border-white/10 flex items-center justify-center text-[var(--text-muted)] text-sm">
                                Architecture Diagram Placeholder
                            </div>
                        </motion.section>
                    )}
                </div>

                <section className="mb-20">
                    <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                        Key Features
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {project.keyFeatures.map((feature, i) => (
                            <div key={i} className="bg-[var(--card-bg)] p-6 rounded-xl border border-white/5">
                                <span className="text-4xl font-bold text-[var(--accent-primary)]/20 mb-4 block">0{i + 1}</span>
                                <p className="text-[var(--text-primary)] font-medium">{feature}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
