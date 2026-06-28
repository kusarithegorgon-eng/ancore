import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
          Back to Ancore
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>Ancore is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your email address and workflow data. We also collect usage data to improve our services.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Data</h2>
            <p>We use your data to provide and improve our services, communicate with you, and ensure security. We never sell your personal data to third parties.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. All workflow data is stored securely in Supabase with row-level security.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </div>
          <p>Last updated: June 2026</p>
        </div>
      </div>
    </div>
  );
}
