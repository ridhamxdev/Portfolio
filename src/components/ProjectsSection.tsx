"use client";

import { motion } from "framer-motion";
import ProjectCard, { Project } from "./ProjectCard"; // Import ProjectCard and Project interface

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold mb-16 relative inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="gradient-text">Featured Projects</span>
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></span>
          </motion.h2>
          <div className="text-center text-[var(--text-secondary)]">
            Loading projects...
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold mb-16 relative inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="gradient-text">Featured Projects</span>
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></span>
          </motion.h2>
          <div className="text-center text-[var(--text-secondary)]">
            No projects to display at the moment.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold mb-16 relative inline-block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="gradient-text">Featured Projects</span>
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title + index} // Use a more unique key if titles can repeat
              title={project.title}
              description={project.description}
              tags={project.tags}
              demoUrl={project.demoUrl}
              sourceUrl={project.sourceUrl}
              imageUrl={project.imageUrl} // Pass imageUrl
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 