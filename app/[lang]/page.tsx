import SolarSystemWrapper from "@/components/home/solar-system-wrapper";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  return (
    <main className="w-full">
      <SolarSystemWrapper lang={lang} />
    </main>
  );
}
