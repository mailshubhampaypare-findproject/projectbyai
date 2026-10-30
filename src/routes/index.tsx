import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import {
  GraduationCap,
  Sparkles,
  Code2,
  FileText,
  MessageCircleQuestion,
  Presentation,
  ArrowRight,
  Check,
  Instagram,
  Youtube,
  Linkedin,
  ChevronDown,
  ChevronUp,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <BrandLogo />
        <nav className="flex items-center gap-4">
          <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block">Blog</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-primary transition-colors">Project Library</Link>
          {loggedIn ? (
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
          <Sparkles className="h-3 w-3" /> Built for students, by student creators
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          Verified final-year projects with <span className="text-gradient">step-by-step tutorial videos.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore complete engineering projects with clean source code, architecture breakdowns, viva questions, and full video guides. Or upload your own project and earn <strong>70% to 90% royalties</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg" className="bg-gradient-primary shadow-elegant">
            <Link to="/projects">
              <Sparkles className="h-4 w-4 mr-2" /> Explore Project Library
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/contributor">Upload Project as Contributor</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Code2, title: "Verified Source Code", text: "Production-grade starter code, complete database schemas, and clean ZIP archives." },
            { icon: Video, title: "Step-by-Step Tutorials", text: "In-depth video tutorials explaining the project architecture and coding from scratch." },
            { icon: FileText, title: "Comprehensive README", text: "Complete academic manuals, setup commands, API specs, and viva question answers." },
            { icon: MessageCircleQuestion, title: "70% – 90% Royalties", text: "Upload your college project, help fellow students succeed, and earn weekly payouts." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border bg-card space-y-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 rounded-2xl bg-gradient-primary text-primary-foreground text-center shadow-elegant">
          <h2 className="text-3xl font-bold">Have a great project to share?</h2>
          <p className="mt-2 opacity-90">Sign up as a Contributor. Earn 70% standard or 90% with a full video tutorial.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/contributor">
              Open Contributor Hub <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
          <p className="text-muted-foreground">Follow these simple steps to learn, ship, or monetize your project.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Browse Project Marketplace", desc: "Search through complete academic and real-world projects across ML, Web, App & IoT." },
            { num: "02", title: "Watch Video Walkthrough", desc: "Understand every module, database table, and component before launching." },
            { num: "03", title: "Instant ZIP Download", desc: "Download verified source code, config files, and pre-seeded SQLite/SQL databases." },
            { num: "04", title: "Student Community Q&A", desc: "Ask doubts directly to the project contributor and get help within hours." },
            { num: "05", title: "Ace Viva & Presentations", desc: "Use bundled academic reports, slide decks, and model viva answers to score top grades." },
            { num: "06", title: "Become a Contributor", desc: "Upload your own projects, teach other students, and earn up to 90% payout." }
          ].map((step) => (
            <div key={step.num} className="p-6 rounded-xl border bg-card hover:border-primary/30 transition-all flex flex-col justify-between space-y-4">
              <span className="text-2xl font-black text-primary/45 tracking-wider">{step.num}</span>
              <div>
                <h3 className="font-bold text-base text-slate-800 leading-snug">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Everything you need to know about building with ScholarBuild.</p>
        </div>
        <div className="space-y-1 border-t">
          {[
            {
              q: "Do I need coding experience to use ScholarBuild?",
              a: "Not at all. ScholarBuild is designed for beginners. Just describe your project idea — we handle the rest, including code, docs, and reports."
            },
            {
              q: "What kinds of projects can I build?",
              a: "Web apps, Python projects, React apps, Flask & Django backends, final-year projects, and resume-grade portfolio pieces."
            },
            {
              q: "Can I modify the generated project later?",
              a: "Yes. Every project includes an AI chat that can modify code, add features, switch databases, or generate new docs on demand."
            },
            {
              q: "What do I get when I download a project?",
              a: "A clean .zip with full source code, README, documentation, project report (PDF), PPT content, and an interview Q&A guide."
            },
            {
              q: "Is there a free plan?",
              a: "Yes — the Starter plan is free forever and lets you generate one full project per month."
            }
          ].map((faq, idx) => (
            <div key={idx} className="border-b py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                type="button"
                className="flex justify-between items-center w-full text-left font-bold text-base py-2 hover:text-primary transition-colors gap-4 text-slate-800"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-4 w-4 text-primary shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
              <div
                className={`transition-all overflow-hidden duration-350 ${
                  openFaq === idx ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-muted-foreground leading-relaxed pb-2">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
