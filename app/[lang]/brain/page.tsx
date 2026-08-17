import { getAllContent, noteFrontmatterSchema } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Second Brain | Personal Universe",
  description: "A digital garden of my interconnected notes and ideas.",
};

export default async function BrainListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const notes = await getAllContent(lang, "notes", noteFrontmatterSchema);

  return (
    <Container className="py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Second Brain</h1>
        <p className="text-muted-foreground text-lg">
          My digital garden. A collection of interconnected notes, ideas, and references that grow over time.
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          The brain is empty. Add notes to content/notes!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link key={note.slug} href={`/${lang}/brain/${note.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">{note.metadata.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1 text-sm">
                  {note.metadata.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {note.metadata.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
                    <span>{new Date(note.metadata.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
