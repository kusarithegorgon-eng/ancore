import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, ArrowRight, Play, Zap, Globe, Database, GitBranch, Code as Code2, ChevronRight, Star, Shield, Webhook, ListFilter as Filter, Cpu, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav user={user} />
      <HeroSection user={user} />
      <MockupSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}

function LandingNav({ user }: { user: { email: string } | null }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 glass-nav h-16 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-md flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#00E5FF,#0088aa)", boxShadow: "0 0 14px rgba(0,229,255,0.5)" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#07181c]" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-foreground">Ancrest</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Home</Link>
        <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Terms</Link>
        <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Privacy</Link>
        {user ? (
          <Link
            to="/dashboard"
            className="cta-cyan cta-cyan-hover h-8 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            Dashboard
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <Link
            to="/auth"
            className="cta-cyan cta-cyan-hover h-8 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            Get Started
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ user }: { user: { email: string } | null }) {
  return (
    <section className="relative pt-32 pb-12 px-6 lg:px-12 flex flex-col items-center text-center">
      {/* Floating pill badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 backdrop-blur-sm">
        <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
        <span className="text-xs font-medium text-[color:var(--accent)]">
          Multi-track logic & workflow orchestration engine
        </span>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]">
        Build API workflows that
        <span className="block" style={{ color: "var(--accent)", textShadow: "0 0 40px rgba(0,229,255,0.3)" }}>
          actually ship
        </span>
      </h1>

      <p className="mt-6 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
        Ancrest is a visual workflow studio for developers. Design, test, and deploy
        automation pipelines with a drag-and-drop canvas. No boilerplate, no limits.
      </p>

      <div className="mt-8 flex items-center gap-3 flex-wrap justify-center">
        <Link
          to={user ? "/dashboard" : "/auth"}
          className="cta-cyan cta-cyan-hover h-11 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Start Building
        </Link>
        <Link
          to="/auth"
          className="neumorphic neumorphic-press h-11 px-6 rounded-xl text-sm font-medium text-foreground/85 border border-white/[0.04] inline-flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Free to start
        </Link>
      </div>

      {/* Social proof */}
      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex -space-x-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-6 w-6 rounded-full bg-[#1a1a1e] border border-border-subtle flex items-center justify-center text-[9px] font-bold text-[color:var(--accent)]">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span>Trusted by 1,200+ developers</span>
      </div>
    </section>
  );
}

function MockupSection() {
  return (
    <section className="relative px-6 lg:px-12 pb-20 flex justify-center">
      <div className="relative w-full max-w-5xl">
        {/* Browser frame */}
        <div className="relative rounded-xl border border-border-subtle bg-[#0a0a0c] overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.08)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-border-subtle bg-[#0d0d0f]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-1 rounded-md bg-[#121214] border border-border-subtle text-[10px] text-muted-foreground font-mono">
                app.ancrest.dev/canvas/stripe-notifier
              </div>
            </div>
            <div className="w-16" />
          </div>

          {/* Canvas mockup */}
          <div className="relative h-[380px] bg-[#0d0d0f] overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-50" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(700px 500px at 30% 40%, rgba(0,229,255,0.06), transparent 60%), radial-gradient(600px 400px at 70% 70%, rgba(181,123,255,0.05), transparent 60%)",
              }}
            />

            {/* Mock nodes */}
            <div className="absolute left-[10%] top-[20%] w-[200px] rounded-lg bg-[#121214] border border-[rgba(0,229,255,0.25)] p-3 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[color:var(--accent)]">Webhook</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="text-xs font-semibold text-foreground">Stripe Event</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">POST /v1/events</div>
            </div>

            {/* Connection line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="mockWire" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#B57BFF" stopOpacity="0.7" />
                </linearGradient>
                <filter id="mockGlow">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                d="M 280 180 C 380 180, 380 180, 480 180"
                stroke="url(#mockWire)" strokeWidth="1.5" fill="none" filter="url(#mockGlow)"
              />
            </svg>

            <div className="absolute left-[50%] top-[15%] w-[200px] rounded-lg bg-[#121214] border border-[rgba(181,123,255,0.25)] p-3 shadow-[0_0_20px_rgba(181,123,255,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[color:var(--purple)]">Logic</span>
              </div>
              <div className="text-xs font-semibold text-foreground">Filter Charges</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">event.type == charge.*</div>
            </div>

            <div className="absolute left-[75%] top-[30%] w-[200px] rounded-lg bg-[#121214] border border-[rgba(255,181,71,0.25)] p-3 shadow-[0_0_20px_rgba(255,181,71,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[color:var(--amber)]">REST API</span>
              </div>
              <div className="text-xs font-semibold text-foreground">Notify Slack</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">POST hooks.slack.com</div>
            </div>
          </div>
        </div>

        {/* Bottom fade mask */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
        />
      </div>
    </section>
  );
}

const features = [
  {
    icon: Database,
    title: "Supabase Engine",
    desc: "Native JSONB storage for node graphs with real-time sync. Every workflow is versioned and persisted.",
    badge: "PostgreSQL",
    badgeColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    icon: Globe,
    title: "REST API Builder",
    desc: "Design and test HTTP request nodes visually. Auto-generate webhooks, validate schemas, and chain API calls.",
    badge: "HTTP/2",
    badgeColor: "text-[color:var(--accent)] bg-[color:var(--accent)]/10",
  },
  {
    icon: GitBranch,
    title: "JSONB Graph Logic",
    desc: "Conditional branching, data transformation, and payload routing — all expressed as a traversable node graph.",
    badge: "GraphQL-ready",
    badgeColor: "text-[color:var(--purple)] bg-[color:var(--purple)]/10",
  },
];

function FeaturesSection() {
  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">Built for production</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Every feature is engineered to handle real workloads at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-xl border border-border-subtle bg-[#121214]/80 p-6
                         hover:border-[color:var(--accent)]/20 hover:bg-[#121214]
                         transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-[#0a0a0c] border border-border-subtle flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[color:var(--accent)]" />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-[color:var(--accent)]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-6 lg:px-12 py-20">
      <div className="max-w-3xl mx-auto rounded-2xl border border-border-subtle bg-[#121214]/60 p-10 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(400px 300px at 50% 50%, rgba(0,229,255,0.06), transparent)" }}
        />
        <h2 className="font-display text-2xl font-bold text-foreground mb-3 relative z-10">Ready to automate?</h2>
        <p className="text-sm text-muted-foreground mb-6 relative z-10 max-w-md mx-auto">
          Join developers shipping workflows with Ancrest. No credit card required.
        </p>
        <Link
          to="/auth"
          className="cta-cyan cta-cyan-hover h-11 px-8 rounded-xl text-sm font-semibold inline-flex items-center gap-2 relative z-10"
        >
          <Sparkles className="h-4 w-4" />
          Create free account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle px-6 lg:px-12 py-10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="h-5 w-5 rounded-sm flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#00E5FF,#0088aa)" }}
          >
            <Sparkles className="h-2.5 w-2.5 text-[#07181c]" strokeWidth={3} />
          </div>
          <span className="font-display text-sm font-bold text-foreground">Ancrest</span>
          <span className="text-xs text-muted-foreground">2026</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/auth" className="hover:text-foreground transition-colors">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
