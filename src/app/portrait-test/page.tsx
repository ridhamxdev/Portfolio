"use client";

import dynamic from "next/dynamic";

const LivingPortrait = dynamic(
  () => import("@/components/three/LivingPortrait"),
  { ssr: false }
);

export default function PortraitTest() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <LivingPortrait debug />
    </div>
  );
}
