import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldAlert, ShieldCheck, Scale, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/linkedin-extension-privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LinkedIn Automation Chrome Extension | projectbyAI" },
      {
        name: "description",
        content:
          "Privacy Policy, User Responsibility & Data Governance for the LinkedIn Automation Chrome Extension. Learn how your data is handled locally and user terms of compliance.",
      },
    ],
  }),
  component: LinkedinExtensionPrivacyPage,
});

function LinkedinExtensionPrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full px-6 py-4 flex items-center justify-between border-b border-slate-200">
        <BrandLogo />
        <Button variant="ghost" size="sm" asChild>
          <Link
            to="/linkedin-extension"
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to LinkedIn Extension
          </Link>
        </Button>
      </header>

      {/* Main Legal Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 space-y-8">
        {/* Title Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Lock className="h-3 w-3" /> Dedicated Chrome Extension Privacy Policy
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Privacy Policy & Data Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            LinkedIn Automation Chrome Extension • Effective Date: October 2026 • Version 2.4
          </p>
        </div>

        {/* High-Priority Legal Warning Box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            Crucial Legal Notice Regarding User Responsibility & Platform Compliance
          </div>
          <p>
            By downloading, installing, or executing the LinkedIn Automation Chrome Extension ("Extension"), you
            expressly agree that <strong>you, as the user, assume 100% sole and absolute legal and contractual responsibility</strong> for
            all scraping, searching, data extraction, connection requests, and messaging campaigns initiated. ProjectbyAI
            ("We", "Us", or "Company") provides this browser automation utility strictly as a client-side technical mechanism
            and bears <strong>zero liability</strong> for any action taken by LinkedIn Corporation, Google LLC, or any regulatory authority.
          </p>
        </div>

        {/* Policy Text Sections */}
        <div className="text-xs leading-relaxed text-slate-700 space-y-6 font-normal">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Independent Utility & Non-Affiliation Disclaimer
            </h2>
            <p>
              The Extension is an independent browser software utility created by projectbyAI. The Extension is{" "}
              <strong>
                NOT affiliated with, endorsed by, sponsored by, maintained by, or in any way officially associated with
                LinkedIn Corporation, Microsoft Corporation, Google LLC, or Alphabet Inc.
              </strong>
            </p>
            <p>
              "LinkedIn" and the LinkedIn logo are registered trademarks of LinkedIn Corporation and its affiliates. "Chrome"
              and "Google Sheets" are registered trademarks of Google LLC. The use of these trademarks is solely for
              referential and identification purposes to describe the compatibility and function of the Extension.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> Strict User Responsibility & Absolute Waiver of Liability
            </h2>
            <p>
              You acknowledge that LinkedIn Corporation enforces strict User Agreements, Professional Community Policies,
              anti-automation covenants, rate limits, and automated scraping restrictions.
            </p>
            <div className="pl-3 border-l-2 border-slate-300 space-y-2 font-medium text-slate-800">
              <p>
                <strong>Sole User Liability:</strong> Any technical sanction, CAPTCHA checkpoint, warning, temporary profile
                restriction, commercial use limit, shadowban, account suspension, or permanent termination imposed on your
                LinkedIn account is the <strong>exclusive, sole liability of the User</strong>.
              </p>
              <p>
                <strong>No Liability on projectbyAI:</strong> Under no legal theory—whether in contract, tort, strict liability,
                statutory breach, or otherwise—shall projectbyAI, its founders, developers, employees, contractors, or affiliates
                be held liable for any damages, loss of business opportunities, lost contacts, loss of LinkedIn account access,
                or legal actions/cease-and-desist notices brought by LinkedIn Corporation, regulatory authorities, or third parties
                against you.
              </p>
              <p>
                <strong>Voluntary Assumption of Risk:</strong> You represent and warrant that you possess full authority to deploy
                this tool and you voluntarily accept and assume all risks inherent in third-party platform automation.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Architecture: Local Client-Side Data Handling
            </h2>
            <p>
              We believe in data minimization. The Extension operates predominantly within the local execution environment
              of your Google Chrome browser:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>No Central Scraping Server:</strong> When you execute a People, Company, or Candidate search, the
                extraction logic runs entirely inside your browser session using your existing LinkedIn login credentials.
                Scraped contact details, names, locations, and skills are processed locally.
              </li>
              <li>
                <strong>We Do Not Sell Your Scraped Leads:</strong> ProjectbyAI does not collect, store, aggregate, sell,
                rent, barter, or commercialize your extracted prospect lists or candidate databases.
              </li>
              <li>
                <strong>Local Storage:</strong> Your configuration parameters, search filter templates, and Google Sheet IDs
                are retained locally within Chrome's isolated storage sandbox (`chrome.storage.local` or `chrome.storage.sync`).
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Chrome Extension Permissions Disclosure
            </h2>
            <p>
              In strict adherence to the Google Chrome Web Store Developer Program Policies, the Extension requests only the
              minimum essential permissions necessary to perform its advertised functions:
            </p>
            <div className="bg-slate-100 p-3.5 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1.5">
              <p>
                <strong>• "activeTab" / "tabs":</strong> Used to detect when a valid LinkedIn search or profile page is open and
                interact with the active tab.
              </p>
              <p>
                <strong>• "storage":</strong> Used to store your user preferences, search filter presets, and license status locally.
              </p>
              <p>
                <strong>• "scripting":</strong> Required to run content extraction scripts on permitted LinkedIn DOM trees.
              </p>
              <p>
                <strong>• Host Permission (`https://*.linkedin.com/*`):</strong> Required exclusively to read public search results,
                trigger connection dialogs, and detect when pending invites are accepted.
              </p>
              <p>
                <strong>• Host Permission (`https://sheets.googleapis.com/*`):</strong> Required exclusively to append extracted lead
                rows into your chosen Google Spreadsheet via authorized OAuth 2.0.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Google API Services User Data Policy Compliance
            </h2>
            <p>
              The Extension's use and transfer of information received from Google APIs to any other app will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Google API Services User Data Policy
              </a>
              , including the <strong>Limited Use</strong> requirements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                We access Google Sheets data strictly to write or append extracted records to the specific spreadsheet
                selected by the user.
              </li>
              <li>
                We do not transfer Google user data to third parties, advertising platforms, data brokers, or information
                resellers.
              </li>
              <li>We do not use Google user data to serve advertisements or train generalized machine learning models.</li>
              <li>
                Human staff cannot read your Google Sheets contents unless you explicitly provide temporary access for customer
                debugging assistance.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">6.</span> User Designated as Sole Data Controller (GDPR / CCPA / Anti-Spam)
            </h2>
            <p>
              Under international data protection legislation including the European Union General Data Protection Regulation
              (GDPR), the California Consumer Privacy Act (CCPA), the CAN-SPAM Act, the UK Data Protection Act, and the TCPA:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>You (The User) are the Legal "Data Controller":</strong> You determine the purpose, criteria, and means
                of extracting and processing third-party personal data. You are legally responsible for possessing a valid lawful
                basis (e.g., legitimate interest, consent, or contract) to scrape, record, and contact any individual.
              </li>
              <li>
                <strong>Compliance with Anti-Spam Laws:</strong> When utilizing the personalized messaging and automated follow-up
                features, you warrant that your messages do not constitute unlawful spam, misleading solicitations, or deceptive
                advertising. You agree to immediately honor all opt-out, unsubscribe, or "do not contact" requests.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">7.</span> Unconditional Indemnification & Defense
            </h2>
            <p>
              You agree to fully defend, indemnify, and hold harmless projectbyAI, its parent company, directors, officers,
              employees, licensors, and agents from and against any and all claims, liabilities, lawsuits, judgments, fines,
              regulatory penalties, damages, losses, and expenses (including reasonable attorney's fees) arising out of or in any
              way connected with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your installation or use of the Extension;</li>
              <li>Your violation of any third-party platform policy (including LinkedIn User Agreement);</li>
              <li>Your violation of any applicable privacy, anti-spam, intellectual property, or data protection laws;</li>
              <li>Any message, solicitation, or content you dispatch to recipients using the Extension's automation engine.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">8.</span> Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p>
              The Extension is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis, with all faults
              and without warranty of any kind. ProjectbyAI disclaims all express, statutory, or implied warranties, including
              uninterrupted operation, error-free execution, or compatibility with future LinkedIn UI changes or Chrome engine
              updates.
            </p>
            <p>
              To the maximum extent permitted by law, projectbyAI's total aggregate liability for any claims arising from the
              Extension shall be strictly capped at the total amount actually paid by you to projectbyAI for the Extension, or
              $3.00 USD, whichever is greater.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">9.</span> Updates to this Policy
            </h2>
            <p>
              We reserve the right to amend this Privacy Policy at our sole discretion. Any changes will be published directly
              on this page with an updated Effective Date. Continued use of the Extension following updates constitutes your
              irrevocable acceptance of the modified Privacy Policy.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">10.</span> Contact & Legal Inquiries
            </h2>
            <p>
              If you have any questions, legal notices, or feedback regarding this Privacy Policy, please reach out to our team:
            </p>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
              <p>
                <strong>Company:</strong> projectbyAI
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:project.findproject@gmail.com" className="text-primary hover:underline font-semibold">
                  project.findproject@gmail.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://www.projectbyai.com" className="text-primary hover:underline font-semibold">
                  https://www.projectbyai.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/linkedin-extension"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to LinkedIn Extension Page
          </Link>
          <Link
            to="/linkedin-extension-terms"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            Read Terms of Service <Scale className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
