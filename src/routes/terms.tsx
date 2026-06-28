import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, FileCode, Shield, Users, Lock, Server, Globe, Mail } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

const sections = [
  {
    icon: FileCode,
    title: "1. Acceptance of Terms",
    body: [
      "Welcome to Ancrest. These Terms of Service (\"Terms\") and End-User License Agreement (\"EULA\") govern your use of the Ancrest workflow studio, website, and services (the \"Service\").",
      "By accessing or using Ancrest, you agree to be bound by these Terms. If you do not agree, you may not access or use the Service.",
      "If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.",
    ],
  },
  {
    icon: Users,
    title: "2. Use of Service",
    body: [
      "You may use our services only for lawful purposes and in accordance with these Terms.",
      "You agree not to:",
      "Use the Service in any way that violates applicable local, national, or international laws or regulations.",
      "Attempt to gain unauthorized access to, interfere with, or disrupt any systems, networks, or accounts of Ancrest or its users.",
      "Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Service, except as permitted by applicable law.",
      "Use the Service to send spam, malware, or any unauthorized communications.",
      "Create workflows that infringe on the intellectual property rights of others.",
      "Resell, sublicense, or redistribute the Service without our written consent.",
      "Circumvent any security or access control measures of the Service.",
    ],
  },
  {
    icon: Users,
    title: "3. Accounts",
    body: [
      "When you create an account with us, you must provide accurate and complete information, including a valid email address.",
      "You are responsible for safeguarding your password and for any activities conducted under your account.",
      "You must be at least 13 years of age to create an account. Users under 18 require parental or legal guardian consent.",
      "You agree to notify us immediately of any unauthorized use of your account or any other security breach.",
      "We reserve the right to suspend or terminate accounts that violate these Terms.",
    ],
  },
  {
    icon: FileCode,
    title: "4. Intellectual Property Ownership",
    body: [
      "All content, features, and functionality of Ancrest — including the Ancrest name, logo, software, source code, design, user interface, documentation, and all related intellectual property — are owned by Ancrest and are protected by international copyright, trademark, patent, and other intellectual property laws.",
      "You retain all ownership rights to the workflows, node configurations, and data you create using the Service. Your workflow data is yours.",
      "By using the Service, you grant Ancrest a limited, non-exclusive license to process your workflow data solely as necessary to provide and operate the Service to you.",
      "We do not claim ownership of your content. We will not access, view, or share your workflow data except as required to provide the Service, ensure security, or comply with legal obligations.",
      "Ancrest and all related marks are trademarks of Ancrest. All other trademarks are the property of their respective owners.",
    ],
  },
  {
    icon: FileCode,
    title: "5. License to Use the Service",
    body: [
      "Subject to your compliance with these Terms, Ancrest grants you a personal, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business or personal purposes.",
      "This license does not include any right to resell, sublicense, or distribute the Service.",
      "Free tier usage is subject to execution limits. Paid plans offer higher limits as described on our pricing page.",
    ],
  },
  {
    icon: Server,
    title: "6. Payment Terms",
    body: [
      "Paid plans are billed through Stripe, our PCI-DSS Level 1 certified payment processor. We do not directly collect, store, or process your credit card information.",
      "By subscribing to a paid plan, you authorize Stripe to charge the applicable fees to your designated payment method.",
      "Fees are billed in advance on a recurring basis (monthly or annually, depending on your plan).",
      "All fees are non-refundable except where required by law. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period.",
      "We reserve the right to change our fees upon reasonable notice. Price changes will not apply to your current billing period.",
      "Taxes, where applicable, are added to your invoice based on your billing address.",
    ],
  },
  {
    icon: Shield,
    title: "7. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, in no event shall Ancrest, its officers, directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:",
      "Loss of profits, data, business opportunities, or goodwill.",
      "Damages arising from interruption of service, data loss, or workflow execution failures.",
      "Damages resulting from unauthorized access to or alteration of your data.",
      "The total liability of Ancrest for any claim arising from or related to the Service shall not exceed the amount you paid to Ancrest in the twelve (12) months preceding the claim, or one hundred dollars ($100), whichever is greater.",
      "Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you.",
    ],
  },
  {
    icon: Shield,
    title: "8. Disclaimer of Warranties",
    body: [
      "The Service is provided \"AS IS\" and \"AS AVAILABLE\" without warranties of any kind, whether express or implied.",
      "We do not warrant that the Service will be uninterrupted, error-free, secure, or that your workflows will execute correctly at all times.",
      "You are solely responsible for testing and validating your workflows before relying on them in production environments.",
      "We disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.",
    ],
  },
  {
    icon: Lock,
    title: "9. Security & Data Breach",
    body: [
      "We implement industry-standard security measures to protect your data, including SSL/TLS encryption in transit, AES-256 encryption at rest, and PostgreSQL Row-Level Security for data isolation.",
      "In the event of a security incident that compromises your personal data, we will notify you and the relevant authorities within 72 hours, as required by GDPR Article 33.",
      "We conduct regular security audits and vulnerability assessments to maintain the integrity of our systems.",
      "You are responsible for maintaining the security of your account credentials and for configuring your workflows securely.",
    ],
  },
  {
    icon: FileCode,
    title: "10. Open-Source Compliance",
    body: [
      "Ancrest is built using open-source software licensed under various licenses (MIT, Apache 2.0, BSD, ISC, and others).",
      "We audit our codebase and dependencies to ensure full compliance with all applicable open-source license terms, including attribution requirements and copyleft obligations.",
      "A list of open-source libraries used in the Service, along with their licenses, is available upon request.",
      "We respect the intellectual property rights of all open-source contributors and adhere to all license terms.",
    ],
  },
  {
    icon: Users,
    title: "11. Indemnification",
    body: [
      "You agree to indemnify and hold harmless Ancrest, its officers, directors, employees, and affiliates from any claims, damages, losses, or expenses (including reasonable attorney fees) arising from:",
      "Your use of the Service or violation of these Terms.",
      "Your workflow content or data, including any infringement of third-party intellectual property rights.",
      "Any breach of your representations or warranties under these Terms.",
    ],
  },
  {
    icon: Globe,
    title: "12. Governing Law & Dispute Resolution",
    body: [
      "These Terms are governed by the laws of the jurisdiction in which Ancrest is incorporated, without regard to conflict of law principles.",
      "Any dispute arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation.",
      "If negotiation fails, disputes shall be resolved through binding arbitration, with the venue determined by the governing jurisdiction.",
      "You may also bring a claim in your local jurisdiction if required by applicable consumer protection laws.",
    ],
  },
  {
    icon: FileCode,
    title: "13. Termination",
    body: [
      "You may terminate your account at any time by contacting us or through the account settings.",
      "Upon termination, all your workflow data will be permanently deleted within 30 days, as described in our Privacy Policy.",
      "We reserve the right to suspend or terminate your access to the Service if you violate these Terms or if your account poses a security risk.",
      "Sections that by their nature should survive termination (including intellectual property, limitation of liability, and indemnification) shall remain in effect.",
    ],
  },
  {
    icon: FileCode,
    title: "14. Changes to Terms",
    body: [
      "We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of this page and, where appropriate, by sending a notification to your registered email.",
      "Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.",
      "If you do not agree to the changes, you may terminate your account as described in Section 13.",
    ],
  },
  {
    icon: Mail,
    title: "15. Contact Us",
    body: [
      "If you have questions about these Terms, please contact us at:",
      "Email: legal@ancrest.dev",
    ],
  },
];

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
          Back to Ancrest
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/5 mb-6">
          <FileCode className="h-3.5 w-3.5 text-[color:var(--accent)]" />
          <span className="text-xs font-medium text-[color:var(--accent)]">Terms of Service & EULA</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-3">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-2">Last updated: June 2026</p>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          These Terms of Service and End-User License Agreement (EULA) constitute a legally binding
          agreement between you and Ancrest governing your use of our workflow automation platform.
          Please read them carefully.
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
