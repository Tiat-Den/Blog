import { getFileContent, getFiles, labFrontmatterSchema, getAllContent } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { ViewCounter } from "@/components/view-counter";

interface LabPageProps {
  params: Promise<{ slug: string; lang: string }>
}

export async function generateStaticParams() {
  const viFiles = await getFiles("vi", "lab");
  const enFiles = await getFiles("en", "lab");
  const files = [...viFiles.map(f => ({ lang: "vi", slug: f.replace(/\.mdx?$/, "") })), ...enFiles.map(f => ({ lang: "en", slug: f.replace(/\.mdx?$/, "") }))];
  return files;
}

export async function generateMetadata(props: LabPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;
  const lab = await getFileContent(lang, "lab", `${params.slug}.mdx`, labFrontmatterSchema);
  if (!lab) return {};

  return {
    title: `${lab.metadata.title} | Lab`,
    description: lab.metadata.description,
  };
}

export default async function LabNotePage(props: LabPageProps) {
  const params = await props.params;
  const { lang } = params;
  const lab = await getFileContent(lang, "lab", `${params.slug}.mdx`, labFrontmatterSchema);

  if (!lab) {
    notFound();
  }

  const { title, date, description, status, tags } = lab.metadata;

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-4xl">
      <header className="flex flex-col gap-6 border-b pb-8 border-dashed">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono mb-2 bg-muted w-fit px-2 py-1 rounded">
          <Link href={`/${lang}/lab`} className="hover:text-foreground transition-colors">~/lab</Link>
          <span>/</span>
          <span>{params.slug}</span>
        </div>
        
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-4xl font-bold tracking-tight font-mono">{title}</h1>
          <Badge variant={status === "Success" ? "default" : status === "Failed" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        </div>

        {description && <p className="text-xl text-muted-foreground leading-relaxed font-mono">{description}</p>}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
          <span>{new Date(date).toLocaleDateString()}</span>
          <ViewCounter slug={lab.slug} trackView={true} hidden={true} />
          {tags && tags.length > 0 && (
            <div className="flex gap-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-muted px-1.5 py-0.5 rounded text-xs">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none prose-h1:font-mono prose-h2:font-mono prose-h3:font-mono">
        <MdxContent source={lab.source} />
      </article>
    </Container>
  );
}
