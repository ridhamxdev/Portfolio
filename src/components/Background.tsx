"use client";

// Ambient atmosphere: two slow-drifting light pools + a faint technical grid.
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* warm key light, top-left */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[55vw] w-[55vw] rounded-full opacity-[0.16] animate-drift"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 62%)",
          filter: "blur(40px)",
        }}
      />
      {/* cool fill, bottom-right */}
      <div
        className="absolute -bottom-[20%] -right-[10%] h-[50vw] w-[50vw] rounded-full opacity-[0.12] animate-drift"
        style={{
          background:
            "radial-gradient(circle, var(--color-cool) 0%, transparent 60%)",
          filter: "blur(50px)",
          animationDelay: "-7s",
        }}
      />
      {/* technical grid, fades toward center */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #000 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #000 100%)",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
