import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Play, Save, Zap, Globe, GitBranch, Database, Code2,
  Filter, Mail, Webhook, Clock, Cpu, Sparkles, ChevronRight,
  Circle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ancore — Workflow Studio" },
      { name: "description", content: "Build, test and ship API workflows visually." },
    ],
  }),
  component: AncoreStudio,
});

type NodeCategory = {
  label: string;
  items: { icon: typeof Zap; name: string; desc: string; tone: "teal" | "purple" | "amber" }[];
};

const CATEGORIES: NodeCategory[] = [
  {
    label: "Triggers",
    items: [
      { icon: Webhook, name: "Webhook", desc: "HTTP entrypoint", tone: "teal" },
      { icon: Clock, name: "Schedule", desc: "Cron-based trigger", tone: "teal" },
      { icon: Mail, name: "Email Inbound", desc: "Parse incoming mail", tone: "teal" },
    ],
  },
  {
    label: "Actions",
    items: [
      { icon: Globe, name: "REST API", desc: "HTTP request", tone: "amber" },
      { icon: Database, name: "Postgres", desc: "Run SQL query", tone: "amber" },
      { icon: Code2, name: "Function", desc: "Custom JS code", tone: "amber" },
    ],
  },
  {
    label: "Logic",
    items: [
      { icon: GitBranch, name: "Branch", desc: "Conditional split", tone: "purple" },
      { icon: Filter, name: "Filter", desc: "Drop on predicate", tone: "purple" },
      { icon: Cpu, name: "Transform", desc: "Map & reshape", tone: "purple" },
    ],
  },
];

function AncoreStudio() {
  const [query, setQuery] = useState("");

  const filtered = CATEGORIES.map((c) => ({
    ...c,
    items: c.items.filter((i) =>
      (i.name + i.desc).toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((c) => c.items.length);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopNav />
      <div className="flex-1 flex min-h-0">
        <Sidebar query={query} setQuery={setQuery} categories={filtered} />
        <Workspace />
      </div>
    </div>
  );
}

/* ---------------- Top Nav ---------------- */

function TopNav() {
  return (
    <header className="glass-nav h-16 shrink-0 flex items-center px-5 relative z-20">
      <div className="flex items-center gap-2 w-[280px]">
        <div className="h-7 w-7 rounded-md flex items-center justify-center"
             style={{ background: "linear-gradient(135deg,#00E5FF,#0088aa)", boxShadow: "0 0 18px rgba(0,229,255,0.55)" }}>
          <Sparkles className="h-3.5 w-3.5 text-[#07181c]" strokeWidth={2.5} />
        </div>
        <span className="font-display text-xl font-bold tracking-tight logo-glow">
          Ancore
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center gap-3">
        <h1 className="font-display text-[15px] font-semibold tracking-tight text-foreground/90">
          Stripe → Slack Notifier
        </h1>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium
                         px-2 py-0.5 rounded-full border border-[color:var(--accent)]/30
                         text-[color:var(--accent)] bg-[color:var(--accent)]/5">
          <Circle className="h-1.5 w-1.5 fill-current" />
          Draft
        </span>
      </div>

      <div className="flex items-center gap-2.5 w-[280px] justify-end">
        <button className="neumorphic neumorphic-press inline-flex items-center gap-2
                           h-9 px-4 rounded-lg text-[13px] font-medium text-foreground/85
                           hover:text-foreground border border-white/[0.04]">
          <Play className="h-3.5 w-3.5" />
          Run Test
        </button>
        <button className="cta-cyan cta-cyan-hover inline-flex items-center gap-2
                           h-9 px-4 rounded-lg text-[13px] font-semibold">
          <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
          Save Workflow
        </button>
      </div>
    </header>
  );
}

/* ---------------- Sidebar ---------------- */

function Sidebar({
  query, setQuery, categories,
}: { query: string; setQuery: (s: string) => void; categories: NodeCategory[] }) {
  return (
    <aside className="w-[280px] shrink-0 bg-surface border-r border-border-subtle flex flex-col">
      <div className="p-4 border-b border-border-subtle">
        <label className="relative block">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes…"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0f0f11] border border-border-subtle
                       text-[13px] placeholder:text-muted-foreground/70
                       focus:outline-none focus:border-[color:var(--accent)]/40
                       focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {categories.map((cat) => (
          <div key={cat.label}>
            <div className="px-2 mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                {cat.label}
              </span>
              <span className="text-[10px] text-muted-foreground/60">{cat.items.length}</span>
            </div>
            <div className="space-y-1.5">
              {cat.items.map((it) => (
                <NodeListItem key={it.name} {...it} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-center gap-2 px-2 py-2 text-[11px] text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
          Connected · v2.4.1
        </div>
      </div>
    </aside>
  );
}

function NodeListItem({
  icon: Icon, name, desc, tone,
}: { icon: typeof Zap; name: string; desc: string; tone: "teal" | "purple" | "amber" }) {
  const tones = {
    teal: "text-[color:var(--accent)] bg-[color:var(--accent)]/10",
    purple: "text-[color:var(--purple)] bg-[color:var(--purple)]/10",
    amber: "text-[color:var(--amber)] bg-[color:var(--amber)]/10",
  };
  return (
    <button
      className="group w-full flex items-center gap-3 p-2.5 rounded-lg
                 border border-transparent hover:border-border-subtle
                 hover:bg-[#1a1a1e]/60 transition-all duration-300 text-left"
    >
      <span className={`h-8 w-8 shrink-0 rounded-md flex items-center justify-center ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-medium text-foreground/95 truncate">{name}</span>
        <span className="block text-[11px] text-muted-foreground truncate">{desc}</span>
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
    </button>
  );
}

/* ---------------- Workspace ---------------- */

type CanvasNode = {
  id: string;
  x: number; y: number;
  badge: string;
  title: string;
  subtitle: string;
  icon: typeof Zap;
  tone: "teal" | "purple" | "amber";
};

const NODES: CanvasNode[] = [
  { id: "n1", x: 80,  y: 120, badge: "WEBHOOK",  title: "Stripe Event",     subtitle: "POST /v1/events",       icon: Webhook, tone: "teal" },
  { id: "n2", x: 430, y: 80,  badge: "LOGIC",    title: "Filter Charges",   subtitle: "event.type == charge.*", icon: Filter,  tone: "purple" },
  { id: "n3", x: 780, y: 220, badge: "REST API", title: "Notify Slack",     subtitle: "POST hooks.slack.com",   icon: Globe,   tone: "amber" },
];

function Workspace() {
  return (
    <main className="flex-1 relative bg-[#0d0d0f] overflow-hidden">
      {/* dot grid */}
      <div className="absolute inset-0 dot-grid" />
      {/* radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(900px 600px at 50% 40%, rgba(0,229,255,0.05), transparent 60%), radial-gradient(700px 500px at 80% 80%, rgba(181,123,255,0.05), transparent 60%)",
        }}
      />

      {/* SVG connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="wire1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B57BFF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="wire2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B57BFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFB547" stopOpacity="0.9" />
          </linearGradient>
          <filter id="wireGlow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* n1 -> n2 */}
        <path
          d="M 350 175 C 410 175, 410 135, 470 135"
          stroke="url(#wire1)" strokeWidth="1.75" fill="none" filter="url(#wireGlow)"
        />
        {/* n2 -> n3 */}
        <path
          d="M 700 135 C 760 135, 760 275, 820 275"
          stroke="url(#wire2)" strokeWidth="1.75" fill="none" filter="url(#wireGlow)"
        />
      </svg>

      {NODES.map((n) => (
        <NodeCard key={n.id} node={n} />
      ))}

      {/* canvas chrome */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
        <div className="neumorphic rounded-lg px-3 h-9 flex items-center gap-3 text-[11px] text-muted-foreground border border-white/[0.04]">
          <span><span className="text-foreground/80 font-medium">3</span> nodes</span>
          <span className="h-3 w-px bg-border-subtle" />
          <span><span className="text-foreground/80 font-medium">2</span> connections</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
        {["−", "100%", "+"].map((t, i) => (
          <button key={i}
            className="neumorphic neumorphic-press h-9 min-w-[36px] px-3 rounded-lg text-[12px]
                       font-medium text-foreground/80 border border-white/[0.04]">
            {t}
          </button>
        ))}
      </div>
    </main>
  );
}

function NodeCard({ node }: { node: CanvasNode }) {
  const Icon = node.icon;
  const glow = {
    teal: "node-glow-teal",
    purple: "node-glow-purple",
    amber: "node-glow-amber",
  }[node.tone];
  const accent = {
    teal: "var(--accent)",
    purple: "var(--purple)",
    amber: "var(--amber)",
  }[node.tone];

  return (
    <div
      className={`absolute w-[270px] rounded-xl bg-surface ${glow}
                  transition-transform duration-300 hover:-translate-y-0.5`}
      style={{ left: node.x, top: node.y, zIndex: 2 }}
    >
      {/* connector dots */}
      <span
        className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background border-2"
        style={{ borderColor: accent, boxShadow: `0 0 10px ${accent}` }}
      />
      <span
        className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background border-2"
        style={{ borderColor: accent, boxShadow: `0 0 10px ${accent}` }}
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.18em] font-semibold
                       px-2 py-0.5 rounded-full border"
            style={{
              color: accent,
              borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
              background: `color-mix(in oklab, ${accent} 8%, transparent)`,
            }}
          >
            {node.badge}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        </div>

        <div className="flex items-start gap-3">
          <span
            className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
            style={{
              background: `color-mix(in oklab, ${accent} 12%, #0f0f11)`,
              color: accent,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 25%, transparent)`,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="font-display text-[15px] font-semibold tracking-tight text-foreground truncate">
              {node.title}
            </div>
            <div className="text-[11.5px] text-muted-foreground font-mono truncate">
              {node.subtitle}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-[10.5px] text-muted-foreground">
          <span>2 outputs</span>
          <span className="font-mono">{node.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
