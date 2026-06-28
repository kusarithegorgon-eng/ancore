import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, UserPlus, LogIn, ArrowRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const PROFESSIONS = [
  { value: "junior_dev", label: "Junior Developer" },
  { value: "mid_dev", label: "Mid-Level Developer" },
  { value: "senior_dev", label: "Senior Developer" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher / Educator" },
  { value: "designer", label: "UI/UX Designer" },
  { value: "product_manager", label: "Product Manager" },
  { value: "devops", label: "DevOps / SRE" },
  { value: "freelancer", label: "Freelancer" },
  { value: "entrepreneur", label: "Entrepreneur / Founder" },
  { value: "other", label: "Other" },
];

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [professionCustom, setProfessionCustom] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        navigate({ to: "/dashboard" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard" });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          // Save profession to user_profiles
          if (profession) {
            await supabase.from("user_profiles").insert({
              id: data.user.id,
              profession,
              profession_custom: profession === "other" ? professionCustom || null : null,
            });
          }
          toast.success("Account created! Redirecting...");
          navigate({ to: "/dashboard" });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-y-auto">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <img
              src="/images/Gemini_Generated_Image_mggxphmggxphmggx.png"
              alt="Ancrest"
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Ancrest
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {isLogin
              ? "Sign in to access your workflows"
              : "Get started with your first automation"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#121214] border border-border-subtle text-sm text-foreground focus:outline-none focus:border-[color:var(--accent)]/40 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-[#121214] border border-border-subtle text-sm text-foreground focus:outline-none focus:border-[color:var(--accent)]/40 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Profession selector — sign-up only */}
            {!isLogin && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    What best describes you?{" "}
                    <span className="text-muted-foreground/50">(optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFESSIONS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setProfession(profession === p.value ? "" : p.value)}
                        className={`h-9 px-3 rounded-lg text-[11px] font-medium text-left transition-all border ${
                          profession === p.value
                            ? "border-[color:var(--accent)]/50 bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                            : "border-border-subtle bg-[#121214] text-muted-foreground hover:border-[color:var(--accent)]/25 hover:text-foreground/80"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {profession === "other" && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Please specify{" "}
                      <span className="text-muted-foreground/50">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={professionCustom}
                      onChange={(e) => setProfessionCustom(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#121214] border border-border-subtle text-sm text-foreground focus:outline-none focus:border-[color:var(--accent)]/40 transition-colors"
                      placeholder="e.g. Data Scientist, QA Engineer…"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-[color:var(--accent)] text-[#07181c] font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-[#07181c]/40 border-t-[#07181c] rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setProfession("");
                setProfessionCustom("");
              }}
              className="text-[color:var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
            >
              {isLogin ? "Sign up" : "Sign in"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Legal notice */}
          <p className="mt-8 text-center text-[10px] text-muted-foreground/60 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-muted-foreground transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-muted-foreground transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
