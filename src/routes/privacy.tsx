import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Shield, Lock, Server, FileCode, Users, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

const sections = [
  {
    icon: FileCode,
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us, including your email address, password (hashed), and profession/role selection during account creation.",
      "We also collect workflow data you create — node graphs, edge connections, configuration, and execution logs. This data is stored as JSONB in our PostgreSQL database.",
      "Automatically collected usage data includes IP address, browser type, device information, and interaction logs used to improve our services.",
    ],
  },
  {
    icon: Users,
    title: "2. How We Use Your Data",
    body: [
      "To provide, operate, and maintain the Ancrest workflow studio and its features.",
      "To authenticate your account, persist your workflows, and execute automation pipelines on your behalf.",
      "To communicate with you about your account, security updates, and service changes.",
      "To monitor for abuse, prevent fraud, and ensure platform security.",
      "We never sell your personal data to third parties. We do not use your personal data for targeted advertising.",
    ],
  },
  {
    icon: Shield,
    title: "3. Legal Basis for Processing (GDPR)",
    body: [
      "For users in the European Economic Area (EEA), we process your personal data under the following legal bases:",
      "Consent: When you voluntarily provide information such as your profession during signup.",
      "Contract: When processing is necessary to provide the services you requested under our Terms of Service.",
      "Legitimate Interest: For security monitoring, fraud prevention, and service improvement.",
      "Legal Obligation: When we are required to comply with applicable laws and regulations.",
    ],
  },
  {
    icon: Users,
    title: "4. Your Rights — GDPR & CCPA",
    body: [
      "Right to Access: You can request a copy of all personal data we hold about you.",
      "Right to Rectification: You can correct inaccurate or incomplete personal data.",
      "Right to Erasure (Right to be Forgotten): You can request deletion of your account and all associated personal data. This includes workflow data, execution logs, and account metadata. Deletion is permanent and irreversible.",
      "Right to Data Portability: You can export your workflow data in a machine-readable format.",
      "Right to Object: You can object to processing based on legitimate interests.",
      "Right to Restrict Processing: You can request that we limit how we use your data temporarily.",
      "California residents (CCPA): You have the right to know what personal information is collected, request deletion, and opt out of the sale of personal information. We do not sell personal information.",
      "To exercise any of these rights, contact us at privacy@ancrest.dev. We will respond within 30 days.",
    ],
  },
  {
    icon: Lock,
    title: "5. Data Encryption & Security",
    body: [
      "Data in Transit: All communication between your browser and our servers is encrypted using TLS 1.2+ (SSL/TLS). We enforce HTTPS everywhere.",
      "Data at Rest: All stored data is encrypted using AES-256 encryption in our PostgreSQL database (Supabase).",
      "Authentication: Passwords are hashed using bcrypt. We never store passwords in plaintext.",
      "Row-Level Security: Each user's workflow data is isolated using PostgreSQL Row-Level Security (RLS) policies. Users can only access their own data.",
      "Access Control: Internal access to production data is restricted to authorized personnel using least-privilege principles.",
    ],
  },
  {
    icon: Server,
    title: "6. Data Processing Agreements (DPAs)",
    body: [
      "We use third-party subprocessors to deliver our services. Each subprocessor is bound by a Data Processing Agreement that governs how they handle your data:",
      "Supabase (database hosting & authentication): Stores workflow data and user accounts. GDPR-compliant with SOC 2 Type II certification.",
      "Stripe (payment processing): Handles billing for paid plans. PCI-DSS Level 1 certified. We never receive or store your credit card information.",
      "Google Cloud / AWS (infrastructure): Hosts our application servers and edge functions.",
      "Vercel / Cloudflare (CDN & deployment): Serves our web application and static assets.",
      "We maintain a current list of subprocessors and will notify you of any changes. You may object to a new subprocessor by contacting us within 30 days of notification.",
    ],
  },
  {
    icon: Server,
    title: "7. PCI-DSS Compliance",
    body: [
      "Ancrest does not directly process, store, or transmit credit card data. All payment processing is handled by Stripe, a PCI-DSS Level 1 certified payment gateway.",
      "When you upgrade to a paid plan, you are redirected to Stripe's secure checkout. Your card number, CVV, and expiration date never touch our servers.",
      "We only store the Stripe customer ID and subscription status — never the card details.",
    ],
  },
  {
    icon: Globe,
    title: "8. International Data Transfers",
    body: [
      "Your data may be processed in countries other than your own, including the United States. We ensure appropriate safeguards are in place for such transfers, including Standard Contractual Clauses (SCCs) approved by the European Commission.",
      "By using Ancrest, you consent to the transfer of your data to these countries subject to the protections described in this policy.",
    ],
  },
  {
    icon: FileCode,
    title: "9. Data Retention",
    body: [
      "We retain your personal data for as long as your account is active. When you delete your account, we permanently remove all personal data within 30 days, including:",
      "Account information (email, hashed password, profession).",
      "All workflows, nodes, edges, and configuration.",
      "Execution logs and console output.",
      "We may retain aggregated, anonymized data for analytics purposes. This data cannot be linked back to you.",
      "We may retain certain data where required by law (e.g., tax records) for the legally mandated period.",
    ],
  },
  {
    icon: Shield,
    title: "10. Data Breach Notification",
    body: [
      "In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify you within 72 hours of becoming aware of the breach.",
      "We will also notify the relevant supervisory authority (e.g., the ICO in the UK, the relevant Data Protection Authority in the EU) as required by GDPR Article 33.",
      "Our notification will describe the nature of the breach, the likely consequences, and the measures we are taking to address it.",
    ],
  },
  {
    icon: Users,
    title: "11. Children's Privacy (COPPA)",
    body: [
      "Ancrest is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.",
      "If we learn that we have collected personal information from a child under 13, we will delete that information promptly.",
      "If you believe we have collected information from a child, please contact us at privacy@ancrest.dev.",
    ],
  },
  {
    icon: FileCode,
    title: "12. Open-Source Compliance",
    body: [
      "Ancrest is built using open-source software. We audit our dependencies to ensure compliance with all applicable open-source licenses (MIT, Apache 2.0, BSD, ISC, etc.).",
      "We respect the intellectual property rights of open-source contributors and adhere to all license terms, including attribution requirements and copyleft obligations.",
    ],
  },
  {
    icon: Mail,
    title: "13. Contact Us",
    body: [
      "If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at:",
      "Email: privacy@ancrest.dev",
      "We will respond to your request within 30 days, as required by GDPR.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
          Back to Ancrest
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 mb-6">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">GDPR & CCPA Compliant</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-2">Last updated: June 2026</p>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          Ancrest is committed to protecting your privacy. This policy explains how we collect, use,
          and safeguard your personal information in compliance with the General Data Protection
          Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other applicable laws.
        </p>

        <div className="space-y-8">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-[#0a0a0c] border border-border-subtle flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[color:var(--accent)]" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">{s.title}</h2>
                </div>
                <div className="space-y-2 pl-11">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
