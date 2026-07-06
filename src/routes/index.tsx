import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-primary" /> <span className="text-gradient">ScholarBuild</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block">Blog</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block">Project Library</Link>
          {loggedIn ? (
            <Button asChild className="bg-gradient-primary shadow-elegant">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
              <Button asChild className="bg-gradient-primary shadow-elegant">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
          <Sparkles className="h-3 w-3" /> Built for students, by students
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          Your final-year project, <span className="text-gradient">shipped in a weekend.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Chat with an AI mentor that writes your code, drafts your project report, generates viva questions, and builds your presentation slides — all in one workspace.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg" className="bg-gradient-primary shadow-elegant">
            <Link to={loggedIn ? "/dashboard" : "/auth"}>
              <Sparkles className="h-4 w-4 mr-2" /> Start building free
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/projects">Browse project library</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Code2, title: "AI code builder", text: "Describe your idea, get working source code in your chat." },
            { icon: FileText, title: "Auto reports", text: "A complete project report with tech stack, versions & steps." },
            { icon: MessageCircleQuestion, title: "Viva prep", text: "20 model interview/viva Q&A tailored to your project." },
            { icon: Presentation, title: "Slide decks", text: "10-slide presentation ready to show your teacher." },
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
          <h2 className="text-3xl font-bold">Ready to build something great?</h2>
          <p className="mt-2 opacity-90">Free forever plan — no credit card required.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to={loggedIn ? "/dashboard" : "/auth"}>
              Open ScholarBuild <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">How it works</h2>
          <p className="text-muted-foreground">Follow these 6 simple steps to design, generate, and ship your project.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Describe your project idea", desc: "Tell us in plain English what you want to build." },
            { num: "02", title: "Answer AI requirement questions", desc: "A short guided questionnaire — no jargon." },
            { num: "03", title: "Review project blueprint", desc: "Confirm stack, features, and deliverables." },
            { num: "04", title: "Generate project", desc: "AI writes code, docs, reports, and slides." },
            { num: "05", title: "Modify with AI chat", desc: "Refactor, add features, fix bugs by chatting." },
            { num: "06", title: "Download project assets", desc: "Export a clean .zip with everything ready." }
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
      <footer className="border-t py-16 bg-card">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="h-6 w-6 text-primary" /> <span>ScholarBuild</span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              An AI-powered workspace mapping and generating source code, slideshows, reports, and viva answers for engineering student projects.
            </p>
            <div className="flex gap-2.5 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="flex md:justify-end">
            <div className="flex flex-col gap-2.5 text-muted-foreground font-medium md:text-right">
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link to="/projects" className="hover:text-primary transition-colors">Project Library</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 border-t mt-12 pt-6 text-center text-xs text-muted-foreground">
          © 2026 Eduprojects Solution. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
