import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Mail, Lock, UserPlus, LogIn, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      } else {
        await signUp(email, password);
        toast.success("Account created! You can now sign in.");
        setIsLogin(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <div
              className="h-8 w-8 rounded-md flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#00E5FF,#0088aa)",
                boxShadow: "0 0 14px rgba(0,229,255,0.5)",
              }}
            >
              <Sparkles className="h-4 w-4 text-[#07181c]" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Ancrest
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {isLogin ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {isLogin ? "Welcome back to your workflow studio" : "Get started with your automation studio"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#0f0f11] border border-border-subtle
                           text-sm placeholder:text-muted-foreground/70 text-foreground
                           focus:outline-none focus:border-[color:var(--accent)]/40
                           focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="········"
                  required
                  minLength={6}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#0f0f11] border border-border-subtle
                           text-sm placeholder:text-muted-foreground/70 text-foreground
                           focus:outline-none focus:border-[color:var(--accent)]/40
                           focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cta-cyan cta-cyan-hover h-10 rounded-lg text-sm font-semibold
                       inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-[#07181c]/40 border-t-[#07181c] rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[color:var(--accent)] font-medium hover:underline inline-flex items-center gap-1 ml-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
