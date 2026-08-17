import { getAllContent, labFrontmatterSchema, LabFrontmatter } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab | Personal Universe",
  description: "Experiments, tests, and random code snippets.",
};

function StatusBadge({ status }: { status: LabFrontmatter["status"] }) {
  const variant = 
    status === "Success" ? "default" :
    status === "Running" ? "secondary" :
    status === "Failed" ? "destructive" : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}

export default async function LabListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const labs = await getAllContent(lang, "lab", labFrontmatterSchema);

  return (
    <Container className="py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Lab</h1>
        <p className="text-muted-foreground text-lg">
          My personal laboratory for UI experiments, code tests, and random ideas.
          Not everything here works, and that's the point.
        </p>
      </div>

      {labs.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          No experiments yet. Add them to content/lab!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <Link key={lab.slug} href={`/${lang}/lab/${lab.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col font-mono">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold truncate">{lab.metadata.title}</CardTitle>
                    <StatusBadge status={lab.metadata.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col gap-2 flex-1 text-sm">
                  {lab.metadata.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {lab.metadata.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-4 text-xs text-muted-foreground">
                    <span>{new Date(lab.metadata.date).toLocaleDateString()}</span>
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
