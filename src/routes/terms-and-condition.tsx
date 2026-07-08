import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/terms-and-condition")({
  head: () => ({ meta: [{ title: "Terms and Conditions — projectbyAI" }] }),
  component: TermsAndConditions,
});

function TermsAndConditions() {
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Terms and Conditions</h1>
          <p className="text-xs text-slate-500 mt-1">Effective Date: July 8, 2026</p>
        </div>

        <div className="text-xs leading-relaxed text-slate-600 space-y-4 font-normal">
          <p>
            Welcome to ProjectByAI! These terms and conditions outline the rules and regulations for the use of the ProjectByAI website, located at <a href="https://www.projectbyai.com/" className="text-primary hover:underline font-medium">https://www.projectbyai.com/</a>.
          </p>

          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use ProjectByAI if you do not agree to all of the terms and conditions stated on this page.
          </p>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">1. Intellectual Property Rights</h2>
            <p>
              Unless otherwise stated, ProjectByAI and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from ProjectByAI for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p>You must not:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Republish material from ProjectByAI.</li>
              <li>Sell, rent, or sub-license material from ProjectByAI.</li>
              <li>Reproduce, duplicate, or copy material from ProjectByAI.</li>
              <li>Redistribute content from ProjectByAI (unless content is specifically made for redistribution).</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">2. User Accounts</h2>
            <p>
              If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must notify us immediately of any unauthorized uses of your account or any other breaches of security.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">3. Acceptable Use of AI Services</h2>
            <p>ProjectByAI provides tools that utilize Artificial Intelligence. By using these tools, you agree:</p>
            
            <div className="pl-4 space-y-2">
              <p>
                <strong>Accuracy:</strong> You understand that AI-generated content can occasionally be incorrect, biased, or misleading. We do not guarantee the accuracy, completeness, or usefulness of any information provided by our AI models.
              </p>
              <p>
                <strong>Responsibility:</strong> You are solely responsible for the content you generate, upload, or share through our platform. You agree not to use our services to generate content that is illegal, harmful, threatening, abusive, defamatory, or violates the rights of others.
              </p>
              <p>
                <strong>Prohibited Use:</strong> You may not use our services to attempt to decompile, reverse engineer, or scrape our platform or the underlying AI models.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">4. Limitation of Liability</h2>
            <p>
              In no event shall ProjectByAI, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website, whether such liability is under contract. ProjectByAI, including its officers, directors, and employees, shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">5. Indemnification</h2>
            <p>
              You hereby indemnify to the fullest extent ProjectByAI from and against any and all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">6. Termination</h2>
            <p>
              We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">7. Governing Law</h2>
            <p>
              These terms will be governed by and interpreted in accordance with the laws of India and the state of Maharashtra, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Mumbai, India for the resolution of any disputes.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">8. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
              <br />
              <strong>By Visiting this page on our website:</strong> <Link to="/contact" className="text-primary hover:underline font-semibold">https://www.projectbyai.com/contact</Link>
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
