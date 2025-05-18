"use client";

import { motion } from "framer-motion";

// Define Project type
export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
}

// ProjectCard component
const ProjectCard = ({ 
  title, 
  description, 
  tags, 
  imageUrl = "/project-placeholder.jpg", // Default placeholder image
  demoUrl,
  sourceUrl
}: Project) => { // Use the Project interface for props
  return (
    <motion.div 
      className="animated-border rounded-lg overflow-hidden bg-[var(--card-bg)] h-full"
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-36 overflow-hidden">
        {/* Optional: Add Image component here if you want to use next/image for optimized images */}
        {/* For now, keeping it simple as a div background or placeholder for actual image content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card-bg)] z-10"></div>
        <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-30 mix-blend-overlay"></div>
        {/* If using imageUrl, you would render an <img /> or <Image /> tag here */}
        <div className="h-full w-full bg-[var(--card-bg)] flex items-center justify-center">
          {/* Placeholder for image if not provided, or you can style this div with imageUrl */}
          {!imageUrl && <span className="text-xs text-[var(--text-secondary)]">No Image</span>}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
        <p className="text-[var(--text-secondary)] mb-4 text-sm leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)]">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex space-x-4 mt-auto pt-4">
          {demoUrl && (
            <a 
              href={demoUrl} 
              className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Demo
            </a>
          )}
          {sourceUrl && (
            <a 
              href={sourceUrl} 
              className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 