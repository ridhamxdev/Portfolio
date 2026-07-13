"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

// A pool of blood clinging to an edge, with droplets that swell and fall.
// Drop it as the last child of a `relative` container; it hangs from the top.
export default function BloodDrip({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const { horror } = useTheme();
  if (!horror) return null;
  const drops = [
    { left: "8%", delay: "0s", dur: "5.5s", scale: 1 },
    { left: "22%", delay: "2.1s", dur: "6.8s", scale: 0.7 },
    { left: "39%", delay: "3.4s", dur: "5.9s", scale: 1.1 },
    { left: "57%", delay: "1.2s", dur: "7.4s", scale: 0.85 },
    { left: "71%", delay: "4.0s", dur: "6.1s", scale: 1.25 },
    { left: "86%", delay: "0.7s", dur: "6.6s", scale: 0.6 },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-20 h-28 overflow-visible ${
        flip ? "bottom-full rotate-180" : "top-full"
      } ${className}`}
    >
      {/* the clinging pool with an irregular, gooey lower edge */}
      <svg
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-16 w-full"
      >
        <defs>
          <linearGradient id="bloodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d0a10" />
            <stop offset="55%" stopColor="#a10f17" />
            <stop offset="100%" stopColor="#c1121f" />
          </linearGradient>
        </defs>
        <path
          fill="url(#bloodGrad)"
          d="M0,0 L1200,0 L1200,20 C1150,26 1130,58 1100,58 C1075,58 1068,30 1040,30 C1006,30 1004,72 970,72 C940,72 940,34 908,34 C872,34 872,66 838,66 C812,66 806,28 778,28 C742,28 742,80 706,80 C676,80 676,36 642,36 C606,36 606,62 572,62 C546,62 540,26 512,26 C476,26 476,74 440,74 C410,74 410,34 378,34 C342,34 342,64 308,64 C282,64 276,28 248,28 C212,28 212,70 176,70 C146,70 146,32 114,32 C84,32 78,54 48,56 C24,58 12,30 0,22 Z"
        />
      </svg>

      {/* droplets that detach and fall */}
      {drops.map((d, i) => (
        <span
          key={i}
          className="blood-droplet absolute top-10 block h-3 w-2 rounded-full"
          style={{
            left: d.left,
            background:
              "linear-gradient(180deg, #c1121f, #6d0a10)",
            boxShadow: "0 0 8px rgba(193,18,31,0.5)",
            transform: `scale(${d.scale})`,
            animation: `bloodfall ${d.dur} ${d.delay} cubic-bezier(0.55,0,0.9,0.5) infinite`,
          }}
        />
      ))}
    </div>
  );
}
