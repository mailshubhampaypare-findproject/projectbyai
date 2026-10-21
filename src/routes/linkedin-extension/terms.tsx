import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Scale, ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/linkedin-extension/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — LinkedIn Automation Chrome Extension | projectbyAI" },
      {
        name: "description",
        content:
          "Terms of Service and End User License Agreement (EULA) for the LinkedIn Automation Chrome Extension. Review user liability, platform risk assumption, and license terms.",
      },
    ],
  }),
  component: LinkedinExtensionTermsPage,
});

function LinkedinExtensionTermsPage() {
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 flex-1 space-y-8">
        {/* Title Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Scale className="h-3 w-3" /> End User License Agreement & Terms of Service
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Terms of Service & EULA
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            LinkedIn Automation Chrome Extension • Effective Date: October 2026 • Version 2.4
          </p>
        </div>

        {/* High-Contrast Priority Legal Callout */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            Important Notice Regarding Platform Rules & Limitation of Liability
          </div>
          <p>
            Please read these Terms of Service ("Terms") carefully. By installing, downloading, enabling, or using the
            LinkedIn Automation Chrome Extension ("Extension"), you enter into a legally binding agreement with projectbyAI
            ("Company", "We", "Us").
          </p>
          <p>
            You expressly acknowledge that <strong>all use of this Extension is at your own sole risk and discretion</strong>.
            You assume full legal, technical, and commercial responsibility for compliance with LinkedIn Corporation's User
            Agreement and applicable laws. ProjectbyAI accepts <strong>zero liability</strong> for any account restrictions,
            suspensions, or claims.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="text-xs leading-relaxed text-slate-700 space-y-6 font-normal">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Acceptance of Terms & Eligibility
            </h2>
            <p>
              By accessing, installing, or utilizing the Extension, you represent and warrant that you are at least 18 years
              of age and possess the legal capacity to enter into these binding Terms. If you are using this Extension on
              behalf of a company, business, or other legal entity, you represent that you possess the requisite authority to
              bind such entity to these Terms.
            </p>
            <p>
              If you do not agree unconditionally to each and every provision in these Terms, you must immediately uninstall
              and delete the Extension from your web browser and cease all use.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> Software Nature & Non-Affiliation Declaration
            </h2>
            <p>
              The Extension is an independent browser automation and client-side productivity software tool.
            </p>
            <p>
              <strong>Non-Affiliation:</strong> The Extension is{" "}
              <strong>
                NOT affiliated with, sponsored by, endorsed by, maintained by, or officially associated with LinkedIn
                Corporation, Microsoft Corporation, Google LLC, or Alphabet Inc.
              </strong>
            </p>
            <p>
              "LinkedIn" is a registered trademark of LinkedIn Corporation. "Chrome" and "Google Sheets" are registered
              trademarks of Google LLC. Reference to these brands is purely descriptive to explain functionality and
              browser compatibility.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Explicit Assumption of Platform Enforcement Risks
            </h2>
            <p>
              You understand and acknowledge that LinkedIn Corporation enforces policies prohibiting automated scraping,
              unauthorized data extraction, robotic web browsing, and mass connection or messaging campaigns.
            </p>
            <div className="pl-3 border-l-2 border-slate-300 space-y-2 font-medium text-slate-800">
              <p>
                <strong>Sole Risk of the User:</strong> You understand that deploying automation tools carries the inherent risk
                that LinkedIn Corporation may detect automated patterns, issue CAPTCHAs, throttle your search queries, impose
                weekly invitation limits, temporarily restrict profile functions, or permanently suspend or terminate your
                LinkedIn account.
              </p>
              <p>
                <strong>Complete Release & Zero Liability:</strong> You irrevocably release, waive, and discharge projectbyAI,
                its founders, directors, employees, and contractors from any and all liability, loss, damages, lost revenue,
                lost prospective leads, or brand harm resulting from any administrative action or technical restriction
                implemented by LinkedIn Corporation against your account.
              </p>
              <p>
                <strong>User Setting Prudence:</strong> You are strictly responsible for setting safe execution limits, message
                delays, and volumes within the Extension's configuration interface.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> License Grant & Prohibited Uses
            </h2>
            <p>
              Subject to your compliance with these Terms, projectbyAI grants you a limited, non-exclusive, non-transferable,
              revocable license to install and run the Extension on your personal or company web browser solely for internal
              lead generation and recruitment workflow purposes.
            </p>
            <p className="font-semibold text-slate-800">You expressly agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Decompile, reverse engineer, disassemble, or attempt to derive the source code of the Extension;</li>
              <li>Resell, sublicense, lease, rent, redistribute, or package the Extension to third parties;</li>
              <li>Bypass or tamper with license verification systems or search volume rate limits;</li>
              <li>Use the Extension for unlawful stalking, harassment, defamation, espionage, or malicious scraping;</li>
              <li>Deploy the Extension to distribute malicious software, phishing links, or deceitful marketing campaigns.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Pricing, Free Trial & Strict No-Refund Policy
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Free Trial Tier:</strong> We provide up to 100 free searches to allow full technical evaluation of the
                People, Company, and HR candidate engines and Google Sheets export before purchasing.
              </li>
              <li>
                <strong>Unlimited Access Tier:</strong> The Unlimited Access plan is unlocked for a single fee of $3.00 USD.
              </li>
              <li>
                <strong>Absolute No-Refund Policy:</strong> Due to the immediate digital delivery and cryptographic unlocking
                of browser extension capabilities upon transaction completion,{" "}
                <strong>all sales and purchases are strictly non-refundable and final</strong> to the maximum extent permitted by
                governing law.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">6.</span> Compliance with Anti-Spam & International Privacy Laws
            </h2>
            <p>
              When using the automated connection message and acceptance follow-up bot, you are strictly liable for the
              content of your messages and compliance with all global telecommunication and electronic marketing statutes,
              including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The United States CAN-SPAM Act & TCPA;</li>
              <li>The European Union GDPR and ePrivacy Directive (PECR);</li>
              <li>Canada's Anti-Spam Legislation (CASL);</li>
              <li>The UK Data Protection Act 2018.</li>
            </ul>
            <p>
              You warrant that you will not dispatch misleading headers, fraudulent representations, or unsolicited mass
              spam, and that you will immediately cease messaging any recipient who opts out or requests removal.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">7.</span> Disclaimer of All Warranties ("AS-IS" Basis)
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE EXTENSION IS PROVIDED ON AN <strong>"AS IS"</strong> AND{" "}
              <strong>"AS AVAILABLE"</strong> BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR
              OTHERWISE.
            </p>
            <p>
              PROJECTBYAI EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>THE EXTENSION WILL MEET YOUR SALES OR LEAD CONVERSION REQUIREMENTS;</li>
              <li>THE SOFTWARE WILL OPERATE UNINTERRUPTED OR ERROR-FREE;</li>
              <li>THE EXTENSION WILL BE IMMUNE TO DETECTION OR CHANGES IN THIRD-PARTY PLATFORM CODE (LINKEDIN UI UPDATES);</li>
              <li>DATA SYNCED TO GOOGLE SHEETS WILL ALWAYS BE ACCURATE OR RETRIEVABLE WITHOUT GOOGLE API DOWNTIME.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">8.</span> Strict Limitation of Liability (Capped at $3.00 USD)
            </h2>
            <p>
              IN NO EVENT SHALL PROJECTBYAI, ITS DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE TO YOU OR ANY THIRD
              PARTY FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
              PROFITS, LOSS OF LINKEDIN ACCOUNT PRIVILEGES, BUSINESS INTERRUPTION, LOSS OF LEADS, OR REPUTATIONAL DAMAGE, EVEN
              IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR ENTIRE AGGREGATE LIABILITY TO YOU FOR ANY CAUSE
              WHATSOEVER, AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY,
              BY YOU TO PROJECTBYAI FOR THE EXTENSION, STRICTLY CAPPED AT <strong>$3.00 USD</strong>.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">9.</span> Comprehensive Indemnification
            </h2>
            <p>
              You agree to defend, indemnify, and hold harmless projectbyAI, its successors, officers, employees, and
              affiliates from and against any and all claims, demands, liabilities, damages, losses, costs, and expenses
              (including reasonable attorney's fees) resulting from or related to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your use, misuse, or deployment of the Extension;</li>
              <li>Any breach by you of these Terms or applicable privacy and marketing laws;</li>
              <li>Any claim or legal action initiated against you or us by LinkedIn Corporation or third-party targets;</li>
              <li>The content or transmission of any connection note or follow-up message sent through the tool.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">10.</span> Termination & Revocation of License
            </h2>
            <p>
              We reserve the right, without prior notice and at our sole discretion, to terminate your license and access to
              the Extension if you violate any provision of these Terms or if requested by legal or regulatory authorities.
              Upon termination, you must cease all use and uninstall the Extension.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">11.</span> Governing Law & Severability
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of
              law principles. If any provision of these Terms is deemed invalid or unenforceable by a court of competent
              jurisdiction, that provision will be severed, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">12.</span> Contact & Inquiries
            </h2>
            <p>For questions or support regarding these Terms, please contact us at:</p>
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
            to="/linkedin-extension/privacy"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            Read Privacy Policy <FileText className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
