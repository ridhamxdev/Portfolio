"use client";

// Bone geometry drawn from primitives — no external models. A capsule bone with
// bulged joint knuckles at each end, the unit every skeletal shape is built from.
function Bone({
  x,
  y,
  len,
  w,
  angle = 0,
}: {
  x: number;
  y: number;
  len: number;
  w: number;
  angle?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-w / 2} y={-len} width={w} height={len} rx={w / 2} />
      <circle cx={0} cy={-len} r={w * 0.72} />
      <circle cx={0} cy={0} r={w * 0.72} />
    </g>
  );
}

// A skeletal hand clawing up from the bottom of the viewport. Fixed to the lower
// edge, it rises and withdraws on a slow loop so it only surfaces now and then.
export function SkeletonHand({
  className = "",
  side = "left",
}: {
  className?: string;
  side?: "left" | "right";
}) {
  // four fingers + a thumb, each three phalange bones stacked with slight splay
  const fingers = [
    { x: 30, splay: -16, l: [34, 30, 24] },
    { x: 62, splay: -6, l: [40, 34, 26] },
    { x: 96, splay: 4, l: [42, 36, 28] },
    { x: 128, splay: 14, l: [36, 30, 24] },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-0 z-[54] ${
        side === "left" ? "left-[4vw]" : "right-[4vw]"
      } ${className}`}
      style={{
        width: "clamp(140px, 15vw, 230px)",
        transform: "translateY(102%)",
        animation: "clawReach 15s ease-in-out 3s infinite",
        filter: "drop-shadow(0 0 22px rgba(193,18,31,0.35))",
        transformOrigin: "bottom center",
        scale: side === "right" ? "-1 1" : "1 1",
      }}
    >
      <svg viewBox="0 0 170 260" className="w-full">
        <g fill="#d7d0c6" stroke="#0b0a09" strokeWidth="1.4">
          {/* metacarpals fanning out of the wrist */}
          {fingers.map((f, i) => (
            <Bone key={`m${i}`} x={f.x + 12} y={200} len={62} w={11} angle={f.splay * 0.5} />
          ))}
          {/* phalanges climbing each finger, curling inward like a claw */}
          {fingers.map((f, i) => {
            let y = 140;
            return f.l.map((len, j) => {
              const angle = f.splay + j * (side === "left" ? -3 : -3);
              const el = <Bone key={`f${i}-${j}`} x={f.x + 12} y={y} len={len} w={10 - j} angle={angle} />;
              y -= len + 4;
              return el;
            });
          })}
          {/* thumb, thrown out to the side */}
          <Bone x={20} y={196} len={46} w={12} angle={-52} />
          <Bone x={-8} y={168} len={34} w={10} angle={-64} />
          {/* wrist / carpal cluster */}
          <ellipse cx={78} cy={224} rx={54} ry={26} />
          <circle cx={54} cy={220} r={8} />
          <circle cx={78} cy={230} r={9} />
          <circle cx={102} cy={220} r={8} />
        </g>
      </svg>
    </div>
  );
}

// A ribcage + spine watermark bled faintly behind a section. Drop into a
// `relative` container; it centers itself and sits well behind the content.
export function RibcageWatermark({
  className = "",
  size = 520,
}: {
  className?: string;
  size?: number;
}) {
  const ribs = [0, 1, 2, 3, 4, 5];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none ${className}`}
      style={{ width: size, animation: "boneSway 9s ease-in-out infinite" }}
    >
      <svg viewBox="0 0 300 380" className="w-full text-accent" style={{ opacity: 0.06 }}>
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          {/* spine */}
          <line x1="150" y1="20" x2="150" y2="300" />
          {[...Array(11)].map((_, i) => (
            <line key={i} x1="138" y1={40 + i * 24} x2="162" y2={40 + i * 24} />
          ))}
          {/* rib pairs sweeping down off the spine */}
          {ribs.map((r) => {
            const y = 70 + r * 34;
            const drop = 30 + r * 12;
            return (
              <g key={r}>
                <path d={`M150 ${y} C104 ${y - 6} 66 ${y + 20} 74 ${y + drop}`} />
                <path d={`M150 ${y} C196 ${y - 6} 234 ${y + 20} 226 ${y + drop}`} />
              </g>
            );
          })}
          {/* pelvis */}
          <path d="M150 300 C110 320 96 356 120 372 C140 360 146 336 150 320 C154 336 160 360 180 372 C204 356 190 320 150 300 Z" />
        </g>
      </svg>
    </div>
  );
}
