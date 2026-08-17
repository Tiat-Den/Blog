import { getDictionary } from "@/lib/dictionary";
import { getAllContent, projectFrontmatterSchema, ProjectFrontmatter } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Personal Universe",
  description: "Things I have built, am building, or plan to build.",
};

function StatusBadge({ status }: { status: ProjectFrontmatter["status"] }) {
  const variant = 
    status === "Completed" ? "default" :
    status === "Building" ? "secondary" :
    status === "Planning" ? "outline" :
    status === "Archived" ? "destructive" : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}

export default async function ProjectsListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "vi");
  const projects = await getAllContent(lang, "projects", projectFrontmatterSchema);

  return (
    <Container className="py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">{dict.projects.title}</h1>
        <p className="text-muted-foreground text-lg">
          {dict.projects.description}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          {dict.projects.empty}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link key={project.slug} href={`/${lang}/${lang}/projects/${project.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle>{project.metadata.title}</CardTitle>
                    <StatusBadge status={project.metadata.status} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                  {project.metadata.description && (
                    <p className="text-muted-foreground flex-1">
                      {project.metadata.description}
                    </p>
                  )}
                  {project.metadata.techStack && project.metadata.techStack.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-auto pt-4">
                      {project.metadata.techStack.map((tech) => (
                        <span key={tech} className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
