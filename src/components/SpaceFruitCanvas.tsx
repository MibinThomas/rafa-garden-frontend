"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function DragonFruit() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate based on scroll position and a little bit automatically over time
      meshRef.current.rotation.y = scrollY * 0.005 + state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = scrollY * 0.002 + state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        {/* Procedural pink material with some distortion to mimic spikes/texture */}
        <MeshDistortMaterial
          color="#FF007F"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.1}
          emissive="#CC0066"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Green decorative floating smaller bits mimicking spikes */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 12) * Math.PI * 2) * 2.2,
            Math.cos((i / 12) * Math.PI * 2) * 2.2,
            Math.sin((i / 12) * Math.PI) * 1.5 - 0.75
          ]}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        >
          <coneGeometry args={[0.2, 0.8, 16]} />
          <meshStandardMaterial color="#00FF66" roughness={0.5} />
        </mesh>
      ))}
    </Float>
  );
}

export function SpaceFruitCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#FF007F" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#00FF66" />
        <Environment preset="city" />
        <DragonFruit />
      </Canvas>
    </div>
  );
}
