import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Sparkles, Plus, ArrowRight, Clock, Trash2, Play, MoveHorizontal as MoreHorizontal, LayoutGrid, Layers, Zap, GitBranch, ListFilter as Filter, Globe, Database, Cpu } from "lucide-react";
import { toast } from "sonner";
import type { CanvasNode, CanvasEdge } from "@/lib/canvas-store";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  created_at: string;
  updated_at: string;
};

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw new Error("Unauthorized");
    }
  },
  errorComponent: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/auth" });
    }, [navigate]);
    return null;
  },
});

function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadWorkflows();
  }, [user]);

  async function loadWorkflows() {
    setLoading(true);
    const { data, error } = await supabase
      .from("workflows")
      .select("id, name, description, nodes, edges, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error("Failed to load workflows");
    } else {
      setWorkflows(data ?? []);
    }
    setLoading(false);
  }

  async function createWorkflow() {
    const { data, error } = await supabase
      .from("workflows")
      .insert({ name: "Untitled Workflow", description: "", nodes: [], edges: [] })
      .select("id")
      .single();
    if (error) {
      toast.error("Failed to create workflow");
      return;
    }
    navigate({ to: "/canvas/$id", params: { id: data.id } });
  }

  async function deleteWorkflow(id: string) {
    const { error } = await supabase.from("workflows").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete workflow");
      return;
    }
    setWorkflows(workflows.filter((w) => w.id !== id));
    toast.success("Workflow deleted");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardHeader user={user} onSignOut={signOut} />
      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Workflows</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage and edit your automation pipelines</p>
            </div>
            <button
              onClick={createWorkflow}
              className="cta-cyan cta-cyan-hover h-10 px-5 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Workflow
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-xl border border-border-subtle bg-[#121214]/50 animate-pulse" />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="rounded-xl border border-border-subtle bg-[#121214]/40 p-12 text-center">
              <div className="h-14 w-14 rounded-xl bg-[#0a0a0c] border border-border-subtle flex items-center justify-center mx-auto mb-4">
                <LayoutGrid className="h-6 w-6 text-[color:var(--accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No workflows yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first workflow to start building API automations.
              </p>
              <button
                onClick={createWorkflow}
                className="cta-cyan cta-cyan-hover h-10 px-6 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Workflow
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((w) => (
                <WorkflowCard key={w.id} workflow={w} onDelete={deleteWorkflow} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardHeader({ user, onSignOut }: { user: { email: string } | null; onSignOut: () => Promise<void> }) {
  return (
    <header className="glass-nav h-16 flex items-center justify-between px-6 lg:px-12 relative z-20">
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-md flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#00E5FF,#0088aa)", boxShadow: "0 0 14px rgba(0,229,255,0.5)" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#07181c]" strokeWidth={2.5} />
        </div>
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
          Ancore
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
        <button
          onClick={onSignOut}
          className="neumorphic neumorphic-press h-8 px-3 rounded-lg text-xs font-medium text-foreground/80 border border-white/[0.04]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

function WorkflowCard({ workflow, onDelete }: { workflow: Workflow; onDelete: (id: string) => void }) {
  const nodeCount = workflow.nodes?.length ?? 0;
  const edgeCount = workflow.edges?.length ?? 0;
  const updated = new Date(workflow.updated_at).toLocaleDateString();

  return (
    <div className="group relative rounded-xl border border-border-subtle bg-[#121214]/60 hover:bg-[#121214]/90 hover:border-[color:var(--accent)]/20 transition-all duration-300 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#0a0a0c] border border-border-subtle flex items-center justify-center">
            <Layers className="h-4 w-4 text-[color:var(--accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{workflow.name}</h3>
            <p className="text-[10px] text-muted-foreground">{updated}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(workflow.id)}
          className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
        {workflow.description || "No description"}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Cpu className="h-3 w-3" /> {nodeCount} nodes
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <GitBranch className="h-3 w-3" /> {edgeCount} connections
        </span>
      </div>

      <Link
        to="/canvas/$id"
        params={{ id: workflow.id }}
        className="w-full cta-cyan cta-cyan-hover h-8 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5"
      >
        <Play className="h-3 w-3" />
        Open Editor
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
