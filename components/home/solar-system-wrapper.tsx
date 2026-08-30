"use client";

import dynamic from "next/dynamic";

const SolarSystem = dynamic(() => import("./solar-system"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-black text-white">
      Loading the Universe...
    </div>
  )
});

export default function SolarSystemWrapper({ lang }: { lang: string }) {
  return <SolarSystem lang={lang} />;
}
