import { getAllContent } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // I need to create Badge
import Link from "next/link";
import { Metadata } from "next";
import { ViewCounter } from "@/components/view-counter";

export const metadata: Metadata = {
  title: "Blog | Personal Universe",
  description: "Read my latest thoughts, experiments, and learnings.",
};

export default async function BlogListingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const posts = await getAllContent(lang, "posts");

  return (
    <Container className="py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground text-lg">
          My latest thoughts, experiments, and technical deep-dives.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          No posts found. Start writing in content/posts!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${lang}/blog/${post.slug}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{post.metadata.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {post.metadata.description && (
                    <p className="text-muted-foreground">
                      {post.metadata.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>{new Date(post.metadata.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <ViewCounter slug={post.slug} trackView={false} />
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
