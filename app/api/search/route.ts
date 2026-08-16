import { NextResponse } from "next/server";
import { getAllContent, projectFrontmatterSchema, noteFrontmatterSchema, baseFrontmatterSchema, labFrontmatterSchema, capsuleFrontmatterSchema } from "@/lib/content";

export async function GET() {
  const posts = await getAllContent("posts", baseFrontmatterSchema);
  const projects = await getAllContent("projects", projectFrontmatterSchema);
  const notes = await getAllContent("notes", noteFrontmatterSchema);
  const labs = await getAllContent("lab", labFrontmatterSchema);
  const capsules = await getAllContent("capsule", capsuleFrontmatterSchema);

  const index = [
    ...posts.map(p => ({ type: "Post", title: p.metadata.title, slug: `/blog/${p.slug}`, content: p.source })),
    ...projects.map(p => ({ type: "Project", title: p.metadata.title, slug: `/projects/${p.slug}`, content: p.source })),
    ...notes.map(n => ({ type: "Note", title: n.metadata.title, slug: `/brain/${n.slug}`, content: n.source })),
    ...labs.map(l => ({ type: "Experiment", title: l.metadata.title, slug: `/lab/${l.slug}`, content: l.source })),
    ...capsules.map(c => ({ type: "Capsule", title: c.metadata.title, slug: `/capsule/${c.slug}`, content: c.source })),
  ];

  return NextResponse.json(index);
}
