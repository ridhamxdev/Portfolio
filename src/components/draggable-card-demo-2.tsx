import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { Project } from "@/app/projects/page";

interface DraggableCardDemoProps {
  projects: Project[];
  resetCounter: number;
}

export default function DraggableCardDemo({ projects, resetCounter }: DraggableCardDemoProps) {

  const getInitialCardStyle = (index: number, totalCards: number) => {
    const angleStep = totalCards > 1 ? 5 : 0; // Degrees of rotation between cards for a slight fan effect
    const initialRotation = -(totalCards - 1) * angleStep / 2; // Center the fan
    const rotation = initialRotation + index * angleStep;
    // Apply a slight vertical offset to distinguish stacked cards
    const yOffset = index * 4; // 4px down for each subsequent card
    const xOffset = index * 2; // 2px right for each subsequent card

    return {
      transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
      // Ensure cards stack nicely, later cards on top. Only needed if not using absolute, but good for clarity.
      zIndex: index, 
      // Transition for the initial arrangement (optional, but can look nice)
      transition: 'transform 0.5s ease-out',
      // Important: Override any absolute positioning from DraggableCardBody's internal className if it exists,
      // or ensure its default styles don't include absolute. For now, we assume it doesn't.
      // position: 'relative', // This would be if DraggableCardBody wasn't already relative
    };
  };

  return (
    <DraggableCardContainer 
      className="relative flex min-h-screen w-full items-center justify-center overflow-clip py-20"
    >
      {/* Wrapper to help with stacking if flexbox alone isn't enough for desired overlap */}
      {/* For now, relying on transforms and z-index applied directly to DraggableCardBody */}
      {projects.map((project, index) => (
        <DraggableCardBody 
          key={`${project.title}-${resetCounter}`}
          style={getInitialCardStyle(index, projects.length)}
          // Add a margin if cards are too close or if flexbox alignment needs adjustment
          // className="mx-[-50px]" // Example of negative margin to pull cards closer if in a row
        >
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="pointer-events-none relative z-10 h-60 w-full object-cover rounded-t-md"
            />
          )}
          <div className="p-4">
            <h3 className="mt-2 text-xl font-bold text-neutral-200 dark:text-neutral-300 text-center">
              {project.title}
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-center h-12 overflow-hidden">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-3">
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()} 
                >
                  Demo
                </a>
              )}
              {project.sourceUrl && (
                <a 
                  href={project.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1 rounded-md bg-slate-600 hover:bg-slate-700 text-white transition-colors"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()} 
                >
                  Source
                </a>
              )}
            </div>
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
} 