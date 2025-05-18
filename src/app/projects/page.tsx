"use client";

import { useEffect, useState } from "react";
import DraggableCardDemo from "@/components/draggable-card-demo-2";

// Define Project type (copied from ProjectCard.tsx for clarity, or could be imported)
export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  demoUrl?: string;
  sourceUrl?: string;
}

// Helper function to get the base URL
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side
    return ""; // Relative path for client-side fetch
  }
  // Server-side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000"; // Default to localhost for local development
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [resetCounter, setResetCounter] = useState(0); // State for triggering reset

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/projects`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRecenterCards = () => {
    setResetCounter(prev => prev + 1);
  };

  if (isLoadingProjects) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <DraggableCardDemo projects={projects} resetCounter={resetCounter} />
      <button 
        onClick={handleRecenterCards}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
      >
        Recenter Cards
      </button>
    </div>
  );
} 