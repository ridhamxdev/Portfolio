"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export default function SparklesBackground() {
  return (
    <div className="fixed inset-0 w-full h-screen bg-black -z-10">
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.4}
        maxSize={1.2}
        particleDensity={80}
        className="w-full h-full"
        particleColor="#FFFFFF"
      />
    </div>
  );
}