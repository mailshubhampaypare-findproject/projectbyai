import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund Policy — projectbyAI" }] }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <header className="max-w-4xl mx-auto w-full px-6 py-4 flex items-center justify-between border-b border-slate-200">
        <BrandLogo />
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cancellation and Refund Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 8, 2026</p>
        </div>

        <div className="text-xs leading-relaxed text-slate-600 space-y-4 font-normal">
          <p>
            Thank you for choosing ProjectByAI (accessible at <a href="https://www.projectbyai.com/" className="text-primary hover:underline font-medium">https://www.projectbyai.com/</a>). We strive to provide high-quality AI tools and services to assist you with your projects.
          </p>

          <p>
            Because our website delivers digital goods and immediate access to AI generation resources, we have established the following refund policy to ensure fairness for both our users and our platform.
          </p>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">1. Digital Goods and Consumption</h2>
            <p>
              By purchasing a subscription, credit pack, or premium service on ProjectByAI, you receive instant access to digital assets and AI processing power. Because these resources are consumed immediately upon generation, all sales are generally final and non-refundable, except as explicitly outlined below.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">2. Eligibility for Refunds</h2>
            <p>We review refund requests on a case-by-case basis. You may be eligible for a full or partial refund under the following conditions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Technical Issues:</strong> If a technical error or system glitch on our end prevents you from using the service you paid for, and our support team cannot resolve it within 3 to 5 business days.
              </li>
              <li>
                <strong>Accidental Renewal:</strong> If your subscription automatically renewed and you wish to cancel, you must request a refund within 24 to 48 hours of the renewal charge. To qualify, you must not have used any AI credits or generated any content during that renewal period.
              </li>
              <li>
                <strong>Billing Errors:</strong> If you were double-billed or charged an incorrect amount due to a payment gateway error.
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">3. Non-Refundable Circumstances</h2>
            <p>We cannot issue refunds in the following situations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                You are dissatisfied with the creative output or quality of the AI generation (AI outputs are unpredictable by nature, and we encourage using our free tiers/credits to test the tool first).
              </li>
              <li>
                You forgot to cancel your subscription before the renewal date and have already used the new cycle's credits.
              </li>
              <li>
                Your account was suspended or terminated due to a violation of our Terms and Conditions (e.g., policy violations, scraping, or misuse).
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">4. How to Request a Refund</h2>
            <p>
              If you believe you meet the criteria for a refund, please contact us within 7 days of the transaction:
              <br />
              <strong>By contacting us on:</strong> <Link to="/contact" className="text-primary hover:underline font-semibold">https://www.projectbyai.com/contact</Link>
            </p>
            <p>
              Please include your account details, the transaction date, the amount charged, and a brief description of why you are requesting a refund (including screenshots of any technical issues, if applicable).
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">5. Processing Time</h2>
            <p>
              Once we receive your request, our team will investigate it and notify you via email regarding the approval or rejection of your refund.
            </p>
            <p>
              If approved, your refund will be processed automatically back to your original method of payment (credit card, UPI, net banking, etc.) within 5 to 10 business days, depending on your financial institution's processing times.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">6. Changes to This Policy</h2>
            <p>
              ProjectByAI reserves the right to modify this Cancellation and Refund Policy at any time. Any changes will be posted on this page with an updated modification date.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-[11px] text-slate-400 bg-white">
        © {new Date().getFullYear()} projectbyAI. All rights reserved.
      </footer>
    </div>
  );
}
