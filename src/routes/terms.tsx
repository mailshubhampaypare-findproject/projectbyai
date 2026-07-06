import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms and Conditions — ScholarBuild" }] }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
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
        <h1 className="text-4xl font-extrabold tracking-tight">Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold">1. Agreement to Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using ScholarBuild (a brand owned by Eduprojects Solution), you agree to be bound by these Terms and Conditions. If you do not agree, you must immediately discontinue use of this site and platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Use of Services</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You agree to use our platform strictly for learning and academic project assistance. You must not use the generated code or tools to violate academic integrity policies of your institution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Account Registration and Billing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are responsible for keeping your credentials secure. Tokens purchased are non-transferable. Subscriptions and purchases are billed dynamically via Stripe.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. Disclaimer of Warranties</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our platform and code templates are provided "as is" and "as available". Eduprojects Solution makes no representations or warranties that the code templates will compile without errors or satisfy institution requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">5. Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In no event shall Eduprojects Solution be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform.
          </p>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </footer>
    </div>
  );
}
