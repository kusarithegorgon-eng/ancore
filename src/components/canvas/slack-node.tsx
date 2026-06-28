import { useCanvasStore } from "@/lib/canvas-store";
import { Globe } from "lucide-react";
import type { CanvasNode } from "@/lib/canvas-store";

export function SlackNode({ node }: { node: CanvasNode }) {
  const store = useCanvasStore();
  const isSelected = store.selectedNodeId === node.id;
  const data = node.data as { channelName?: string; messageText?: string };

  return (
    <div
      className={`w-[260px] rounded-xl bg-[#121214] border transition-all duration-200 ${
        isSelected ? "border-[rgba(0,229,255,0.4)] shadow-[0_0_30px_rgba(0,229,255,0.15)]" : "border-[rgba(0,229,255,0.18)] shadow-[0_0_20px_rgba(0,229,255,0.08)]"
      }`}
    >
      {/* Connector dot - left */}
      <div
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#00E5FF] z-20"
        style={{ boxShadow: "0 0 8px rgba(0,229,255,0.6)" }}
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full border border-[rgba(0,229,255,0.3)] text-[color:var(--accent)] bg-[rgba(0,229,255,0.08)]">
            Integration
          </span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-[rgba(0,229,255,0.1)] text-[color:var(--accent)]" style={{ boxShadow: "inset 0 0 0 1px rgba(0,229,255,0.2)" }}>
            <Globe className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate">{node.title}</div>
            <div className="text-[11px] text-muted-foreground">Send message</div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Channel</label>
            <input
              type="text"
              value={data.channelName ?? ""}
              onChange={(e) => store.updateNodeData(node.id, { channelName: e.target.value })}
              className="w-full h-7 px-2 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-[color:var(--accent)]/40"
              placeholder="#notifications"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Message</label>
            <textarea
              value={data.messageText ?? ""}
              onChange={(e) => store.updateNodeData(node.id, { messageText: e.target.value })}
              className="w-full h-16 px-2 py-1.5 rounded-md bg-[#0a0a0c] border border-border-subtle text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-[color:var(--accent)]/40 resize-none"
              placeholder="New event: {{event.type}}"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span className="text-[9px] text-muted-foreground">Available tags:</span>
              {["{{event.type}}", "{{user.name}}", "{{timestamp}}"].map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(0,229,255,0.08)] text-[color:var(--accent)] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-muted-foreground">
          <span>0 outputs</span>
          <span className="font-mono">{node.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
