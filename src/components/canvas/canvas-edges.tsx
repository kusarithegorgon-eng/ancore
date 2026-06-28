import { useCanvasStore } from "@/lib/canvas-store";
import type { CanvasNode } from "@/lib/canvas-store";
import { X } from "lucide-react";
import { toast } from "sonner";

function getHandlePosition(node: CanvasNode, handleId: string, isSource: boolean): { x: number; y: number } {
  const handle = isSource
    ? node.outputs.find((h) => h.id === handleId)
    : node.inputs.find((h) => h.id === handleId);
  if (!handle) {
    return {
      x: isSource ? node.position.x + node.width : node.position.x,
      y: node.position.y + node.height / 2,
    };
  }
  switch (handle.position) {
    case "left":
      return { x: node.position.x, y: node.position.y + node.height / 2 };
    case "right":
      return { x: node.position.x + node.width, y: node.position.y + node.height / 2 };
    case "top":
      return { x: node.position.x + node.width / 2, y: node.position.y };
    case "bottom":
      return { x: node.position.x + node.width / 2, y: node.position.y + node.height };
    default:
      return { x: isSource ? node.position.x + node.width : node.position.x, y: node.position.y + node.height / 2 };
  }
}

function computeBezierPath(
  x1: number, y1: number, x2: number, y2: number,
  sourcePos: string, targetPos: string
): { d: string; midX: number; midY: number } {
  const dx = Math.abs(x2 - x1);
  const controlOffset = Math.max(dx * 0.5, 50);
  const sx = sourcePos === "right" ? x1 + controlOffset : sourcePos === "left" ? x1 - controlOffset : x1;
  const sy = sourcePos === "bottom" ? y1 + controlOffset : sourcePos === "top" ? y1 - controlOffset : y1;
  const tx = targetPos === "right" ? x2 + controlOffset : targetPos === "left" ? x2 - controlOffset : x2;
  const ty = targetPos === "bottom" ? y2 + controlOffset : targetPos === "top" ? y2 - controlOffset : y2;
  const d = `M ${x1} ${y1} C ${sx} ${sy}, ${tx} ${ty}, ${x2} ${y2}`;
  // Approximate midpoint using cubic Bezier at t=0.5
  const mt = 0.5;
  const midX = (1 - mt) * (1 - mt) * (1 - mt) * x1 +
    3 * (1 - mt) * (1 - mt) * mt * sx +
    3 * (1 - mt) * mt * mt * tx +
    mt * mt * mt * x2;
  const midY = (1 - mt) * (1 - mt) * (1 - mt) * y1 +
    3 * (1 - mt) * (1 - mt) * mt * sy +
    3 * (1 - mt) * mt * mt * ty +
    mt * mt * mt * y2;
  return { d, midX, midY };
}

export function CanvasEdges() {
  const { nodes, edges, activeEdgeIds, selectedEdgeId, setSelectedEdgeId, removeEdge } = useCanvasStore();

  const edgeColor = (edgeId: string) => {
    if (activeEdgeIds.includes(edgeId)) return "#00E5FF";
    if (selectedEdgeId === edgeId) return "#00E5FF";
    return "#3a3a42";
  };

  const edgeWidth = (edgeId: string) => {
    if (activeEdgeIds.includes(edgeId)) return 2.5;
    if (selectedEdgeId === edgeId) return 2.5;
    return 1.5;
  };

  const edgeOpacity = (edgeId: string) => {
    if (activeEdgeIds.includes(edgeId)) return 1;
    if (selectedEdgeId === edgeId) return 0.9;
    return 0.6;
  };

  const handleEdgeClick = (e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation();
    setSelectedEdgeId(edgeId);
  };

  const handleEdgeDelete = (e: React.MouseEvent, edgeId: string) => {
    e.stopPropagation();
    removeEdge(edgeId);
    toast.success("Edge removed");
  };

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1, width: 10000, height: 10000 }}>
      <defs>
        <filter id="edgeGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="edgeGlowActive">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#B57BFF" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="gradAmber" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B57BFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {edges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        const sourceHandle = sourceNode.outputs.find((h) => h.id === edge.sourceHandle);
        const targetHandle = targetNode.inputs.find((h) => h.id === edge.targetHandle);
        const sourcePos = getHandlePosition(sourceNode, edge.sourceHandle ?? "out", true);
        const targetPos = getHandlePosition(targetNode, edge.targetHandle ?? "in", false);
        const { d, midX, midY } = computeBezierPath(
          sourcePos.x, sourcePos.y, targetPos.x, targetPos.y,
          sourceHandle?.position ?? "right", targetHandle?.position ?? "left"
        );
        const isActive = activeEdgeIds.includes(edge.id);
        const isSelected = selectedEdgeId === edge.id;

        return (
          <g key={edge.id}>
            {/* Invisible wide path for easier clicking */}
            <path
              d={d}
              stroke="transparent"
              strokeWidth={10}
              fill="none"
              className="cursor-pointer"
              onClick={(e) => handleEdgeClick(e, edge.id)}
            />
            {isActive && (
              <>
                <path d={d} stroke="#00E5FF" strokeWidth={edgeWidth(edge.id) + 4} fill="none" opacity={0.3} filter="url(#edgeGlowActive)" />
                <path d={d} stroke="url(#gradTeal)" strokeWidth={edgeWidth(edge.id)} fill="none" opacity={0.9} filter="url(#edgeGlowActive)" strokeDasharray="8 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="24" dur="0.6s" repeatCount="indefinite" />
                </path>
              </>
            )}
            <path
              d={d}
              stroke={edgeColor(edge.id)}
              strokeWidth={edgeWidth(edge.id)}
              fill="none"
              opacity={edgeOpacity(edge.id)}
              filter={isActive ? "url(#edgeGlowActive)" : "url(#edgeGlow)"}
              className="cursor-pointer"
              onClick={(e) => handleEdgeClick(e, edge.id)}
            />
            {/* Delete button at midpoint */}
            {isSelected && (
              <g>
                <circle
                  cx={midX}
                  cy={midY}
                  r={10}
                  fill="#121214"
                  stroke="#00E5FF"
                  strokeWidth={1.5}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => handleEdgeDelete(e, edge.id)}
                  style={{ filter: "drop-shadow(0 0 6px rgba(0,229,255,0.5))" }}
                />
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#00E5FF"
                  fontSize="10"
                  fontWeight="bold"
                  className="cursor-pointer pointer-events-none"
                >
                  ×
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
