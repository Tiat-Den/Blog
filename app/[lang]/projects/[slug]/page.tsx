import { getFileContent, getFiles, projectFrontmatterSchema } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string; lang: string }>
}

export async function generateStaticParams() {
  const viFiles = await getFiles("vi", "projects");
  const enFiles = await getFiles("en", "projects");
  const files = [...viFiles.map(f => ({ lang: "vi", slug: f.replace(/\.mdx?$/, "") })), ...enFiles.map(f => ({ lang: "en", slug: f.replace(/\.mdx?$/, "") }))];
  return files;
}

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const params = await props.params;
  const project = await getFileContent(params.lang, "projects", `${params.slug}.mdx`, projectFrontmatterSchema);
  if (!project) return {};

  return {
    title: `${project.metadata.title} | Personal Universe`,
    description: project.metadata.description,
  };
}

export default async function ProjectPage(props: ProjectPageProps) {
  const params = await props.params;
  const project = await getFileContent(params.lang, "projects", `${params.slug}.mdx`, projectFrontmatterSchema);

  if (!project) {
    notFound();
  }

  const { title, date, description, tags, status, techStack, demoUrl, repoUrl } = project.metadata;

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-4xl">
      <header className="flex flex-col gap-6 border-b pb-12">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
          <Badge variant={status === "Completed" ? "default" : status === "Archived" ? "destructive" : "secondary"}>
            {status}
          </Badge>
        </div>

        {description && <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>}

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mt-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">Timeline</span>
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          {techStack && techStack.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">Tech Stack</span>
              <div className="flex gap-2 flex-wrap">
                {techStack.map(tech => <span key={tech}>{tech}</span>)}
              </div>
            </div>
          )}
        </div>

        {(demoUrl || repoUrl) && (
          <div className="flex gap-4 mt-6">
            {demoUrl && (
              <Button asChild>
                <a href={demoUrl} target="_blank" rel="noopener noreferrer">View Demo</a>
              </Button>
            )}
            {repoUrl && (
              <Button asChild variant="outline">
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">Source Code</a>
              </Button>
            )}
          </div>
        )}
      </header>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MdxContent source={project.source} />
      </article>
    </Container>
  );
}
