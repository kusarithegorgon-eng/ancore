import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useCanvasStore, type CanvasNode, type CanvasEdge, createDefaultNode } from "@/lib/canvas-store";
import { Sparkles, Play, Save, ChevronLeft, PanelLeftClose, PanelLeftOpen, Webhook, GitBranch, ListFilter as Filter, Cpu, Globe, ChevronRight, X, Terminal, Undo2, Redo2 } from "lucide-react";
import { toast } from "sonner";
import { WebhookNode } from "@/components/canvas/webhook-node";
import { IfElseNode } from "@/components/canvas/ifelse-node";
import { TransformerNode } from "@/components/canvas/transformer-node";
import { SlackNode } from "@/components/canvas/slack-node";
import { CanvasEdges } from "@/components/canvas/canvas-edges";
import { ConsoleDrawer } from "@/components/canvas/console-drawer";
import { ExecutionEngine } from "@/lib/execution-engine";

type SidebarNodeItem = {
  icon: typeof Webhook;
  name: string;
  type: "trigger" | "logic" | "transformer" | "action";
  desc: string;
  tone: "teal" | "purple" | "amber";
};

const SIDEBAR_NODES: SidebarNodeItem[] = [
  { icon: Webhook, name: "Webhook", type: "trigger", desc: "HTTP trigger", tone: "teal" },
  { icon: GitBranch, name: "If / Else", type: "logic", desc: "Conditional logic", tone: "purple" },
  { icon: Filter, name: "Transformer", type: "transformer", desc: "Data transform", tone: "amber" },
  { icon: Globe, name: "Send Slack", type: "action", desc: "Message channel", tone: "teal" },
];

const toneColors = {
  teal: "text-[color:var(--accent)] bg-[color:var(--accent)]/10",
  purple: "text-[color:var(--purple)] bg-[color:var(--purple)]/10",
  amber: "text-[color:var(--amber)] bg-[color:var(--amber)]/10",
};

export const Route = createFileRoute("/canvas/$id")({
  component: CanvasPage,
});

function CanvasPage() {
  const { id } = useParams({ from: "/canvas/$id" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [workflowName, setWorkflowName] = useState("Untitled");
  const [saving, setSaving] = useState(false);

  const store = useCanvasStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragNodeId = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
          return;
        }
        if (store.selectedNodeId) {
          store.removeNode(store.selectedNodeId);
          toast.success("Node deleted");
        } else if (store.selectedEdgeId) {
          store.removeEdge(store.selectedEdgeId);
          toast.success("Edge deleted");
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          store.redo();
          toast.success("Redo");
        } else {
          store.undo();
          toast.success("Undo");
        }
      }
      if (e.key === "Escape") {
        store.setSelectedNodeId(null);
        store.setSelectedEdgeId(null);
        store.setConnectingFrom(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store]);

  // Auth guard
  useEffect(() => {
    if (!user) {
      navigate({ to: "/auth" });
    }
  }, [user, navigate]);

  // Load workflow
  useEffect(() => {
    if (!id || !user) return;
    loadWorkflow();
  }, [id, user]);

  async function loadWorkflow() {
    const { data, error } = await supabase
      .from("workflows")
      .select("name, nodes, edges")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      toast.error("Failed to load workflow");
      return;
    }
    if (data) {
      setWorkflowName(data.name);
      store.loadWorkflow(data.nodes as CanvasNode[], data.edges as CanvasEdge[]);
    }
  }

  async function saveWorkflow() {
    setSaving(true);
    const { error } = await supabase
      .from("workflows")
      .update({ name: workflowName, nodes: store.nodes, edges: store.edges, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Failed to save workflow");
    } else {
      toast.success("Workflow saved");
    }
    setSaving(false);
  }

  async function runTest() {
    store.setShowConsole(true);
    store.setExecutionLogs([]);
    store.setIsExecuting(true);
    store.setActiveEdgeIds([]);

    const engine = new ExecutionEngine(store.nodes, store.edges);
    await engine.execute(
      (log) => {
        store.addExecutionLog(log);
      },
      (activeEdgeIds) => {
        store.setActiveEdgeIds(activeEdgeIds);
      }
    );

    store.setIsExecuting(false);
    store.setActiveEdgeIds([]);
    toast.success("Execution complete — check console");
  }

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest("[data-node-id]");
    if (nodeEl) {
      const nodeId = nodeEl.getAttribute("data-node-id");
      if (nodeId) {
        isDragging.current = true;
        dragNodeId.current = nodeId;
        dragStart.current = { x: e.clientX, y: e.clientY };
        store.setIsDraggingNode(true);
        store.setSelectedNodeId(nodeId);
      }
    } else if (!target.closest("[data-sidebar]")) {
      // Pan start
      isDragging.current = true;
      store.setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [store]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    if (dragNodeId.current) {
      const node = store.nodes.find((n) => n.id === dragNodeId.current)!;
      store.updateNodePosition(dragNodeId.current, {
        x: node.position.x + dx / store.viewport.zoom,
        y: node.position.y + dy / store.viewport.zoom,
      });
    } else if (store.isPanning) {
      store.panViewport(dx / store.viewport.zoom, dy / store.viewport.zoom);
    }

    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [store]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragNodeId.current = null;
    store.setIsDraggingNode(false);
    store.setIsPanning(false);
  }, [store]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      store.setZoom(store.viewport.zoom + delta);
    }
  }, [store]);

  const addNode = (type: "trigger" | "logic" | "transformer" | "action") => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? rect.width / 2 : 400;
    const cy = rect ? rect.height / 2 : 300;
    const node = createDefaultNode(type, (cx - store.viewport.x) / store.viewport.zoom - 130, (cy - store.viewport.y) / store.viewport.zoom - 90);
    store.addNode(node);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden select-none">
      {/* Top Nav */}
      <header className="glass-nav h-14 shrink-0 flex items-center px-4 relative z-30">
        <div className="flex items-center gap-3 w-[240px]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <img src="/images/Gemini_Generated_Image_mggxphmggxphmggx.png" alt="Ancrest" className="h-5 w-5 rounded-sm object-cover" />
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-sm font-semibold text-foreground text-center focus:outline-none focus:border-b focus:border-[color:var(--accent)]/40 min-w-[100px] max-w-[240px]"
            style={{ fontFamily: "var(--font-display)" }}
          />
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium px-2 py-0.5 rounded-full border border-[color:var(--accent)]/30 text-[color:var(--accent)] bg-[color:var(--accent)]/5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Draft
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-[240px] justify-end">
          <button
            onClick={store.undo}
            disabled={store.historyIndex <= 0}
            className="neumorphic neumorphic-press h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-medium text-foreground/85 border border-white/[0.04] disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={store.redo}
            disabled={store.historyIndex >= store.history.length - 1}
            className="neumorphic neumorphic-press h-8 w-8 rounded-lg flex items-center justify-center text-[12px] font-medium text-foreground/85 border border-white/[0.04] disabled:opacity-30"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={runTest}
            disabled={store.isExecuting}
            className="neumorphic neumorphic-press inline-flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-medium text-foreground/85 border border-white/[0.04] disabled:opacity-50"
          >
            <Play className="h-3 w-3" />
            {store.isExecuting ? "Running..." : "Run Test"}
          </button>
          <button
            onClick={saveWorkflow}
            disabled={saving}
            className="cta-cyan cta-cyan-hover inline-flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold disabled:opacity-50"
          >
            <Save className="h-3 w-3" strokeWidth={2.5} />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => store.setShowConsole(!store.showConsole)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center text-[12px] border border-white/[0.04] transition-colors ${store.showConsole ? "text-[color:var(--accent)] bg-[color:var(--accent)]/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Terminal className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside data-sidebar className="w-[240px] shrink-0 bg-[#121214] border-r border-border-subtle flex flex-col z-20">
            <div className="p-3 border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">Nodes</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {SIDEBAR_NODES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => addNode(item.type)}
                    className="group w-full flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-[#1a1a1e]/60 transition-all duration-200 text-left"
                  >
                    <span className={`h-8 w-8 shrink-0 rounded-md flex items-center justify-center ${toneColors[item.tone]}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-medium text-foreground/95 truncate">{item.name}</span>
                      <span className="block text-[11px] text-muted-foreground truncate">{item.desc}</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
            <div className="p-3 border-t border-border-subtle">
              <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                {store.nodes.length} nodes · {store.edges.length} edges
              </div>
            </div>
          </aside>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.zoom})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Grid */}
            <div
              className="absolute inset-0"
              style={{
                width: 10000,
                height: 10000,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                width: 10000,
                height: 10000,
                background: "radial-gradient(1200px 900px at 50% 50%, rgba(0,229,255,0.03), transparent 60%)",
              }}
            />

            {/* SVG Edges */}
            <CanvasEdges />

            {/* Nodes */}
            {store.nodes.map((node) => (
              <div
                key={node.id}
                data-node-id={node.id}
                className="absolute"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: node.width,
                  zIndex: store.selectedNodeId === node.id ? 10 : 2,
                }}
              >
                <NodeRenderer node={node} />
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
            <button onClick={() => store.setZoom(store.viewport.zoom - 0.1)} className="neumorphic h-8 w-8 rounded-lg flex items-center justify-center text-[11px] text-foreground/80 border border-white/[0.04]">-</button>
            <span className="neumorphic h-8 min-w-[48px] px-2 rounded-lg flex items-center justify-center text-[11px] text-foreground/80 border border-white/[0.04]">{Math.round(store.viewport.zoom * 100)}%</span>
            <button onClick={() => store.setZoom(store.viewport.zoom + 0.1)} className="neumorphic h-8 w-8 rounded-lg flex items-center justify-center text-[11px] text-foreground/80 border border-white/[0.04]">+</button>
          </div>
        </div>
      </div>

      {/* Console Drawer */}
      <ConsoleDrawer />
    </div>
  );
}

function NodeRenderer({ node }: { node: CanvasNode }) {
  switch (node.type) {
    case "trigger":
      return <WebhookNode node={node} />;
    case "logic":
      return <IfElseNode node={node} />;
    case "transformer":
      return <TransformerNode node={node} />;
    case "action":
      return <SlackNode node={node} />;
    default:
      return null;
  }
}

// Simple Link component for within the canvas
function Link({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate({ to })} className={className}>
      {children}
    </button>
  );
}
