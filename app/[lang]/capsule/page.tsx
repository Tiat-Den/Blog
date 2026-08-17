import { getAllContent, capsuleFrontmatterSchema } from "@/lib/content";
import { Container } from "@/components/layout/container";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Capsule | Personal Universe",
  description: "Monthly snapshots of my mind, goals, and learning.",
};

export default async function CapsuleListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const capsules = await getAllContent(lang, "capsule", capsuleFrontmatterSchema);

  // Group by year
  const grouped = capsules.reduce((acc, capsule) => {
    const year = new Date(capsule.metadata.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(capsule);
    return acc;
  }, {} as Record<number, typeof capsules>);

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-3xl">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Time Capsule</h1>
        <p className="text-muted-foreground text-lg">
          Monthly snapshots of what I'm learning, building, and thinking about.
          A structured way to look back and see how much has changed.
        </p>
      </div>

      {years.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          No snapshots yet. Create one in content/capsule!
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {years.map(year => (
            <section key={year} className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold border-b pb-2">{year}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grouped[year].map(capsule => {
                  const date = new Date(capsule.metadata.date);
                  const monthName = date.toLocaleString('default', { month: 'long' });
                  
                  return (
                    <Link 
                      key={capsule.slug} 
                      href={`/${lang}/capsule/${capsule.slug}`}
                      className="group flex flex-col p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card hover:bg-muted/50 relative overflow-hidden"
                    >
                      <span className="font-bold text-lg">{monthName}</span>
                      <span className="text-muted-foreground text-sm">{capsule.metadata.title}</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
