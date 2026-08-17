import { HeroSection } from "@/components/home/hero";
import { getDictionary } from "@/lib/dictionary";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "vi");

  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection dict={dict} lang={lang} />
    </div>
  );
}
