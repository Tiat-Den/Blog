import { NextResponse, NextRequest } from "next/server";
import { getAllContent, projectFrontmatterSchema, noteFrontmatterSchema, baseFrontmatterSchema, labFrontmatterSchema, capsuleFrontmatterSchema } from "@/lib/content";

export async function GET(request: NextRequest) {
  // Infer lang from referrer since this is an API call from client side
  const referer = request.headers.get("referer") || "";
  const lang = referer.includes("/en/") || referer.endsWith("/en") ? "en" : "vi";

  const posts = await getAllContent(lang, "posts", baseFrontmatterSchema);
  const projects = await getAllContent(lang, "projects", projectFrontmatterSchema);
  const notes = await getAllContent(lang, "notes", noteFrontmatterSchema);
  const labs = await getAllContent(lang, "lab", labFrontmatterSchema);
  const capsules = await getAllContent(lang, "capsule", capsuleFrontmatterSchema);

  const index = [
    ...posts.map(p => ({ type: "Post", title: p.metadata.title, slug: `/${lang}/blog/${p.slug}`, content: p.source })),
    ...projects.map(p => ({ type: "Project", title: p.metadata.title, slug: `/${lang}/projects/${p.slug}`, content: p.source })),
    ...notes.map(n => ({ type: "Note", title: n.metadata.title, slug: `/${lang}/brain/${n.slug}`, content: n.source })),
    ...labs.map(l => ({ type: "Experiment", title: l.metadata.title, slug: `/${lang}/lab/${l.slug}`, content: l.source })),
    ...capsules.map(c => ({ type: "Capsule", title: c.metadata.title, slug: `/${lang}/capsule/${c.slug}`, content: c.source })),
  ];

  return NextResponse.json(index);
}
