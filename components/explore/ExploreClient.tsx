"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraphNode, GraphEdge } from "@/lib/content/graph";
import Link from "next/link";
import { LayoutList, Box } from "lucide-react";
import dynamic from "next/dynamic";

const Graph3D = dynamic(() => import("@/components/explore/Graph3DClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] md:h-[70vh] rounded-xl border flex justify-center items-center bg-muted/20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <Box className="w-8 h-8 text-muted-foreground animate-spin-slow" />
        <p className="text-muted-foreground">Initializing 3D Engine...</p>
      </div>
    </div>
  ),
});

type ViewMode = "list" | "3d";

interface ExploreClientProps {
  initialNodes: GraphNode[];
  initialEdges: GraphEdge[];
}

export function ExploreClient({ initialNodes, initialEdges }: ExploreClientProps) {
  const [filter, setFilter] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>("3d");

  const filteredNodes = React.useMemo(() => {
    if (!filter) return initialNodes;
    return initialNodes.filter(n => n.type === filter);
  }, [initialNodes, filter]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Personal Universe</h1>
          <p className="text-muted-foreground text-lg">
            Explore the interconnected nodes of my mind. 
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <LayoutList className="w-4 h-4 mr-2" /> List
            </Button>
            <Button 
              variant={viewMode === "3d" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("3d")}
              className="h-8 px-3"
            >
              <Box className="w-4 h-4 mr-2" /> 3D View
            </Button>
          </div>
          
          {viewMode === "list" && (
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={filter === null ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setFilter(null)}
              >
                All
              </Badge>
              {["Note", "Project", "Post", "Experiment", "Capsule"].map(type => (
                <Badge 
                  key={type}
                  variant={filter === type ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setFilter(type)}
                >
                  {type}s
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewMode === "3d" ? (
        <div className="relative">
          <Graph3D nodes={initialNodes} edges={initialEdges} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map(node => {
            const nodeEdges = initialEdges.filter(e => e.source === node.id || e.target === node.id);
            const connectedIds = nodeEdges.map(e => e.source === node.id ? e.target : e.source);
            const connectedNodes = initialNodes.filter(n => connectedIds.includes(n.id));

            return (
              <Card key={node.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={node.url} className="font-bold hover:underline">
                      <CardTitle className="text-lg leading-tight">{node.title}</CardTitle>
                    </Link>
                    <Badge variant="secondary" className="text-[10px] uppercase shrink-0">
                      {node.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col gap-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Connected to ({connectedNodes.length})
                  </h4>
                  {connectedNodes.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No connections yet.</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5 text-sm">
                      {connectedNodes.map(cn => (
                        <li key={cn.id} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span>
                          <Link href={cn.url} className="hover:text-primary hover:underline line-clamp-1">
                            {cn.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
