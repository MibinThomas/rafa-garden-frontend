"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sphere, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";

// ==============================================
// Realistic Scroll-Tracking Rafah Roohafza Bottle
// ==============================================
function RoohafzaBottle({ isStatic }: { isStatic: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!isStatic) {
      // Constant gentle spinning when in hero
      groupRef.current.rotation.y += 0.015;
      // Subtle floating that occurs within the container
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else {
      // Smoothly snap to front-facing when static in grid
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    }
  });

  const bottlePoints = useMemo(() => [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(0.7, 0),
    new THREE.Vector2(0.75, 0.1),
    new THREE.Vector2(0.75, 1.8), // body
    new THREE.Vector2(0.4, 2.9),  // shoulder/neck
    new THREE.Vector2(0.32, 3.8),  // neck top
    new THREE.Vector2(0.32, 4.0),
    new THREE.Vector2(0.001, 4.0)
  ], []);

  const liquidPoints = useMemo(() => [
    new THREE.Vector2(0.001, 0.05),
    new THREE.Vector2(0.68, 0.05),
    new THREE.Vector2(0.73, 0.1),
    new THREE.Vector2(0.73, 1.8),
    new THREE.Vector2(0.42, 2.7), // liquid height tapering into neck
    new THREE.Vector2(0.001, 2.7)
  ], []);

  // Center pivot by pushing down
  return (
    <group ref={groupRef}>
      <group position={[0, -2, 0]}>
        {/* Glass */}
        <mesh>
          <latheGeometry args={[bottlePoints, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={1}
            metalness={0.1}
            roughness={0.05}
            ior={1.5}
            thickness={0.5}
            transparent
            clearcoat={1}
          />
        </mesh>

        {/* Liquid (Deep Red Ruby) */}
        <mesh>
          <latheGeometry args={[liquidPoints, 64]} />
          <meshStandardMaterial
            color="#8B0000"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Green Cap */}
        <mesh position={[0, 4.15, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.3, 32]} />
          <meshStandardMaterial color="#1f4d29" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Cap Bottom Ring */}
        <mesh position={[0, 3.95, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.1, 32]} />
          <meshStandardMaterial color="#1f4d29" roughness={0.3} />
        </mesh>

        {/* White Label representing the RoohAfza logo wrapper */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 1.3, 64]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.8} />
        </mesh>

        <Sparkles count={30} scale={1.2} size={2} speed={0.1} opacity={0.5} color="#ffffff" position={[0, 1.5, 0]} />
      </group>
    </group>
  );
}

function ScrollTrackingBottle() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const [isStatic, setIsStatic] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;

    const heroEl = document.getElementById("hero-visual-slot");
    const gridEl = document.getElementById("product-image-1");

    if (!heroEl || !gridEl) return;

    const scrollY = window.scrollY;
    const gridRect = gridEl.getBoundingClientRect();
    const heroRect = heroEl.getBoundingClientRect();

    const totalDist = (scrollY + gridRect.top) - (scrollY + heroRect.top);
    let progress = 0;
    if (totalDist > 0) {
      progress = Math.max(0, Math.min(scrollY / (totalDist * 0.8), 1));
    }

    if (progress > 0.95 !== isStatic) {
      setIsStatic(progress > 0.95);
    }

    const ease = progress < 0.5 ? 4 * progress * Math.pow(progress, 2) : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const xPx = heroRect.left + heroRect.width / 2 + (gridRect.left + gridRect.width / 2 - (heroRect.left + heroRect.width / 2)) * ease;
    const yPx = heroRect.top + heroRect.height / 2 + (gridRect.top + gridRect.height / 2 - (heroRect.top + heroRect.height / 2)) * ease;
    const heightPx = heroRect.height + (gridRect.height - heroRect.height) * ease;

    const xNdc = (xPx / window.innerWidth) * 2 - 1;
    const yNdc = -(yPx / window.innerHeight) * 2 + 1;

    const vec = new THREE.Vector3(xNdc, yNdc, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    const pos = new THREE.Vector3().copy(camera.position).add(vec.multiplyScalar(distance));

    groupRef.current.position.lerp(pos, 0.15);

    const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    const visibleHeightAtZ0 = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const targetScale = (heightPx / window.innerHeight) * visibleHeightAtZ0;

    const normalizer = 4.4; // Height of Lathe geometry is 4.0 + cap ~ 4.4
    const fillFactor = progress > 0.5 ? 0.95 : 0.8;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, (targetScale / normalizer) * fillFactor, 0.15));
  });

  return (
    <group ref={groupRef}>
      <RoohafzaBottle isStatic={isStatic} />
    </group>
  );
}

// ==============================================
// Slide 2: Original Organic Dragon Fruit
// ==============================================
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
      <Sphere args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          color="#C96A82"
          distort={0.25}
          speed={1.5}
          roughness={0.4}
          metalness={0.1}
          emissive="#E08CA1"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {[...Array(28)].map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 28);
        const theta = Math.sqrt(28 * Math.PI) * phi;
        const dist = 1.5;
        const x = dist * Math.cos(theta) * Math.sin(phi);
        const y = dist * Math.sin(theta) * Math.sin(phi);
        const z = dist * Math.cos(phi);

        return (
          <mesh key={i} position={[x, y, z]} rotation={[phi, theta, Math.PI / 4]}>
            <coneGeometry args={[0.25, 1.2, 16]} />
            <meshStandardMaterial color="#2C4C3B" emissive="#0A0A0A" emissiveIntensity={0.3} roughness={0.7} />
          </mesh>
        )
      })}
      <Sparkles count={80} scale={8} size={5} speed={0.5} opacity={0.6} color="#E08CA1" />
      <Sparkles count={60} scale={6} size={3} speed={0.8} opacity={0.5} color="#2C4C3B" />
    </group>
  );
}

// ==============================================
// Slide 3: Sliced Harvest
// ==============================================
function SlicedFruit() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      const separation = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.children[0].position.x = -1.2 - separation;
      groupRef.current.children[1].position.x = 1.2 + separation;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <group position={[-1.2, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 12]}>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]} />
          <meshStandardMaterial color="#C96A82" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[1.48, 64]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.8} />
        </mesh>
        <Sparkles count={250} scale={2.6} size={2} color="#050505" speed={0} position={[0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>

      <group position={[1.2, 0, 0]} rotation={[0, -Math.PI / 3, -Math.PI / 12]}>
        <mesh position={[-0.1, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64, 0, Math.PI]} />
          <meshStandardMaterial color="#C96A82" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[1.48, 64]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.8} />
        </mesh>
        <Sparkles count={250} scale={2.6} size={2} color="#050505" speed={0} position={[0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>
    </group>
  );
}

// ==============================================
// Global Interactive Scene Controller
// ==============================================
function InteractiveScene({ activeSlide }: { activeSlide: number }) {
  useFrame((state) => {
    if (activeSlide !== 0) {
      const targetZ = activeSlide === 1 ? 8 : 10;
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

      const targetY = activeSlide === 1 ? -0.5 : 0;
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    } else {
      // Neutralize camera for precise 1:1 window DOM mapping math on Slide 0
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 10, 0.1);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.1);
    }
  });

  return (
    <>
      {activeSlide === 0 && <ScrollTrackingBottle />}

      {activeSlide !== 0 && (
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
          {activeSlide === 1 && <DragonFruitOrganic />}
          {activeSlide === 2 && <SlicedFruit />}
        </Float>
      )}
    </>
  );
}

// ==============================================
// Global Roots
// ==============================================
export function SpaceFruitCanvas({ activeSlide }: { activeSlide: number }) {
  return null; // Local hero fallback removed
}

export function GlobalSpaceFruitCanvas() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    function handleSlideChange(e: any) {
      setSlide(e.detail);
    }
    window.addEventListener('updateHeroSlide', handleSlideChange);
    return () => window.removeEventListener('updateHeroSlide', handleSlideChange);
  }, []);

  // No opacity toggle, the canvas stays 100% visible and manages its contents internally with InteractiveScene
  return (
    <div className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#C5A880" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#C96A82" />
        <pointLight position={[0, 5, -10]} intensity={1} color="#2C4C3B" />

        <Environment preset="night" />
        <InteractiveScene activeSlide={slide} />

        <Sparkles count={50} scale={18} size={3} speed={0.2} opacity={0.4} color="#C5A880" />
      </Canvas>
    </div>
  );
}
