import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGraphData } from "../graph";
import * as content from "../index";

vi.mock("../index", async () => {
  const actual = await vi.importActual("../index");
  return {
    ...actual,
    getAllContent: vi.fn(),
  };
});

describe("Graph Builder", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should build nodes and bidirectional edges correctly", async () => {
    // Mock data
    vi.mocked(content.getAllContent).mockImplementation(async (dir) => {
      if (dir === "posts") {
        return [
          { slug: "hello-world", source: "", metadata: { title: "Hello World", date: "2026-08-16", related: ["my-project"] } }
        ];
      }
      if (dir === "projects") {
        return [
          { slug: "my-project", source: "", metadata: { title: "My Project", date: "2026-08-16", related: ["hello-world", "missing-node"] } }
        ];
      }
      return [];
    });

    const { nodes, edges } = await getGraphData();

    // Verify Nodes
    expect(nodes).toHaveLength(2);
    const postNode = nodes.find(n => n.id === "hello-world");
    const projectNode = nodes.find(n => n.id === "my-project");
    
    expect(postNode?.type).toBe("Post");
    expect(projectNode?.type).toBe("Project");

    // Verify Edges
    // hello-world -> my-project, my-project -> hello-world
    // But since they are bidirectional and deduped, there should be exactly 1 edge connecting them
    expect(edges).toHaveLength(1);
    
    // The missing-node should NOT create an edge
    const hasMissingEdge = edges.some(e => e.target === "missing-node" || e.source === "missing-node");
    expect(hasMissingEdge).toBe(false);
  });
});
