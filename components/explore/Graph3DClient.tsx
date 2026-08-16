"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { useRouter } from "next/navigation";
import { GraphNode, GraphEdge } from "@/app/api/graph/route";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface Graph3DClientProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function Graph3DClient({ nodes, edges }: Graph3DClientProps) {
  const fgRef = useRef<any>(null);
  const router = useRouter();
  const { theme } = useTheme();
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = useCallback(
    (node: any) => {
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      if (fgRef.current) {
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
          node, // lookAt ({ x, y, z })
          3000 // ms transition duration
        );
      }
    },
    [fgRef]
  );

  const handleNodeRightClick = useCallback(
    (node: any) => {
      router.push(node.url);
    },
    [router]
  );

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const bgColor = isDark ? "#09090b" : "#ffffff";
  const linkColor = isDark ? "#27272a" : "#e4e4e7"; // Tailwind border colors
  
  return (
    <div ref={containerRef} className="w-full h-[60vh] md:h-[70vh] rounded-xl border overflow-hidden bg-background">
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={{ nodes, links: edges }}
        nodeId="id"
        nodeLabel="title"
        nodeColor={(node: any) => {
          if (node.type === "Post") return "#3b82f6"; // blue
          if (node.type === "Project") return "#10b981"; // green
          if (node.type === "Experiment") return "#f59e0b"; // amber
          if (node.type === "Capsule") return "#ec4899"; // pink
          return "#8b5cf6"; // purple for Note
        }}
        nodeVal={(node: any) => {
          // Calculate degree
          const degree = edges.filter(e => e.source === node.id || e.target === node.id).length;
          return 1 + Math.sqrt(degree);
        }}
        linkColor={() => linkColor}
        backgroundColor={bgColor}
        onNodeClick={handleNodeClick}
        onNodeRightClick={handleNodeRightClick}
        nodeResolution={16}
        linkResolution={6}
        showNavInfo={false}
      />
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur text-xs p-2 rounded-md border flex flex-col gap-1 pointer-events-none text-muted-foreground">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Post</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Project</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span> Note</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> Lab</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ec4899]"></span> Capsule</div>
        <div className="mt-2 pt-2 border-t text-[10px]">
          Left Click: Focus | Right Click: Open
        </div>
      </div>
    </div>
  );
}
