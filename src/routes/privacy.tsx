import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ScholarBuild" }] }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-4xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-primary" /> <span className="text-gradient">ScholarBuild</span>
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect personal information that you provide directly to us when registering, such as your name, email address, profile avatar, and metadata. We also collect AI prompt inputs and project details generated during your sessions to build and improve your code and reports.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your information is used to facilitate user account creation, deliver custom AI project code, design presentation slides, prepare customized viva questions, and handle Stripe billing securely.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Sharing and Disclosures</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do not sell, rent, or trade your personal data. We share necessary details only with trusted services such as Supabase (database and auth hosting), Stripe (payment gateway), and Google Gemini (LLM processing).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. Data Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We employ administrative, physical, and electronic security measures designed to protect your information from unauthorized access. However, no internet transmission is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">5. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions or concerns about this policy, please reach out to us via our Contact Us page.
          </p>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </footer>
    </div>
  );
}
