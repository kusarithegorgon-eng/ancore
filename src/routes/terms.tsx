import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
          Back to Ancore
        </Link>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>Welcome to Ancore. These Terms of Service govern your use of our website and services. By accessing or using Ancore, you agree to be bound by these terms.</p>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Use of Service</h2>
            <p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our service in any way that violates applicable laws or regulations.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for any activities under your account.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Intellectual Property</h2>
            <p>All content, features, and functionality of Ancore are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Limitation of Liability</h2>
            <p>In no event shall Ancore be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page.</p>
          </div>
          <p>Last updated: June 2026</p>
        </div>
      </div>
    </div>
  );
}
