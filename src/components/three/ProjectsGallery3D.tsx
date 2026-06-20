"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Environment, ContactShadows, Lightformer } from "@react-three/drei";
import {
  CanvasTexture,
  SRGBColorSpace,
  MathUtils,
  LinearFilter,
  Group,
} from "three";
import type { Project } from "@/data/projects";

const W = 3.1;
const H = 1.94;
const GAP = 3.5;

/* ---------- per-card texture (screenshot or procedural face) ---------- */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, yy);
  return yy;
}

function useCardTexture(project: Project) {
  const { gl } = useThree();
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    const ctx = c.getContext("2d")!;

    const paintBase = () => {
      const g = ctx.createLinearGradient(0, 0, 1024, 640);
      g.addColorStop(0, "#0e0e16");
      g.addColorStop(1, "#15151f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 640);
      ctx.strokeStyle = "rgba(236,233,224,0.05)";
      ctx.lineWidth = 1;
      for (let i = 64; i < 1024; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 640);
        ctx.stroke();
      }
      for (let i = 64; i < 640; i += 64) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
      }
    };

    const paintMeta = (overImage: boolean) => {
      // bottom scrim for legibility
      const sg = ctx.createLinearGradient(0, 300, 0, 640);
      sg.addColorStop(0, "rgba(7,7,11,0)");
      sg.addColorStop(1, "rgba(7,7,11,0.96)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 300, 1024, 340);

      // pill (LIVE / SOURCE)
      ctx.font = "600 22px monospace";
      const label = overImage ? "● LIVE" : "◆ SOURCE";
      ctx.fillStyle = overImage ? "#ff8a3d" : "#8b8997";
      ctx.fillText(label, 46, 64);
      ctx.fillStyle = "#8b8997";
      ctx.textAlign = "right";
      ctx.fillText(`${project.category} · ${project.year}`, 978, 64);
      ctx.textAlign = "left";

      // title
      ctx.fillStyle = "#ece9e0";
      ctx.font = "400 70px Georgia, serif";
      wrapText(ctx, project.title, 46, 520, 920, 76);

      // tech line
      ctx.fillStyle = "#8b8997";
      ctx.font = "500 24px monospace";
      ctx.fillText(project.techStack.slice(0, 4).join("  /  "), 48, 590);
    };

    const paintProcedural = () => {
      // accent node motif top-right
      ctx.save();
      ctx.translate(760, 150);
      const pts: [number, number][] = [
        [0, 0],
        [120, -40],
        [180, 60],
        [60, 110],
        [-40, 50],
      ];
      ctx.strokeStyle = "rgba(255,138,61,0.5)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
      ctx.fillStyle = "#ffb273";
      for (const [px, py] of pts) {
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    paintBase();
    if (!project.image) paintProcedural();
    paintMeta(false);

    const texture = new CanvasTexture(c);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();

    if (project.image) {
      const img = new Image();
      img.src = project.image;
      img.onload = () => {
        paintBase();
        // cover-fit the screenshot into the top region
        const tH = 640;
        const scale = Math.max(1024 / img.width, tH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (1024 - dw) / 2, (tH - dh) / 2, dw, dh);
        paintMeta(true);
        texture.needsUpdate = true;
      };
    }
    return texture;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  return tex;
}

/* ---------- a single card ---------- */
function Card({
  project,
  index,
  posRef,
  onFocus,
  draggedRef,
}: {
  project: Project;
  index: number;
  posRef: React.MutableRefObject<number>;
  onFocus: (i: number) => void;
  draggedRef: React.MutableRefObject<boolean>;
}) {
  const ref = useRef<Group>(null);
  const tex = useCardTexture(project);

  useFrame(() => {
    if (!ref.current) return;
    const offset = index - posRef.current;
    const abs = Math.abs(offset);
    ref.current.position.x = offset * GAP;
    ref.current.position.z = -abs * 0.9;
    ref.current.position.y = Math.sin(offset * 0.5) * 0.05;
    ref.current.rotation.y = MathUtils.clamp(-offset * 0.32, -0.6, 0.6);
    const target = abs < 0.5 ? 1.14 : 0.92;
    ref.current.scale.x = MathUtils.lerp(ref.current.scale.x, target, 0.12);
    ref.current.scale.y = ref.current.scale.x;
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        if (!draggedRef.current) onFocus(index);
      }}
    >
      <RoundedBox args={[W + 0.14, H + 0.14, 0.08]} radius={0.05} smoothness={4} position-z={-0.05}>
        <meshStandardMaterial color="#16161f" metalness={0.85} roughness={0.28} envMapIntensity={1.1} />
      </RoundedBox>
      <mesh position-z={0.02}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- the moving rig ---------- */
function Rig({
  projects,
  posRef,
  targetRef,
  draggedRef,
  setActive,
}: {
  projects: Project[];
  posRef: React.MutableRefObject<number>;
  targetRef: React.MutableRefObject<number>;
  draggedRef: React.MutableRefObject<boolean>;
  setActive: (i: number) => void;
}) {
  const last = useRef(0);
  useFrame(() => {
    targetRef.current = MathUtils.clamp(targetRef.current, 0, projects.length - 1);
    posRef.current = MathUtils.lerp(posRef.current, targetRef.current, 0.09);
    const idx = Math.round(posRef.current);
    if (idx !== last.current) {
      last.current = idx;
      setActive(idx);
    }
  });

  const focus = (i: number) => (targetRef.current = i);

  return (
    <group position={[0, 0.1, 0]}>
      {projects.map((p, i) => (
        <Card
          key={p.slug}
          project={p}
          index={i}
          posRef={posRef}
          onFocus={focus}
          draggedRef={draggedRef}
        />
      ))}
    </group>
  );
}

/* ---------- public component ---------- */
export default function ProjectsGallery3D({
  projects,
  onActive,
  command,
}: {
  projects: Project[];
  onActive: (i: number) => void;
  command: { index: number; seq: number };
}) {
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const draggedRef = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);

  // allow parent (arrows / dots / filter) to drive the carousel
  useEffect(() => {
    targetRef.current = command.index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command.seq]);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    draggedRef.current = false;
    moved.current = 0;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    moved.current += Math.abs(dx);
    if (moved.current > 6) draggedRef.current = true;
    targetRef.current -= dx * 0.012;
  };
  const onUp = () => {
    dragging.current = false;
    targetRef.current = Math.round(
      MathUtils.clamp(targetRef.current, 0, projects.length - 1)
    );
    setTimeout(() => (draggedRef.current = false), 50);
  };
  const onWheel = (e: React.WheelEvent) => {
    targetRef.current += (e.deltaY + e.deltaX) * 0.0016;
  };

  return (
    <div
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onWheel={onWheel}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.3, 6.4], fov: 38 }}
      >
        <ambientLight intensity={0.4} />
        <Rig
          projects={projects}
          posRef={posRef}
          targetRef={targetRef}
          draggedRef={draggedRef}
          setActive={onActive}
        />
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.5}
          scale={18}
          blur={3}
          far={4}
          color="#000000"
        />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2} color="#ff8a3d" position={[-4, 2, 3]} scale={[6, 6, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#5c6cff" position={[4, -1, 3]} scale={[6, 6, 1]} />
          <Lightformer form="circle" intensity={1.2} color="#ffffff" position={[0, 4, -3]} scale={4} />
        </Environment>
      </Canvas>
    </div>
  );
}
