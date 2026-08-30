"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// Generate highly realistic procedural textures using Canvas API
const generatePlanetTexture = (type: string): THREE.CanvasTexture | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (type === 'earth') {
    ctx.fillStyle = '#1e3a8a'; // Ocean
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#15803d'; // Landmass
    for (let i = 0; i < 200; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 50 + 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Clouds
    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 30 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'mars') {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#7f1d1d';
    for (let i = 0; i < 800; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 12 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'jupiter') {
    for (let y = 0; y < 512; y += 4) {
      const isDark = Math.sin(y * 0.05 + Math.random()) > 0;
      ctx.fillStyle = isDark ? '#9a3412' : '#d97706';
      ctx.fillRect(0, y, 1024, 4 + Math.random() * 10);
    }
    ctx.fillStyle = '#7f1d1d'; // Great red spot
    ctx.beginPath();
    ctx.ellipse(300, 350, 80, 40, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'saturn') {
    for (let y = 0; y < 512; y += 8) {
      ctx.fillStyle = Math.sin(y * 0.02) > 0 ? '#fde68a' : '#fcd34d';
      ctx.fillRect(0, y, 1024, 8 + Math.random() * 4);
    }
  } else if (type === 'mercury') {
    ctx.fillStyle = '#737373';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#404040';
    for (let i = 0; i < 1000; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 8 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'uranus') {
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#22d3ee';
    for (let y = 0; y < 512; y += 30) {
      ctx.fillRect(0, y, 1024, 10);
    }
  } else if (type === 'neptune') {
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#3b82f6';
    for (let y = 0; y < 512; y += 20) {
      if (Math.random() > 0.5) ctx.fillRect(0, y, 1024, 5);
    }
  } else if (type === 'venus') {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 300; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 100 + 20, 10, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'sun') {
    const grd = ctx.createLinearGradient(0, 0, 0, 512);
    grd.addColorStop(0, "#fef08a");
    grd.addColorStop(0.5, "#f59e0b");
    grd.addColorStop(1, "#ea580c");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = "#fef08a";
    for (let i = 0; i < 150; i++) {
      ctx.globalAlpha = Math.random() * 0.6;
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 30 + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

const PLANETS = [
  { name: "About", url: "/about", radius: 6, speed: 0.8, size: 0.5, type: "earth", hasRing: false },
  { name: "Blog", url: "/blog", radius: 8.5, speed: 0.6, size: 0.4, type: "mars", hasRing: false },
  { name: "Projects", url: "/projects", radius: 11.5, speed: 0.4, size: 0.9, type: "jupiter", hasRing: false },
  { name: "Journey", url: "/journey", radius: 14, speed: 0.3, size: 0.3, type: "mercury", hasRing: false },
  { name: "Explore", url: "/explore", radius: 17, speed: 0.25, size: 0.75, type: "saturn", hasRing: true, ringColor: "#fde68a" },
  { name: "Brain", url: "/brain", radius: 20, speed: 0.15, size: 0.6, type: "uranus", hasRing: true, ringColor: "#a5f3fc" },
  { name: "Lab", url: "/lab", radius: 23, speed: 0.1, size: 0.6, type: "neptune", hasRing: false },
  { name: "Capsule", url: "/capsule", radius: 26, speed: 0.08, size: 0.4, type: "venus", hasRing: false },
];

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => generatePlanetTexture('sun'), []);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshBasicMaterial map={texture} color="#ffffff" />
      <pointLight intensity={200} distance={150} decay={1.5} color="#FDF2E9" />
      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
    </mesh>
  );
}

function Planet({ data, lang }: { data: typeof PLANETS[0]; lang: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const texture = useMemo(() => generatePlanetTexture(data.type), [data.type]);

  useFrame(({ clock }) => {
    if (meshRef.current && planetRef.current) {
      const t = clock.getElapsedTime() * data.speed + randomOffset;
      // Orbit around the sun
      meshRef.current.position.x = Math.cos(t) * data.radius;
      meshRef.current.position.z = Math.sin(t) * data.radius;
      // Self rotation
      planetRef.current.rotation.y += 0.01;
      
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group
      ref={meshRef}
      onClick={() => router.push(`/${lang}${data.url}`)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <mesh ref={planetRef}>
        <sphereGeometry args={[data.size, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          roughness={0.6}
          metalness={0.1}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Planetary Ring */}
      {data.hasRing && (
        <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[data.size * 1.4, data.size * 2.2, 64]} />
          <meshStandardMaterial color={data.ringColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
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
          // @ts-ignore
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
          </line>
        );
      })}
    </>
  );
}

export default function SolarSystem({ lang }: { lang: string }) {
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-black relative overflow-hidden">
      <Canvas camera={{ position: [0, 20, 35], fov: 55 }}>
        <color attach="background" args={["#020202"]} />
        {/* Much stronger ambient light to illuminate the dark side of planets */}
        <ambientLight intensity={1.5} />
        <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
        
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
          maxDistance={80}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
