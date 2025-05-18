import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Environment } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const SCATTER_RANGE = { x: 1.5, y: 1.5, z: 0.75 };
const LERP_SMOOTHNESS_FACTOR = 0.1;

// Interface for Droplet props
interface DropletProps {
  position: [number, number, number];
  isScattered: boolean;
  args?: [radius: number, widthSegments: number, heightSegments: number];
}

const Droplet = ({
  position,
  isScattered,
  args = [0.4, 64, 64],
}: DropletProps) => {
  const ref = useRef<Mesh>(null);
  const originalPositionVec = useRef(new Vector3(...position)).current;
  
  // For random scatter: Ref to hold the latest isScattered value for GSAP callbacks
  const isScatteredRef = useRef(isScattered);

  useEffect(() => {
    isScatteredRef.current = isScattered;
  }, [isScattered]);

  // For random scatter: Callback for continuous random animation
  const animateToRandomPoint = useCallback(() => {
    if (!ref.current || !isScatteredRef.current) {
      // If not scattered anymore, or ref is null, stop the loop.
      return;
    }

    // Calculate random offsets based on SCATTER_RANGE
    const offsetX = (Math.random() - 0.5) * 2 * SCATTER_RANGE.x;
    const offsetY = (Math.random() - 0.5) * 2 * SCATTER_RANGE.y;
    const offsetZ = (Math.random() - 0.5) * 2 * SCATTER_RANGE.z;

    // The new target is the original position plus the random offset
    const newTarget = new Vector3(
      originalPositionVec.x + offsetX,
      originalPositionVec.y + offsetY,
      originalPositionVec.z + offsetZ
    );

    const duration = 1.2 + Math.random() * 0.8; 
    const ease = "power1.inOut";

    gsap.killTweensOf(ref.current.position); 
    gsap.to(ref.current.position, {
      x: newTarget.x,
      y: newTarget.y,
      z: newTarget.z,
      duration: duration,
      ease: ease,
      onComplete: () => {
        if (isScatteredRef.current) {
          animateToRandomPoint(); 
        }
      },
    });
  }, [originalPositionVec]); // originalPositionVec is stable

  // For random scatter: Main useEffect to handle scattering or returning
  useEffect(() => {
    if (!ref.current) return;

    gsap.killTweensOf(ref.current.position); 

    if (isScattered) {
      animateToRandomPoint(); 
    } else {
      gsap.to(ref.current.position, {
        x: originalPositionVec.x,
        y: originalPositionVec.y,
        z: originalPositionVec.z,
        duration: 1.2, 
        ease: "power2.out",
      });
    }
    
    return () => {
      if (ref.current) { 
        gsap.killTweensOf(ref.current.position);
      }
    };
  }, [isScattered, originalPositionVec, animateToRandomPoint]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Only rotation is handled in useFrame now
    const rotationSpeed = 0.003;
    ref.current.rotation.x += rotationSpeed * delta * 60; 
    ref.current.rotation.y += rotationSpeed * delta * 60;
  });

  return (
    <Sphere ref={ref} args={args} position={position}>
      <meshStandardMaterial
        color="#1A1A1A"
        metalness={0.95}
        roughness={0.05}
        transparent={true}
        opacity={0.85}
        emissive="#000000"
        depthTest={false}
      />
    </Sphere>
  );
};

// Props interfaces for components further up the chain
interface SceneProps {
  isScattered: boolean;
}

// Main drop model composed of multiple droplets
const DropModel = ({ isScattered }: SceneProps) => {
  const baseSize = 0.3;
  const dropletsConfig = [
    { id: 'main', args: [baseSize * 1.8, 64, 64], pos: [0,0,0] as [number,number,number] },
    { id: 't1', args: [baseSize * 1.0, 64, 64], pos: [0.6,0.5,0.15] as [number,number,number] },
    { id: 't2', args: [baseSize * 0.9, 64, 64], pos: [-0.5,0.6,-0.1] as [number,number,number] },
    { id: 't3', args: [baseSize * 1.1, 64, 64], pos: [0.4,-0.55,0.2] as [number,number,number] },
    { id: 't4', args: [baseSize * 0.8, 64, 64], pos: [-0.65,-0.4,-0.25] as [number,number,number] },
  ];

  return (
    <group>
      {dropletsConfig.map(config => (
        <Droplet 
          key={config.id}
          position={config.pos}
          args={config.args as [number, number, number]}
          isScattered={isScattered}
        />
      ))}
    </group>
  );
};

// Scene setup with lighting
const DropScene = ({ isScattered }: SceneProps) => {
  return (
    <>
      <ambientLight intensity={0.3} /> 
      <pointLight position={[5, 8, 5]} intensity={0.7} /> 
      <pointLight position={[-5, -3, -3]} intensity={0.2} color="#A0A0FF" /> 
      <DropModel isScattered={isScattered} />
      <Environment preset="lobby" background={false} /> 
    </>
  );
};

// Main component with canvas
const DropAnimation = () => {
  const [isScattered, setIsScattered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); 

  const triggerInteraction = useCallback(() => {
    setIsScattered(true);
  }, []);

  // ADDED: useEffect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      // Set isScattered to false when user scrolls
      setIsScattered(currentIsScattered => {
        if (currentIsScattered) { // Only update if it was true, to avoid unnecessary re-renders
          return false;
        }
        return currentIsScattered; // Or simply return false
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onPointerEnter={triggerInteraction}
      style={{
        zIndex: 10,
        position: 'relative',
        touchAction: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <DropScene isScattered={isScattered} />
      </Canvas>
    </motion.div>
  );
};

export default DropAnimation;