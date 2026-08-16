import { Container } from "@/components/layout/container";
import { getGraphData } from "@/lib/content/graph";
import { ExploreClient } from "@/components/explore/ExploreClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | Personal Universe",
  description: "Explore the interconnected nodes of my mind via a 3D knowledge graph.",
};

export default async function ExplorePage() {
  // Tối ưu hiệu suất: Lấy data ở phía Server lúc build/render, không bắt Client phải chờ fetch().
  const { nodes, edges } = await getGraphData();

  return (
    <Container className="py-12 flex flex-col gap-8 max-w-5xl">
      <ExploreClient initialNodes={nodes} initialEdges={edges} />
    </Container>
  );
}
