import { getFileContent, getFiles, capsuleFrontmatterSchema, getAllContent } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CapsulePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const files = await getFiles("capsule");
  return files.map((file) => ({
    slug: file.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata(props: CapsulePageProps): Promise<Metadata> {
  const params = await props.params;
  const capsule = await getFileContent("capsule", `${params.slug}.mdx`, capsuleFrontmatterSchema);
  if (!capsule) return {};

  return {
    title: `${capsule.metadata.title} | Time Capsule`,
    description: capsule.metadata.description,
  };
}

export default async function CapsulePage(props: CapsulePageProps) {
  const params = await props.params;
  const capsule = await getFileContent("capsule", `${params.slug}.mdx`, capsuleFrontmatterSchema);

  if (!capsule) {
    notFound();
  }

  // Find prev/next
  const allCapsules = await getAllContent("capsule", capsuleFrontmatterSchema);
  // Sort by date ascending to find logical next/prev
  allCapsules.sort((a, b) => new Date(a.metadata.date).getTime() - new Date(b.metadata.date).getTime());
  
  const currentIndex = allCapsules.findIndex(c => c.slug === params.slug);
  const prevCapsule = currentIndex > 0 ? allCapsules[currentIndex - 1] : null;
  const nextCapsule = currentIndex < allCapsules.length - 1 ? allCapsules[currentIndex + 1] : null;

  const { title, date, description } = capsule.metadata;
  const monthName = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-3xl">
      <header className="flex flex-col gap-6 text-center border-b pb-8 border-dashed items-center">
        <Link href="/capsule" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-4">
          ← Back to Vault
        </Link>
        <span className="text-primary font-bold tracking-widest uppercase text-sm">
          {monthName}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-xl text-muted-foreground max-w-xl">{description}</p>}
      </header>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MdxContent source={capsule.source} />
      </article>

      <div className="flex justify-between items-center border-t border-dashed pt-8 mt-8">
        {prevCapsule ? (
          <Button variant="ghost" asChild className="flex flex-col items-start h-auto py-2">
            <Link href={`/capsule/${prevCapsule.slug}`}>
              <span className="text-xs text-muted-foreground mb-1 flex items-center"><ArrowLeft className="w-3 h-3 mr-1"/> Previous</span>
              <span className="font-semibold">{prevCapsule.metadata.title}</span>
            </Link>
          </Button>
        ) : <div />}

        {nextCapsule ? (
          <Button variant="ghost" asChild className="flex flex-col items-end h-auto py-2">
            <Link href={`/capsule/${nextCapsule.slug}`}>
              <span className="text-xs text-muted-foreground mb-1 flex items-center">Next <ArrowRight className="w-3 h-3 ml-1"/></span>
              <span className="font-semibold">{nextCapsule.metadata.title}</span>
            </Link>
          </Button>
        ) : <div />}
      </div>
    </Container>
  );
}
