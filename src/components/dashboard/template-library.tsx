import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  X, Zap, Sparkles, Bot, Mail, Webhook, GitBranch, ListFilter as Filter, Globe,
  ArrowRight, Star
} from "lucide-react";
import { toast } from "sonner";
import type { CanvasNode, CanvasEdge } from "@/lib/canvas-store";

type Blueprint = {
  id: string;
  name: string;
  description: string;
  icon: typeof Zap;
  iconBg: string;
  borderColor: string;
  textColor: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};

const BLUEPRINTS: Blueprint[] = [
  {
    id: "stripe-slack",
    name: "Stripe to Slack Alert",
    description: "Webhook trigger → Filter logic → Slack notification",
    icon: Zap,
    iconBg: "bg-[rgba(0,229,255,0.1)]",
    borderColor: "border-[rgba(0,229,255,0.2)]",
    textColor: "text-[color:var(--accent)]",
    nodes: [
      {
        id: "node-trigger",
        type: "trigger",
        position: { x: 100, y: 200 },
        width: 260,
        height: 180,
        title: "Stripe Webhook",
        data: { webhookUrl: "https://api.ancrest.dev/webhook/stripe-event", method: "POST" },
        inputs: [],
        outputs: [{ id: "out", position: "right" }],
      },
      {
        id: "node-logic",
        type: "logic",
        position: { x: 500, y: 200 },
        width: 260,
        height: 220,
        title: "Filter Charge",
        data: { propertyKey: "event.type", comparison: "contains", comparisonValue: "charge" },
        inputs: [{ id: "in", position: "left" }],
        outputs: [
          { id: "true", position: "right", label: "True" },
          { id: "false", position: "bottom", label: "False" },
        ],
      },
      {
        id: "node-action",
        type: "action",
        position: { x: 900, y: 200 },
        width: 260,
        height: 220,
        title: "Notify Slack",
        data: { channelName: "#payments", messageText: "{{event.type}} — {{event.data.amount}} from {{event.data.customer}}" },
        inputs: [{ id: "in", position: "left" }],
        outputs: [],
      },
    ],
    edges: [
      { id: "edge-1", source: "node-trigger", target: "node-logic", sourceHandle: "out", targetHandle: "in" },
      { id: "edge-2", source: "node-logic", target: "node-action", sourceHandle: "true", targetHandle: "in" },
    ],
  },
  {
    id: "user-onboarding",
    name: "User Onboarding Welcome",
    description: "API listener → Transform → Email notification",
    icon: Mail,
    iconBg: "bg-[rgba(181,123,255,0.1)]",
    borderColor: "border-[rgba(181,123,255,0.2)]",
    textColor: "text-[color:var(--purple)]",
    nodes: [
      {
        id: "node-trigger",
        type: "trigger",
        position: { x: 100, y: 200 },
        width: 260,
        height: 180,
        title: "User Signup",
        data: { webhookUrl: "https://api.ancrest.dev/webhook/user-signup", method: "POST" },
        inputs: [],
        outputs: [{ id: "out", position: "right" }],
      },
      {
        id: "node-transform",
        type: "transformer",
        position: { x: 500, y: 200 },
        width: 260,
        height: 180,
        title: "Format User",
        data: { transformFunction: "uppercase" },
        inputs: [{ id: "in", position: "left" }],
        outputs: [{ id: "out", position: "right" }],
      },
      {
        id: "node-action",
        type: "action",
        position: { x: 900, y: 200 },
        width: 260,
        height: 220,
        title: "Send Welcome",
        data: { channelName: "#welcome", messageText: "Welcome {{user.name}}! Your account is ready." },
        inputs: [{ id: "in", position: "left" }],
        outputs: [],
      },
    ],
    edges: [
      { id: "edge-1", source: "node-trigger", target: "node-transform", sourceHandle: "out", targetHandle: "in" },
      { id: "edge-2", source: "node-transform", target: "node-action", sourceHandle: "out", targetHandle: "in" },
    ],
  },
  {
    id: "ai-text-pipeline",
    name: "AI Text Formatter",
    description: "Webhook → LLM prompt → Response output",
    icon: Bot,
    iconBg: "bg-[rgba(255,181,71,0.1)]",
    borderColor: "border-[rgba(255,181,71,0.2)]",
    textColor: "text-[color:var(--amber)]",
    nodes: [
      {
        id: "node-trigger",
        type: "trigger",
        position: { x: 100, y: 200 },
        width: 260,
        height: 180,
        title: "Text Input",
        data: { webhookUrl: "https://api.ancrest.dev/webhook/ai-format", method: "POST" },
        inputs: [],
        outputs: [{ id: "out", position: "right" }],
      },
      {
        id: "node-transform",
        type: "transformer",
        position: { x: 500, y: 200 },
        width: 260,
        height: 180,
        title: "LLM Prompt",
        data: { transformFunction: "parseJson" },
        inputs: [{ id: "in", position: "left" }],
        outputs: [{ id: "out", position: "right" }],
      },
      {
        id: "node-action",
        type: "action",
        position: { x: 900, y: 200 },
        width: 260,
        height: 220,
        title: "Return Response",
        data: { channelName: "#output", messageText: "{{response.text}}" },
        inputs: [{ id: "in", position: "left" }],
        outputs: [],
      },
    ],
    edges: [
      { id: "edge-1", source: "node-trigger", target: "node-transform", sourceHandle: "out", targetHandle: "in" },
      { id: "edge-2", source: "node-transform", target: "node-action", sourceHandle: "out", targetHandle: "in" },
    ],
  },
];

export function TemplateLibrary({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const navigate = useNavigate();
  const [creating, setCreating] = useState<string | null>(null);

  if (!open) return null;

  async function createFromBlueprint(blueprint: Blueprint) {
    setCreating(blueprint.id);
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        name: blueprint.name,
        description: blueprint.description,
        nodes: blueprint.nodes as any,
        edges: blueprint.edges as any,
      })
      .select("id")
      .single();
    if (error) {
      toast.error("Failed to create workflow from template");
      setCreating(null);
      return;
    }
    toast.success(`Created "${blueprint.name}" from template`);
    onCreated();
    onClose();
    navigate({ to: "/canvas/$id", params: { id: data.id } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl border border-border-subtle bg-[#121214] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ boxShadow: "0 0 80px rgba(0,229,255,0.08)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#0a0a0c] border border-border-subtle flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Template Library</h2>
              <p className="text-[10px] text-muted-foreground">Start with a pre-built blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Blueprints */}
        <div className="p-6 space-y-3">
          {BLUEPRINTS.map((bp) => {
            const Icon = bp.icon;
            const isLoading = creating === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => createFromBlueprint(bp)}
                disabled={isLoading}
                className={`group w-full flex items-center gap-4 p-4 rounded-xl border ${bp.borderColor} bg-[#0a0a0c] hover:bg-[#0f0f11] transition-all duration-200 text-left disabled:opacity-50`}
              >
                <span className={`h-12 w-12 shrink-0 rounded-xl ${bp.iconBg} flex items-center justify-center ${bp.textColor}`} style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)" }}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-foreground">{bp.name}</span>
                    <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground">
                      <Star className="h-2.5 w-2.5" />
                      {bp.nodes.length} nodes
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{bp.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {bp.nodes.map((n, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[9px] text-muted-foreground bg-[#121214] border border-border-subtle px-1.5 py-0.5 rounded">
                        {n.type === "trigger" && <Webhook className="h-2.5 w-2.5" />}
                        {n.type === "logic" && <GitBranch className="h-2.5 w-2.5" />}
                        {n.type === "transformer" && <Filter className="h-2.5 w-2.5" />}
                        {n.type === "action" && <Globe className="h-2.5 w-2.5" />}
                        {n.title}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <span className="cta-cyan cta-cyan-hover h-8 px-4 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1.5">
                    {isLoading ? (
                      <span className="h-3 w-3 border-2 border-[#07181c]/40 border-t-[#07181c] rounded-full animate-spin" />
                    ) : (
                      <>
                        Start
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 h-10 border-t border-border-subtle flex items-center justify-center text-[10px] text-muted-foreground">
          Templates are fully editable — customize after creation
        </div>
      </div>
    </div>
  );
}
