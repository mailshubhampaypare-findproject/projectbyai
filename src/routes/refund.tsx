import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund Policy — ScholarBuild" }] }),
  component: RefundPolicy,
});

function RefundPolicy() {
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
        <h1 className="text-4xl font-extrabold tracking-tight">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold">1. Digital Products and Subscriptions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Due to the immediate consumption nature of digital code generation tokens and downloadable prebuilt code library assets, we generally do not offer refunds once tokens are used or library items are downloaded.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Technical Issues</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you experience a system failure, billing error, or server crash that prevented token delivery, please contact our support team within 7 days of the transaction. We will verify and reissue your tokens or offer a refund on a case-by-case basis.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Subscription Cancellation</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can cancel your subscription at any time by visiting your profile billing dashboard. Your cancellation will take effect at the end of the current billing cycle, and you will continue to have access to your active plan until then.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. Contact Support</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you believe you have been double-charged or need assistance with your payments, please submit your billing issue via the Contact Us form.
          </p>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </footer>
    </div>
  );
}
