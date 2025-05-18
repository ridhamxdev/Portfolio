"use client"; // Remove if data fetching is done in a Server Component way

import { useEffect, useState } from "react";
import ProjectsSection from "@/components/ProjectsSection";
import { Project } from "@/components/ProjectCard"; // Assuming Project interface is exported from ProjectCard

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

// This page will be a Server Component by default if 'use client' is removed.
// For fetching data in Server Components, you'd typically use async/await directly.
// However, since ProjectsSection likely expects isLoading, we'll keep client-side fetching for now.
// Or, adapt ProjectsSection to not require isLoading if data is pre-fetched.

// If we want this to be a true Server Component for data fetching:
// export default async function ProjectsPage() {
//   const baseUrl = getBaseUrl();
//   let projects: Project[] = [];
//   let isLoading = true; // This would be handled differently or not needed
//   try {
//     const response = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });
//     if (!response.ok) {
//       throw new Error('Failed to fetch projects');
//     }
//     projects = await response.json();
//     isLoading = false;
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     // projects will remain empty, isLoading might be true or handle error display
//     isLoading = false; // Or set an error state
//   }
//   return <ProjectsSection projects={projects} isLoading={false} />; // isLoading would be false as data is resolved
// }


// Keeping client-side fetching for now to align with existing ProjectsSection prop 'isLoading'
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

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
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen"> {/* Added padding-top for navbar */}
      <ProjectsSection projects={projects} isLoading={isLoadingProjects} />
    </div>
  );
} 