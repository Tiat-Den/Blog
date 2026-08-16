import { getFileContent, getFiles, noteFrontmatterSchema, getAllContent } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

interface BrainPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const files = await getFiles("notes");
  return files.map((file) => ({
    slug: file.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata(props: BrainPageProps): Promise<Metadata> {
  const params = await props.params;
  const note = await getFileContent("notes", `${params.slug}.mdx`, noteFrontmatterSchema);
  if (!note) return {};

  return {
    title: `${note.metadata.title} | Personal Universe`,
    description: note.metadata.description,
  };
}

export default async function BrainNotePage(props: BrainPageProps) {
  const params = await props.params;
  const note = await getFileContent("notes", `${params.slug}.mdx`, noteFrontmatterSchema);

  if (!note) {
    notFound();
  }

  // Fetch related notes if they exist
  let relatedNotes: typeof note[] = [];
  if (note.metadata.related && note.metadata.related.length > 0) {
    const allNotes = await getAllContent("notes", noteFrontmatterSchema);
    relatedNotes = allNotes.filter(n => note.metadata.related?.includes(n.slug));
  }

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-4xl">
      <header className="flex flex-col gap-4 border-b pb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Link href="/brain" className="hover:text-foreground transition-colors">Brain</Link>
          <span>/</span>
          <span>{note.metadata.title}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{note.metadata.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span>{new Date(note.metadata.date).toLocaleDateString()}</span>
          {note.metadata.tags && note.metadata.tags.length > 0 && (
            <div className="flex gap-2">
              {note.metadata.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-muted/50 text-xs font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MdxContent source={note.source} />
      </article>

      {relatedNotes.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-bold mb-6">Connected Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedNotes.map((relNote) => (
              <Link key={relNote.slug} href={`/brain/${relNote.slug}`}>
                <Card className="hover:border-primary/50 transition-colors h-full bg-muted/10">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">{relNote.metadata.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 text-sm text-muted-foreground line-clamp-2">
                    {relNote.metadata.description}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
