"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Project } from "@/data/projects";
import { ArrowRight } from "lucide-react";

interface ProjectGridProps {
    projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto px-4">
            {projects.map((project, index) => (
                <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative bg-[var(--card-bg)] border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--accent-primary)]/50 transition-colors duration-300"
                >
                    <div className="p-6 flex flex-col h-full min-h-[300px]">
                        <div className="mb-4">
                            <span className={`text-xs font-mono py-1 px-2 rounded-full border ${project.role === 'AI Agent'
                                ? 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                                : 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                }`}>
                                {project.role}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[var(--accent-primary)] transition-colors">
                            {project.title}
                        </h3>

                        <p className="text-[var(--text-secondary)] mb-6 line-clamp-3 flex-grow">
                            {project.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.techStack.slice(0, 3).map((tech) => (
                                <span key={tech} className="text-xs text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded">
                                    {tech}
                                </span>
                            ))}
                            {project.techStack.length > 3 && (
                                <span className="text-xs text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded">
                                    +{project.techStack.length - 3}
                                </span>
                            )}
                        </div>

                        <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform duration-300"
                        >
                            View Case Study <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-300" />
                </motion.div>
            ))}
        </div>
    );
};

export default ProjectGrid;
