"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sphere, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function DragonFruitGarden() {
  const groupRef = useRef<THREE.Group>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate based on scroll position and slowly over time
      groupRef.current.rotation.y = scrollY * 0.005 + state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef}>
        {/* Main Cactus Stem (Hylocereus climbing vine) */}
        <mesh position={[0, -1.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 7, 5]} />
          <meshStandardMaterial color="#1b4332" roughness={0.9} />
        </mesh>

        {/* Secondary Cactus Branch */}
        <mesh position={[1.2, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.2, 0.3, 4, 5]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
        </mesh>

        {/* The Glowing Dragon Fruit */}
        <Sphere args={[1.6, 64, 64]} position={[2.2, 1.2, 0]}>
          <MeshDistortMaterial
            color="#FF007F"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.2}
            emissive="#CC0066"
            emissiveIntensity={0.4}
          />
        </Sphere>

        {/* Magical Garden Spores (Kerala Gold & Vibrant Green) */}
        <Sparkles count={150} scale={12} size={3} speed={0.4} opacity={0.6} color="#d4af37" />
        <Sparkles count={60} scale={10} size={5} speed={0.8} opacity={0.8} color="#38b000" />
        <Sparkles count={40} scale={8} size={4} speed={0.5} opacity={0.5} color="#FF007F" />

        {/* Floating Petals/Leaves clustered around the fruit */}
        {[...Array(10)].map((_, i) => (
          <mesh
            key={i}
            position={[
              2.2 + Math.sin((i / 10) * Math.PI * 2) * 1.9,
              1.2 + Math.cos((i / 10) * Math.PI * 2) * 1.9,
              Math.sin((i / 10) * Math.PI) * 1.5 - 0.75
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          >
            <coneGeometry args={[0.15, 0.8, 4]} />
            <meshStandardMaterial color="#38b000" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function SpaceFruitCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#d4af37" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38b000" />
        <Environment preset="forest" />
        <DragonFruitGarden />
      </Canvas>
    </div>
  );
}
