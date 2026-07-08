import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — projectbyAI" }] }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Effective Date: July 8, 2026</p>
        </div>

        <div className="text-xs leading-relaxed text-slate-600 space-y-4 font-normal">
          <p>
            Welcome to ProjectByAI (accessible from <a href="https://www.projectbyai.com/" className="text-primary hover:underline font-medium">https://www.projectbyai.com/</a>). Your privacy is extremely important to us. This Privacy Policy document outlines the types of personal information we collect, how we use it, and the steps we take to ensure your data remains secure.
          </p>

          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">1. Information We Collect</h2>
            <p>
              We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our website better. We collect this data in two ways:
            </p>
            
            <div className="pl-4 space-y-2">
              <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">A. Information You Provide Voluntarily</h3>
              <p>
                <strong>Account & Contact Details:</strong> If you register an account, sign up for a newsletter, or contact us directly, we may collect your name, email address, phone number, and any other details you choose to provide.
              </p>
              <p>
                <strong>User Content:</strong> Any text, prompts, or feedback you submit while interacting with our AI tools or services.
              </p>

              <h3 className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider pt-1">B. Information Collected Automatically</h3>
              <p>
                <strong>Log Files:</strong> Like most websites, we automatically gather certain information and store it in log files. This includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and the number of clicks.
              </p>
              <p>
                <strong>Cookies and Tracking Technologies:</strong> We use cookies to store information about visitors' preferences, to record user-specific information on which pages the user accesses or visits, and to personalize our web page content based on visitors' browser type or other information.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, operate, and maintain our website and AI services.</li>
              <li>Improve, personalize, and expand our website features and user experience.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Develop new products, services, features, and functionality.</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
              <li>Send you emails (such as system updates or newsletters).</li>
              <li>Find and prevent fraud or malicious activity.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">3. How We Share Your Information</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. We may share your data only in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with trusted third-party vendors (such as hosting providers, payment processors, or email delivery services) to help us run our website and business. These vendors are strictly obligated to use your data only to perform services for us.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your information if required to do so by law, or in response to valid requests by public authorities (e.g., a court or a government agency).
              </li>
              <li>
                <strong>Business Transfers:</strong> If ProjectByAI is involved in a merger, acquisition, or asset sale, your personal information may be transferred as part of that business transaction.
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">4. Third-Party Links & AI Processors</h2>
            <p>
              Our website may contain links to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
            <p>
              Additionally, because we provide AI-driven experiences, we may utilize third-party AI models and processing pipelines (such as OpenAI, Anthropic, or Google Cloud APIs). Your text prompts are processed to generate responses, but we ensure these third-party processors handle your data strictly in accordance with modern security practices and data processing agreements.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">5. Your Data Protection Rights (GDPR / CCPA)</h2>
            <p>Depending on your location, you may have specific rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data.</li>
              <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li><strong>The Right to Erasure ("The Right to be Forgotten"):</strong> You have the right to request that we erase your personal data under certain conditions.</li>
              <li><strong>The Right to Restrict or Object to Processing:</strong> You have the right to request that we restrict or object to the processing of your personal data under certain conditions.</li>
              <li><strong>The Right to Data Portability:</strong> You have the right to request that we transfer the data we have collected to another organization, or directly to you.</li>
            </ul>
            <p className="pt-1">
              If you would like to exercise any of these rights, please contact us using the information provided below.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">6. Security of Your Data</h2>
            <p>
              The security of your personal information is vital to us. We implement commercially acceptable technical and organizational measures to safeguard your data against unauthorized access, loss, destruction, or alteration. However, please remember that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">7. Children's Privacy</h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. ProjectByAI does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately, and we will do our best efforts to promptly remove such information from our records.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-850">9. Contact Us</h2>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
              <br />
              <strong>Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline font-semibold">https://www.projectbyai.com/contact</Link>
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
