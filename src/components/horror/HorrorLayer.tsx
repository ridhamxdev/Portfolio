"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import HorrorAudio from "@/components/horror/HorrorAudio";
import DreadOverlay from "@/components/horror/DreadOverlay";
import JumpScare from "@/components/horror/JumpScare";
import BloodCanvas from "@/components/horror/BloodCanvas";
import { SkeletonHand } from "@/components/horror/Skeletons";

// Every full-screen horror effect lives here and mounts ONLY in horror mode.
// Default (normal) never renders these, so there is no jump-scare, no scream,
// no blood, no clawing hands, no dread audio until the visitor opts in.
export default function HorrorLayer() {
  const { horror } = useTheme();
  if (!horror) return null;

  return (
    <>
      <DreadOverlay />
      <BloodCanvas />
      <SkeletonHand side="left" />
      <SkeletonHand side="right" />
      <HorrorAudio />
      <JumpScare />
    </>
  );
}
