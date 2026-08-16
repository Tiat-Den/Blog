import { getAllContent, projectFrontmatterSchema, noteFrontmatterSchema, baseFrontmatterSchema, labFrontmatterSchema, capsuleFrontmatterSchema } from "@/lib/content";

export interface GraphNode {
  id: string; // slug
  title: string;
  type: "Post" | "Project" | "Note" | "Experiment" | "Capsule";
  url: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export async function getGraphData() {
  const posts = await getAllContent("posts", baseFrontmatterSchema);
  const projects = await getAllContent("projects", projectFrontmatterSchema);
  const notes = await getAllContent("notes", noteFrontmatterSchema);
  const labs = await getAllContent("lab", labFrontmatterSchema);
  const capsules = await getAllContent("capsule", capsuleFrontmatterSchema);

  const nodes: Record<string, GraphNode> = {};
  const edges: GraphEdge[] = [];

  // Register Nodes
  posts.forEach(p => {
    nodes[p.slug] = { id: p.slug, title: p.metadata.title, type: "Post", url: `/blog/${p.slug}` };
    // @ts-ignore
    if (p.metadata.related) {
      // @ts-ignore
      p.metadata.related.forEach(target => edges.push({ source: p.slug, target }));
    }
  });
  projects.forEach(p => {
    nodes[p.slug] = { id: p.slug, title: p.metadata.title, type: "Project", url: `/projects/${p.slug}` };
    // @ts-ignore
    if (p.metadata.related) {
      // @ts-ignore
      p.metadata.related.forEach((target: string) => edges.push({ source: p.slug, target }));
    }
  });
  notes.forEach(n => {
    nodes[n.slug] = { id: n.slug, title: n.metadata.title, type: "Note", url: `/brain/${n.slug}` };
    if (n.metadata.related) {
      n.metadata.related.forEach(target => edges.push({ source: n.slug, target }));
    }
  });
  labs.forEach(l => {
    nodes[l.slug] = { id: l.slug, title: l.metadata.title, type: "Experiment", url: `/lab/${l.slug}` };
    if (l.metadata.related) {
      l.metadata.related.forEach(target => edges.push({ source: l.slug, target }));
    }
  });
  capsules.forEach(c => {
    nodes[c.slug] = { id: c.slug, title: c.metadata.title, type: "Capsule", url: `/capsule/${c.slug}` };
    if (c.metadata.related) {
      c.metadata.related.forEach(target => edges.push({ source: c.slug, target }));
    }
  });

  // Filter edges to only keep those where both source and target exist
  const validEdges = edges.filter(e => nodes[e.source] && nodes[e.target]);

  // Make edges bidirectional if they aren't already
  const uniqueEdges = new Set<string>();
  const finalEdges: GraphEdge[] = [];
  
  validEdges.forEach(e => {
    const key1 = `${e.source}->${e.target}`;
    const key2 = `${e.target}->${e.source}`;
    if (!uniqueEdges.has(key1) && !uniqueEdges.has(key2)) {
      uniqueEdges.add(key1);
      finalEdges.push(e);
    }
  });

  return {
    nodes: Object.values(nodes),
    edges: finalEdges
  };
}
