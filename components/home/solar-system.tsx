"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// We define our planets corresponding to the tabs.
// We'll use realistic colors/materials as a fallback if textures aren't available locally.
const PLANETS = [
  { name: "About", url: "/about", radius: 5, speed: 0.8, size: 0.5, color: "#2E86C1" },    // Earth-like
  { name: "Blog", url: "/blog", radius: 7, speed: 0.6, size: 0.4, color: "#E67E22" },      // Mars-like
  { name: "Projects", url: "/projects", radius: 9, speed: 0.4, size: 0.8, color: "#F39C12" }, // Jupiter-like
  { name: "Journey", url: "/journey", radius: 11, speed: 0.3, size: 0.3, color: "#839192" }, // Mercury-like
  { name: "Explore", url: "/explore", radius: 13, speed: 0.25, size: 0.7, color: "#F5CBA7" },// Saturn-like
  { name: "Brain", url: "/brain", radius: 16, speed: 0.15, size: 0.6, color: "#76D7C4" },    // Uranus-like
  { name: "Lab", url: "/lab", radius: 19, speed: 0.1, size: 0.6, color: "#2874A6" },       // Neptune-like
  { name: "Capsule", url: "/capsule", radius: 22, speed: 0.08, size: 0.2, color: "#D5D8DC" },// Pluto-like
];

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      {/* A realistic glowing sun material */}
      <meshBasicMaterial color="#FDF2E9" />
      <pointLight intensity={3} distance={100} decay={2} color="#FDF2E9" />
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color="#F39C12" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>
    </mesh>
  );
}

function Planet({ data, lang }: { data: typeof PLANETS[0]; lang: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Randomize starting position on orbit
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * data.speed + randomOffset;
      // Orbit around the sun
      meshRef.current.position.x = Math.cos(t) * data.radius;
      meshRef.current.position.z = Math.sin(t) * data.radius;
      // Self rotation
      meshRef.current.rotation.y += 0.01;
      
      // Hover effect: scale up slightly
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={() => router.push(`/${lang}${data.url}`)}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[data.size, 32, 32]} />
      <meshStandardMaterial 
        color={data.color} 
        roughness={hovered ? 0.4 : 0.8}
        metalness={0.2}
        emissive={data.color}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

function OrbitRings() {
  return (
    <>
      {PLANETS.map((p, i) => {
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(angle) * p.radius, 0, Math.sin(angle) * p.radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.05} />
          </line>
        );
      })}
    </>
  );
}

export default function SolarSystem({ lang }: { lang: string }) {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black relative overflow-hidden">
      <Canvas camera={{ position: [0, 15, 30], fov: 50 }}>
        <color attach="background" args={["#030303"]} />
        <ambientLight intensity={0.1} />
        {/* Realistic starfield background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <Sun />
          <OrbitRings />
          {PLANETS.map((planet, idx) => (
            <Planet key={idx} data={planet} lang={lang} />
          ))}
        </Suspense>

        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          maxDistance={60}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
