import { NextResponse } from "next/server";
import { getGraphData } from "@/lib/content/graph";
export type { GraphNode, GraphEdge } from "@/lib/content/graph";

export async function GET() {
  const data = await getGraphData();
  return NextResponse.json(data);
}
