import { useCanvasStore } from "@/lib/canvas-store";
import { ListFilter as Filter } from "lucide-react";

export function TransformerNode({ node }: { node: import("@/lib/canvas-store").CanvasNode }) {
  const store = useCanvasStore();
  const isSelected = store.selectedNodeId === node.id;

  return (
    <div
      className={`w-[260px] rounded-xl bg-[#121214] border transition-all duration-200 ${
        isSelected ? "border-[rgba(255,181,71,0.4)] shadow-[0_0_30px_rgba(255,181,71,0.15)]" : "border-[rgba(255,181,71,0.18)] shadow-[0_0_20px_rgba(255,181,71,0.08)]"
      }`}
    >
      {/* Connector dot - left */}
      <div
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#FFB547] z-20"
        style={{ boxShadow: "0 0 8px rgba(255,181,71,0.6)" }}
      />
      {/* Connector dot - right */}
      <div
        className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#FFB547] z-20"
        style={{ boxShadow: "0 0 8px rgba(255,181,71,0.6)" }}
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full border border-[rgba(255,181,71,0.3)] text-[color:var(--amber)] bg-[rgba(255,181,71,0.08)]">
            Transform
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-[rgba(255,181,71,0.1)] text-[color:var(--amber)]" style={{ boxShadow: "inset 0 0 0 1px rgba(255,181,71,0.2)" }}>
            <Filter className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate">{node.title}</div>
            <div className="text-[11px] text-muted-foreground">Data transformation</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Function</label>
          <select
            value={node.data.transformFunction ?? "uppercase"}
            onChange={(e) => store.updateNodeData(node.id, { transformFunction: e.target.value as any })}
            className="w-full h-8 px-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground focus:outline-none focus:border-[color:var(--amber)]/40 appearance-none"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="uppercase">Convert to Uppercase</option>
            <option value="lowercase">Convert to Lowercase</option>
            <option value="formatDate">Format Timestamp</option>
            <option value="parseJson">Parse JSON</option>
          </select>
        </div>

        <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-muted-foreground">
          <span>1 output</span>
          <span className="font-mono">{node.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
