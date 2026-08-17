import { getFileContent, getFiles, postFrontmatterSchema } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ViewCounter } from "@/components/view-counter";

interface BlogPostPageProps {
  params: Promise<{ slug: string; lang: string }>
}

export async function generateStaticParams() {
  const viFiles = await getFiles("vi", "posts");
  const enFiles = await getFiles("en", "posts");
  return [
    ...viFiles.map((file) => ({ lang: "vi", slug: file.replace(/\.mdx?$/, "") })),
    ...enFiles.map((file) => ({ lang: "en", slug: file.replace(/\.mdx?$/, "") })),
  ];
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const post = await getFileContent(params.lang, "posts", `${params.slug}.mdx`, postFrontmatterSchema);
  if (!post) return {};

  return {
    title: `${post.metadata.title} | Personal Universe`,
    description: post.metadata.description,
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  // ensure lang is extracted
  const { lang } = await props.params;
  const params = await props.params;
  const post = await getFileContent(params.lang, "posts", `${params.slug}.mdx`, postFrontmatterSchema);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-3xl">
      <header className="flex flex-col gap-4">
        <Link href={`/${lang}/blog`} className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{post.metadata.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground text-sm font-mono mt-2">
          <time dateTime={post.metadata.date}>{post.metadata.date}</time>
          <ViewCounter slug={post.slug} trackView={true} hidden={true} />
        </div>
        {post.metadata.tags && post.metadata.tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {post.metadata.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>
      
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MdxContent source={post.source} />
      </article>
    </Container>
  );
}
