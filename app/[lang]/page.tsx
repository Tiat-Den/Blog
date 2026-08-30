import { getDictionary } from "@/lib/dictionary";
import dynamic from "next/dynamic";

// Dynamically import the 3D Solar System to avoid SSR issues with Three.js
const SolarSystem = dynamic(() => import("@/components/home/solar-system"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-black text-white">
      Loading the Universe...
    </div>
  )
});

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // We can still fetch the dictionary if we need it for later
  // const dict = await getDictionary(lang as "en" | "vi");

  return (
    <main className="w-full">
      <SolarSystem lang={lang} />
    </main>
  );
}
