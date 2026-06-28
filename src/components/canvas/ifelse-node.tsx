import { useCanvasStore } from "@/lib/canvas-store";
import { GitBranch } from "lucide-react";

export function IfElseNode({ node }: { node: import("@/lib/canvas-store").CanvasNode }) {
  const store = useCanvasStore();
  const isSelected = store.selectedNodeId === node.id;

  return (
    <div
      className={`w-[260px] rounded-xl bg-[#121214] border transition-all duration-200 ${
        isSelected ? "border-[rgba(181,123,255,0.4)] shadow-[0_0_30px_rgba(181,123,255,0.15)]" : "border-[rgba(181,123,255,0.18)] shadow-[0_0_20px_rgba(181,123,255,0.08)]"
      }`}
    >
      {/* Connector dot - left */}
      <div
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#B57BFF] z-20"
        style={{ boxShadow: "0 0 8px rgba(181,123,255,0.6)" }}
      />
      {/* Connector dot - right (True) */}
      <div
        className="absolute -right-1.5 top-1/3 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#B57BFF] z-20"
        style={{ boxShadow: "0 0 8px rgba(181,123,255,0.6)" }}
      >
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-[#B57BFF] font-semibold whitespace-nowrap">True</span>
      </div>
      {/* Connector dot - bottom (False) */}
      <div
        className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#B57BFF] z-20"
        style={{ boxShadow: "0 0 8px rgba(181,123,255,0.6)" }}
      >
        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] text-[#B57BFF] font-semibold whitespace-nowrap">False</span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full border border-[rgba(181,123,255,0.3)] text-[color:var(--purple)] bg-[rgba(181,123,255,0.08)]">
            Logic
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-[rgba(181,123,255,0.1)] text-[color:var(--purple)]" style={{ boxShadow: "inset 0 0 0 1px rgba(181,123,255,0.2)" }}>
            <GitBranch className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate">{node.title}</div>
            <div className="text-[11px] text-muted-foreground">Conditional branch</div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Property</label>
            <input
              type="text"
              value={node.data.propertyKey ?? ""}
              onChange={(e) => store.updateNodeData(node.id, { propertyKey: e.target.value })}
              className="w-full h-7 px-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-[color:var(--purple)]/40"
              placeholder="data.status"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Compare</label>
              <select
                value={node.data.comparison ?? "equals"}
                onChange={(e) => store.updateNodeData(node.id, { comparison: e.target.value as any })}
                className="w-full h-7 px-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground focus:outline-none focus:border-[color:var(--purple)]/40 appearance-none"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Value</label>
              <input
                type="text"
                value={node.data.comparisonValue ?? ""}
                onChange={(e) => store.updateNodeData(node.id, { comparisonValue: e.target.value })}
                className="w-full h-7 px-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-[color:var(--purple)]/40"
                placeholder="active"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-muted-foreground">
          <span>2 outputs</span>
          <span className="font-mono">{node.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
