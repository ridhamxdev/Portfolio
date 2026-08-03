"use client";

/**
 * One statement band (max one marquee per page). Pure CSS loop; the global
 * reduced-motion rule freezes it.
 */
const items = [
  "Real-time backends",
  "AI decision engines",
  "Event-driven systems",
  "Full-stack products",
  "Live deployments",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-clip border-y border-line py-5" aria-hidden>
      <div
        className="flex w-max items-center gap-10 pr-10"
        style={{ animation: "marquee 36s linear infinite" }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="display-md text-muted">{t}</span>
            <span className="h-2 w-2 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
