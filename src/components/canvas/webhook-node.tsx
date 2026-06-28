import { useCanvasStore } from "@/lib/canvas-store";
import { Webhook, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CanvasNode } from "@/lib/canvas-store";

export function WebhookNode({ node }: { node: CanvasNode }) {
  const store = useCanvasStore();
  const isSelected = store.selectedNodeId === node.id;
  const data = node.data as { webhookUrl?: string; method?: string };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.webhookUrl ?? "");
    toast.success("Webhook URL copied");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.removeNode(node.id);
    toast.success("Node removed");
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (store.connectingFrom) {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: store.connectingFrom.nodeId,
        target: node.id,
        sourceHandle: store.connectingFrom.handleId,
        targetHandle: "in",
      };
      const ok = store.addEdge(newEdge);
      if (ok) {
        store.setConnectingFrom(null);
        toast.success("Connected");
      } else {
        const validation = store.validateEdge(newEdge);
        toast.error(validation.error || "Invalid connection");
      }
    }
  };

  return (
    <div
      className={`w-[260px] rounded-xl bg-[#121214] border transition-all duration-200 ${
        isSelected ? "border-[rgba(0,229,255,0.4)] shadow-[0_0_30px_rgba(0,229,255,0.15)]" : "border-[rgba(0,229,255,0.18)] shadow-[0_0_20px_rgba(0,229,255,0.08)]"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (store.connectingFrom) {
            store.setConnectingFrom(null);
          } else {
            store.setConnectingFrom({ nodeId: node.id, handleId: "out" });
          }
        }}
        className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#00E5FF] z-20 cursor-pointer hover:scale-125 transition-transform"
        style={{ boxShadow: "0 0 8px rgba(0,229,255,0.6)" }}
      />
      <button
        onClick={handleConnect}
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#121214] border-2 border-[#00E5FF] z-20 cursor-pointer hover:scale-125 transition-transform opacity-0 pointer-events-none"
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full border border-[rgba(0,229,255,0.3)] text-[color:var(--accent)] bg-[rgba(0,229,255,0.08)]">
            Webhook
          </span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <button onClick={handleDelete} className="text-muted-foreground hover:text-red-400 transition-colors ml-1">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-[rgba(0,229,255,0.1)] text-[color:var(--accent)]" style={{ boxShadow: "inset 0 0 0 1px rgba(0,229,255,0.2)" }}>
            <Webhook className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate">{node.title}</div>
            <div className="text-[11px] text-muted-foreground">HTTP POST trigger</div>
          </div>
        </div>

        <div className="rounded-lg bg-[#0a0a0c] border border-border-subtle p-2.5 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">URL</span>
            <button onClick={handleCopy} className="ml-auto text-muted-foreground hover:text-[color:var(--accent)] transition-colors">
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <div className="text-[10px] font-mono text-[color:var(--accent)]/80 break-all">
            {data.webhookUrl ?? "https://api.ancrest.dev/webhook/..."}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] text-muted-foreground">
          <span>1 output</span>
          <span className="font-mono">{node.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
