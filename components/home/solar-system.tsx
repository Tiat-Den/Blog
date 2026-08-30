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

  // Utility to add soft noise/clouds
  const addNoise = (color: string, count: number, maxRadius: number, blur: number) => {
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * maxRadius + 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.filter = 'none';
  };

  const addHorizontalBands = (colors: string[], blur: number) => {
    ctx.filter = `blur(${blur}px)`;
    for (let y = 0; y < 512; y += 4) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      ctx.fillRect(0, y, 1024, Math.random() * 20 + 5);
    }
    ctx.globalAlpha = 1.0;
    ctx.filter = 'none';
  };

  if (type === 'earth') {
    ctx.fillStyle = '#0f172a'; // Deep ocean
    ctx.fillRect(0, 0, 1024, 512);
    addNoise('#1e3a8a', 100, 100, 20); // Lighter ocean spots
    addNoise('#166534', 150, 60, 10); // Landmasses
    addNoise('#4d7c0f', 100, 40, 5); 
    addNoise('rgba(255, 255, 255, 0.7)', 300, 40, 15); // Clouds
  } else if (type === 'mars') {
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 0, 1024, 512);
    addNoise('#991b1b', 200, 80, 20);
    addNoise('#450a0a', 300, 20, 5); // Craters
    addNoise('#b91c1c', 100, 100, 30);
  } else if (type === 'jupiter') {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 1024, 512);
    addHorizontalBands(['#92400e', '#b45309', '#d97706', '#fcd34d', '#78350f'], 8);
    // Great red spot
    ctx.filter = 'blur(10px)';
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(300, 350, 80, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(300, 350, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
  } else if (type === 'saturn') {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 1024, 512);
    addHorizontalBands(['#d97706', '#fcd34d', '#fde68a', '#b45309'], 10);
  } else if (type === 'mercury') {
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 1024, 512);
    addNoise('#525252', 200, 50, 10);
    addNoise('#262626', 400, 15, 2); // Small craters
  } else if (type === 'uranus') {
    ctx.fillStyle = '#0891b2';
    ctx.fillRect(0, 0, 1024, 512);
    addHorizontalBands(['#06b6d4', '#22d3ee', '#67e8f9'], 15);
  } else if (type === 'neptune') {
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 1024, 512);
    addHorizontalBands(['#1d4ed8', '#2563eb', '#1e40af'], 20);
    // Dark spot
    ctx.filter = 'blur(15px)';
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(600, 250, 60, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';
  } else if (type === 'venus') {
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 1024, 512);
    addHorizontalBands(['#f59e0b', '#fbbf24', '#fcd34d'], 25);
    addNoise('rgba(253, 230, 138, 0.4)', 200, 80, 20); // Swirling clouds
  } else if (type === 'sun') {
    const grd = ctx.createLinearGradient(0, 0, 0, 512);
    grd.addColorStop(0, "#fef08a");
    grd.addColorStop(0.5, "#f59e0b");
    grd.addColorStop(1, "#ea580c");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 512);
    addNoise('#fef08a', 200, 60, 15);
    addNoise('#c2410c', 100, 20, 8); // Sunspots
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

// Map planets in their realistic solar system order
const PLANETS = [
  // 1. Mercury
  { name: "Journey", url: "/journey", radius: 4, speed: 0.8, size: 0.2, type: "mercury", hasRing: false },
  // 2. Venus
  { name: "Capsule", url: "/capsule", radius: 6, speed: 0.6, size: 0.35, type: "venus", hasRing: false },
  // 3. Earth
  { name: "About", url: "/about", radius: 8.5, speed: 0.5, size: 0.4, type: "earth", hasRing: false },
  // 4. Mars
  { name: "Blog", url: "/blog", radius: 11, speed: 0.4, size: 0.25, type: "mars", hasRing: false },
  // 5. Jupiter
  { name: "Projects", url: "/projects", radius: 15, speed: 0.2, size: 1.0, type: "jupiter", hasRing: false },
  // 6. Saturn
  { name: "Explore", url: "/explore", radius: 20, speed: 0.15, size: 0.85, type: "saturn", hasRing: true, ringColor: "#d4b872" },
  // 7. Uranus
  { name: "Brain", url: "/brain", radius: 25, speed: 0.1, size: 0.6, type: "uranus", hasRing: true, ringColor: "#a5f3fc" },
  // 8. Neptune
  { name: "Lab", url: "/lab", radius: 30, speed: 0.08, size: 0.55, type: "neptune", hasRing: false },
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
      <pointLight intensity={300} distance={200} decay={1.5} color="#FDF2E9" />
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
