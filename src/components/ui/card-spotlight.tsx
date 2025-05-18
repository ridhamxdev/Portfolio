"use client";

import React, { useRef, useState } from "react";

export const CardSpotlightEffect = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative max-w-md overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 px-8 py-16 shadow-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

// For the content within the card, the article provides an example.
// We can adapt this or use it as a guide for how to structure content
// inside <CardSpotlightEffect> in ContactContent.tsx.

// Example usage from article (adapted):
// <CardSpotlightEffect>
//   <span className="mb-4 inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
//     {/* SVG icon here */}
//   </span>
//   <h3 className="mb-2 font-medium tracking-tight text-white">Hello!</h3>
//   <p className="text-sm text-slate-400">
//     Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex
//     obcaecati natus eligendi delectus, cum deleniti sunt in labore nihil
//     quod quibusdam expedita nemo.
//   </p>
// </CardSpotlightEffect>

export default CardSpotlightEffect; 