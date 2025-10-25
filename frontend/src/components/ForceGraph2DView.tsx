import { useRef, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useStore } from '@/store/useStore';
import { ENTITY_COLORS, Node as GraphNode, Edge as GraphEdge } from '@/types';

export function ForceGraph2DView() {
  const graphRef = useRef<any>();
  
  const {
    filteredGraphData,
    highlightedNodes,
    highlightedLinks,
    setSelectedNode,
    viewMode,
  } = useStore();

  // Auto-zoom to fit graph
  useEffect(() => {
    if (graphRef.current && filteredGraphData) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);
      }, 100);
    }
  }, [filteredGraphData]);

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedNode(node as GraphNode);
    },
    [setSelectedNode]
  );

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  if (!filteredGraphData || !filteredGraphData.nodes || filteredGraphData.nodes.length === 0) {
    console.log('ForceGraph2D: No data', { filteredGraphData });
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧬</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {filteredGraphData?.nodes ? 'No Nodes After Filtering' : 'No Graph Data'}
          </h2>
          <p className="text-gray-400">
            {filteredGraphData?.nodes ? 'Try adjusting your filters' : 'Upload PDFs to generate a knowledge graph'}
          </p>
        </div>
      </div>
    );
  }

  console.log('ForceGraph2D rendering:', {
    nodes: filteredGraphData.nodes.length,
    edges: filteredGraphData.edges.length,
    sampleNode: filteredGraphData.nodes[0],
    sampleEdge: filteredGraphData.edges[0]
  });

  return (
    <div className="w-full h-full graph-container">
      <ForceGraph2D
        ref={graphRef}
        graphData={{
          nodes: filteredGraphData.nodes,
          links: filteredGraphData.edges
        }}
        nodeId="id"
        nodeLabel={(node: any) => {
          const n = node as GraphNode;
          return `<div style="padding: 8px; max-width: 300px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${n.id}</div>
            <div style="color: #9ca3af;">Type: ${n.group}</div>
            <div style="color: #9ca3af;">Connections: ${n.value}</div>
          </div>`;
        }}
        nodeColor={(node: any) => {
          const n = node as GraphNode;
          if (highlightedNodes.size > 0) {
            return highlightedNodes.has(n.id)
              ? ENTITY_COLORS[n.group]
              : 'rgba(100, 100, 100, 0.3)';
          }
          return ENTITY_COLORS[n.group];
        }}
        nodeRelSize={6}
        nodeVal={(node: any) => {
          const n = node as GraphNode;
          return n.value || 1;
        }}
        nodeCanvasObject={
          viewMode.showLabels
            ? (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const n = node as GraphNode;
                const label = n.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(
                  (n) => n + fontSize * 0.2
                );

                // Only show labels for highlighted nodes or when zoomed in
                if (
                  highlightedNodes.size === 0 ||
                  highlightedNodes.has(n.id)
                ) {
                  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                  ctx.fillRect(
                    node.x - bckgDimensions[0] / 2,
                    node.y - bckgDimensions[1] / 2 - 15,
                    bckgDimensions[0],
                    bckgDimensions[1]
                  );

                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = 'white';
                  ctx.fillText(label, node.x, node.y - 15);
                }
              }
            : undefined
        }
        linkColor={(link: any) => {
          const l = link as GraphEdge;
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any)?.id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any)?.id;
          const linkId = `${sourceId}-${targetId}`;
          if (highlightedLinks.size > 0) {
            return highlightedLinks.has(linkId)
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(100, 100, 100, 0.15)';
          }
          return 'rgba(255, 255, 255, 0.2)';
        }}
        linkWidth={(link: any) => {
          const l = link as GraphEdge;
          const sourceId = typeof l.source === 'string' ? l.source : (l.source as any)?.id;
          const targetId = typeof l.target === 'string' ? l.target : (l.target as any)?.id;
          const linkId = `${sourceId}-${targetId}`;
          if (highlightedLinks.has(linkId)) {
            return 2;
          }
          return 1;
        }}
        linkLabel={(link: any) => {
          const l = link as GraphEdge;
          return `<div style="padding: 12px; max-width: 400px; background: rgba(0, 0, 0, 0.95); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #3b82f6;">
              ${typeof l.source === 'object' ? (l.source as any).id : l.source} 
              ⟷ 
              ${typeof l.target === 'object' ? (l.target as any).id : l.target}
            </div>
            <div style="font-size: 13px; line-height: 1.5; color: #e5e7eb;">
              ${l.title}
            </div>
            ${l.metadata?.relationship_type ? `
              <div style="margin-top: 8px; padding: 4px 8px; background: rgba(59, 130, 246, 0.2); border-radius: 4px; font-size: 11px; color: #60a5fa;">
                ${l.metadata.relationship_type}
              </div>
            ` : ''}
          </div>`;
        }}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        cooldownTicks={100}
        d3VelocityDecay={0.3}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        backgroundColor="transparent"
      />
    </div>
  );
}

