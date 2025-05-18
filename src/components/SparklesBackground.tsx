"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function SparklesBackground() {
  return (
    // This div provides the black background and positions the sparkles behind other content.
    <div className="fixed inset-0 w-full h-screen bg-black -z-10"> 
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent" // SparklesCore canvas is transparent; particles render on the parent div's bg.
        minSize={0.4}          // Slightly smaller min size for subtlety
        maxSize={1.2}          // Slightly smaller max size
        particleDensity={80}   // Adjusted particle density
        className="w-full h-full"
        particleColor="#FFFFFF" // White particles
      />
    </div>
  );
} 