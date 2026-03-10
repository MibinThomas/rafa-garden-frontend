"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sphere, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Slide 0: The Blossom
// A breathing, glowing night-blooming flower.
function Blossom() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

      // Slow organic breathing scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Glowing Core */}
      <Sphere args={[0.8, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#d4af37"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Organic surrounding petals */}
      {[...Array(32)].map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const radius = 1.0;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 4) * 0.3 - 0.2,
              Math.sin(angle) * radius
            ]}
            rotation={[
              Math.PI / 4 + Math.sin(angle) * 0.5,
              -angle,
              Math.PI / 6
            ]}
          >
            <coneGeometry args={[0.15, 2.5, 16]} />
            <meshStandardMaterial
              color="#fffdd0"
              roughness={0.3}
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        )
      })}
      <Sparkles count={150} scale={6} size={4} speed={0.4} opacity={0.8} color="#d4af37" />
    </group>
  );
}

// Slide 1: Original Dragon Fruit
// A distorted magenta sphere with green surrounding scales.
function DragonFruitOrganic() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Soft, bumpy magenta core */}
      <Sphere args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color="#FF007F"
          distort={0.25}
          speed={1.5}
          roughness={0.4}
          metalness={0.1}
          emissive="#CC0066"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* The outer green scales using Fibonacci sphere logic */}
      {[...Array(28)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 28);
        const theta = Math.sqrt(28 * Math.PI) * phi;
        const dist = 1.5;
        const x = dist * Math.cos(theta) * Math.sin(phi);
        const y = dist * Math.sin(theta) * Math.sin(phi);
        const z = dist * Math.cos(phi);

        return (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[phi, theta, Math.PI / 4]}
          >
            <coneGeometry args={[0.25, 1.2, 16]} />
            <meshStandardMaterial
              color="#38b000"
              emissive="#0b2b1a"
              emissiveIntensity={0.3}
              roughness={0.7}
            />
          </mesh>
        )
      })}
      <Sparkles count={80} scale={8} size={5} speed={0.5} opacity={0.6} color="#FF007F" />
      <Sparkles count={60} scale={6} size={3} speed={0.8} opacity={0.5} color="#38b000" />
    </group>
  );
}

// Slide 2: Sliced Harvest
// Exploded view showing the inner crisp white flesh and black seeds.
function SlicedFruit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;

      // Slow hovering apart
      const separation = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.children[0].position.x = -1.2 - separation;
      groupRef.current.children[1].position.x = 1.2 + separation;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Left Slice */}
      <group position={[-1.2, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 12]}>
        {/* Magenta outer skin (half) */}
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]} />
          <meshStandardMaterial color="#FF007F" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        {/* Internal white flesh */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[1.48, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        {/* Black Seeds */}
        <Sparkles
          count={250}
          scale={2.6}
          size={2}
          color="#050505"
          speed={0}
          position={[0.01, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>

      {/* Right Slice */}
      <group position={[1.2, 0, 0]} rotation={[0, -Math.PI / 3, -Math.PI / 12]}>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]} />
          <meshStandardMaterial color="#FF007F" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[1.48, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <Sparkles
          count={250}
          scale={2.6}
          size={2}
          color="#050505"
          speed={0}
          position={[0.01, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>
    </group>
  );
}

// Camera matching logic based on the active slide
function InteractiveScene({ activeSlide }: { activeSlide: number }) {
  useFrame((state) => {
    // Adjust zoom distance dynamically
    const targetZ = activeSlide === 0 ? 9 : activeSlide === 1 ? 8 : 10;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    // Adjust Y height slightly to frame text better
    const targetY = activeSlide === 0 ? -1 : activeSlide === 1 ? -0.5 : 0;
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      {/* Conditional mounting of the 3 components. R3F mounts/unmounts fast enough for this slide transition */}
      {activeSlide === 0 && <Blossom />}
      {activeSlide === 1 && <DragonFruitOrganic />}
      {activeSlide === 2 && <SlicedFruit />}
    </Float>
  );
}

export function SpaceFruitCanvas({ activeSlide }: { activeSlide: number }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.7} />
        {/* Primary Key Light */}
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#d4af37" />
        {/* Secondary Fill Light */}
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#FF007F" />
        {/* Soft backlighting */}
        <pointLight position={[0, 5, -10]} intensity={1} color="#38b000" />

        <Environment preset="night" />
        <InteractiveScene activeSlide={activeSlide} />

        {/* Global ambient particles independent of slides */}
        <Sparkles count={50} scale={18} size={3} speed={0.2} opacity={0.4} color="#d4af37" />
      </Canvas>
    </div>
  );
}
