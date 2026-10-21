import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import {
  Users,
  Building2,
  Briefcase,
  FileSpreadsheet,
  Send,
  Bot,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  HelpCircle,
  FileText,
  AlertTriangle,
  Scale,
  Clock,
  Download,
  Share2
} from "lucide-react";

export const Route = createFileRoute("/linkedin-extension")({
  head: () => ({
    meta: [
      { title: "LinkedIn Automation Chrome Extension — People, Company & HR Search | projectbyAI" },
      {
        name: "description",
        content:
          "Supercharge your LinkedIn lead generation. Advanced People, Company, and HR Candidate search with Google Sheets sync, automated connection requests, and auto-detected follow-up messaging.",
      },
    ],
  }),
  component: LinkedinExtensionPage,
});

type FeatureTab = "people" | "company" | "hr";

function LinkedinExtensionPage() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("people");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs hidden sm:inline-flex">
              Chrome Extension
            </Badge>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#workflow" className="hover:text-primary transition-colors">Google Sheet Sync</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
            <Link to="/linkedin-extension-privacy" className="hover:text-primary transition-colors text-xs text-slate-500">
              Privacy Policy
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild className="bg-gradient-primary shadow-elegant font-semibold text-xs sm:text-sm">
              <a href="#pricing">
                Install Extension <Zap className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Next-Gen Chrome Extension • 3-in-1 LinkedIn Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Find Targeted Leads, Sync to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Google Sheets</span> & Auto-Send Follow-Ups
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The all-in-one LinkedIn Chrome extension built for sales, founders, and recruiters. Filter by role, industry, or candidate skills, stream data directly to Google Sheets, and automatically message accepted connections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-primary shadow-lg hover:shadow-xl font-bold px-8 text-base">
              <a href="#pricing">
                Start Free Trial (100 Searches)
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto font-semibold border-slate-300 hover:bg-slate-100 text-slate-800">
              <a href="#features">
                Explore 3 Search Engines <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100 Free Searches
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Real-time Google Sheet Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Auto Follow-up Bot
            </span>
          </div>
        </div>

        {/* Extension Interactive UI Preview Box */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            {/* Window bar */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">LinkedIn Extension v2.4 • Chrome Popup</span>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-950/30 text-[10px] py-0">
                Connected to Google Sheets
              </Badge>
            </div>

            {/* Inner Simulated Extension Dashboard */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Tab Selector in preview */}
              <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setActiveTab("people")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "people"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Users className="h-4 w-4" /> People Search
                </button>
                <button
                  onClick={() => setActiveTab("company")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "company"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> Company Search
                </button>
                <button
                  onClick={() => setActiveTab("hr")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === "hr"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="h-4 w-4" /> HR / Candidate
                </button>
              </div>

              {/* Dynamic Tab Mock Data */}
              {activeTab === "people" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-blue-400" /> Active People Filters:
                    </span>
                    <span className="text-emerald-400 font-mono">1,420 Verified Profiles Found</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Role: VP Engineering / CTO</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Location: San Francisco / Remote</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Exp: 8+ Years</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Skills: React, Node, AI</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Domain: SaaS / Cloud</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Cert: AWS Certified Solutions Architect</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 font-semibold">
                      <span>Live Queue Extractor</span>
                      <span className="text-blue-400">Syncing to Google Sheets → Row 104</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Alex Chen — VP of Engineering @ CloudFlow</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Invite Sent & Recorded</Badge>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Sarah Miller — Head of AI @ NexaLabs</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">Accepted • Follow-up Triggered</Badge>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "company" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-blue-400" /> Active Company Filters:
                    </span>
                    <span className="text-emerald-400 font-mono">380 Targeted Companies Found</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Industry: FinTech & B2B Software</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Size: 51 - 200 Employees</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Location: United States, UK, India</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Type: Venture-Backed Series A/B</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 font-semibold">
                      <span>Extracted Organization Pipeline</span>
                      <span className="text-blue-400">Auto-appended to Google Sheet</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• PaySphere Inc — 120 Employees • Series A FinTech</span>
                      <span className="text-slate-400">HQ: London • Exported</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• DataForge Systems — 85 Employees • Cloud Infra</span>
                      <span className="text-slate-400">HQ: Austin, TX • Exported</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hr" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-blue-400" /> Active HR & Candidate Filters:
                    </span>
                    <span className="text-emerald-400 font-mono">650 Open-to-Work Candidates</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Target Role: Full Stack / DevOps Engineer</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Skills: Kubernetes, Docker, TypeScript</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Location: Remote / Bengaluru / New York</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Experience: 3 - 6 Years</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Education: B.Tech / M.S. Computer Science</span>
                    <span className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-300">Cert: CKA / HashiCorp Certified</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 font-semibold">
                      <span>Talent Pipeline Synced</span>
                      <span className="text-blue-400">Automated Outreach Active</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Rahul Sharma — Sr. React & Node Developer (Open to Work)</span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">Invite Sent with Note</Badge>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Emily Watson — DevOps Engineer (CKA Certified)</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Accepted • Interview Link Sent</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Features Detailed Breakdown */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs uppercase tracking-wider font-semibold">
            Three Dedicated Modes
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered for Precision Prospecting
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Unlike generic scrapers, this extension features three purpose-built search modes engineered to isolate decision-makers, target corporations, and scout hiring candidates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: People Search */}
          <Card className="border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <CardContent className="p-7 space-y-5">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">1. People Search</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Specifically built for B2B outreach, sales prospecting, and networking with key decision-makers across any market.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Granular Search Filters:</p>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Role & Type:</strong> Founder, CEO, VP, Director, Engineer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Location:</strong> City, Country, or Postal radius</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Experience:</strong> Entry, Mid, Senior, C-Level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Skill:</strong> Specific technical and functional skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Company Domain:</strong> Target organizations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Education:</strong> Degrees, colleges & alumni groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span><strong>Certification:</strong> Professional licenses & badges</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Company Search */}
          <Card className="border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <CardContent className="p-7 space-y-5">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">2. Company Search</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Target organizations matching your Ideal Customer Profile (ICP), map vendor databases, and analyze competition.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Granular Search Filters:</p>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Company Domain / Industry:</strong> FinTech, EdTech, SaaS, Healthcare</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Employee Size:</strong> 1-10, 11-50, 51-200, 501-1000, 1000+</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Location:</strong> Headquarters & operational presence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Type of Company:</strong> Public, Private, Venture Startup, Non-Profit</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: HR / Candidate Search */}
          <Card className="border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <CardContent className="p-7 space-y-5">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">3. HR / Candidate Search</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Formulated specifically for recruiters, hiring managers, and headhunters seeking candidates actively ready for hiring.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Granular Search Filters:</p>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Job Title:</strong> Current or target roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Skill Sets:</strong> Required programming, tools & domain knowledge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Location & Relocation:</strong> Remote or local availability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Education:</strong> Academic credentials & certifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Experience Track:</strong> Total years in active production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span><strong>Certification:</strong> Official verified badges</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Google Sheets Sync & Auto Acceptance Detection Workflow */}
      <section id="workflow" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs uppercase tracking-wider font-semibold">
              Live Google Sheets & Intelligent Automation
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How the End-to-End Pipeline Works
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              No manual copy-pasting. Filter data, auto-export rows to Google Sheets, send personalized connection requests, and let the bot auto-detect acceptance to trigger follow-up messages.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30">01</span>
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Filter & Extract</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by People, Company, or Candidate criteria. The extension extracts full public profile attributes with a single click.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <span className="text-3xl font-black text-emerald-600/30">02</span>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Direct Google Sheets Sync</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracted records stream directly into your designated Google Sheet columns: Full Name, Role, Company, Location, Profile URL, and Status.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <span className="text-3xl font-black text-indigo-600/30">03</span>
              <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Send className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Personalized Connect</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-generate connection invitations with custom dynamic variables such as {"{{firstName}}"} and {"{{company}}"}.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 relative">
              <span className="text-3xl font-black text-purple-600/30">04</span>
              <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Auto-Detect & Follow-Up</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When a recipient accepts your connection, the bot automatically detects the acceptance and immediately delivers your tailored follow-up message!
              </p>
            </div>
          </div>

          {/* Interactive Google Sheet Mock Table */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xl overflow-x-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-slate-200 font-mono">Google Sheet: LinkedIn_Prospects_Master.xlsx</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">Live Sync Active • Auto-Appended</span>
            </div>
            <table className="w-full text-left text-xs font-mono mt-3">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Candidate / Lead Name</th>
                  <th className="py-2 px-3">Designation / Role</th>
                  <th className="py-2 px-3">Company / Domain</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3">Invite Status</th>
                  <th className="py-2 px-3">Auto Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 text-slate-500">1</td>
                  <td className="py-2.5 px-3 font-semibold text-white">Vikram Malhotra</td>
                  <td className="py-2.5 px-3">Chief Technology Officer</td>
                  <td className="py-2.5 px-3">SaaS / Enterprise AI</td>
                  <td className="py-2.5 px-3">Bengaluru, IN</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">Accepted</td>
                  <td className="py-2.5 px-3 text-blue-400 font-semibold">Sent automatically</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-500">2</td>
                  <td className="py-2.5 px-3 font-semibold text-white">Jessica Taylor</td>
                  <td className="py-2.5 px-3">VP of Talent Acquisition</td>
                  <td className="py-2.5 px-3">Global HealthTech</td>
                  <td className="py-2.5 px-3">New York, USA</td>
                  <td className="py-2.5 px-3 text-amber-400 font-semibold">Pending</td>
                  <td className="py-2.5 px-3 text-slate-400">Armed on accept</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-slate-500">3</td>
                  <td className="py-2.5 px-3 font-semibold text-white">Arjun Nair</td>
                  <td className="py-2.5 px-3">Lead Full-Stack Architect</td>
                  <td className="py-2.5 px-3">FinTech Systems</td>
                  <td className="py-2.5 px-3">Remote / Singapore</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">Accepted</td>
                  <td className="py-2.5 px-3 text-blue-400 font-semibold">Sent automatically</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs uppercase tracking-wider font-semibold">
            Simple & Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Start Free, Upgrade for Just $3
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Test all features with 100 free searches. Unlock unlimited searches, Google Sheets streaming, and auto follow-up bot for life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border border-slate-200 bg-white p-8 space-y-6 flex flex-col justify-between rounded-2xl shadow-sm">
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="text-slate-700 border-slate-300 font-semibold">
                  Free Trial
                </Badge>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">100 Searches Limit</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for testing all 3 search engines & export</p>
              </div>

              <div>
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm ml-1.5">/ forever free trial</span>
              </div>

              <Button variant="outline" className="w-full font-bold border-slate-300 hover:bg-slate-50 text-slate-800">
                Add to Chrome — Free Trial
              </Button>

              <ul className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span><strong>100 Search Limit</strong> (People, Company, HR)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>All Filter Criteria Enabled</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Direct Google Sheets Export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Personalized Connection Message Preview</span>
                </li>
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 text-center">No credit card or payment required.</p>
          </Card>

          {/* Paid Tier: $3 Unlimited */}
          <Card className="border-2 border-blue-600 bg-white p-8 space-y-6 flex flex-col justify-between rounded-2xl shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
              Unlimited Access Deal
            </div>

            <div className="space-y-4">
              <div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 font-semibold">
                  Most Popular
                </Badge>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">Unlimited Access</h3>
                <p className="text-xs text-slate-500 mt-1">Full power for founders, recruiters & lead generation</p>
              </div>

              <div>
                <span className="text-4xl font-extrabold text-slate-900">$3</span>
                <span className="text-slate-500 text-sm ml-1.5">/ one-time access</span>
              </div>

              <Button className="w-full bg-gradient-primary shadow-lg hover:shadow-xl font-bold text-white">
                Get Unlimited Access for $3
              </Button>

              <ul className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span><strong>Unlimited Searches</strong> (No search volume caps)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span><strong>Full Google Sheets Auto-Sync</strong> with no row limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span><strong>Auto Connection Dispatcher</strong> with dynamic tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span><strong>Smart Acceptance Detection Bot</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span><strong>Automated Follow-Up Messages</strong> upon acceptance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>All future extension updates & feature additions</span>
                </li>
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 text-center">Instant unlock after payment.</p>
          </Card>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Everything you need to know about the extension, sync & safety limits.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is included in the 100 free searches trial?",
                a: "You get full, unrestricted access to the People, Company, and HR search engines with up to 100 extracted profiles and Google Sheets synchronization. No credit card or upfront deposit required.",
              },
              {
                q: "How does the Google Sheets sync feature work?",
                a: "When you install the Chrome extension and connect your Google account via OAuth, the extension creates or attaches to your preferred Google Spreadsheet. Every time you extract profiles or companies, columns (Full Name, Role, Company, Location, Profile URL, Status) are populated in real-time.",
              },
              {
                q: "How does the bot automatically detect accepted connection requests?",
                a: "The extension includes an automated listener that monitors your LinkedIn connection list. As soon as a target accepts your invitation, the extension updates the status in your Google Sheet and immediately dispatches your pre-configured personalized follow-up message.",
              },
              {
                q: "Is the extension safe for my LinkedIn account?",
                a: "The extension is designed to replicate natural human browsing cadences and allows you to set recommended daily search, connection, and message rate limits. However, because LinkedIn enforces strict anti-automation terms, all automation usage is at the user's sole risk and discretion as detailed in our Terms of Service.",
              },
              {
                q: "What happens after the 100 free searches are consumed?",
                a: "Once you hit 100 searches, you can seamlessly unlock unlimited searches, unlimited Google Sheets syncing, and automated follow-ups for a single one-time payment of $3.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors text-sm"
                >
                  <span>{item.q}</span>
                  <span className="text-slate-400 text-lg">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strict Legal Notice & Mandatory Disclaimers Banner */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Independent Browser Utility & Strict Legal Disclaimer
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                This extension is an independent productivity utility developed by projectbyAI and is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with LinkedIn Corporation, Microsoft Corporation, Google LLC, or Alphabet Inc.</strong> The names "LinkedIn", "Google", and "Chrome" as well as related names, marks, emblems, and images are registered trademarks of their respective owners.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Sole User Responsibility:</strong> The user bears 100% sole and exclusive responsibility for compliance with LinkedIn's User Agreement, anti-automation restrictions, privacy regulations (GDPR/CCPA), and applicable anti-spam laws (CAN-SPAM). Any account restrictions, rate limits, suspensions, or third-party legal claims resulting from use of this tool are the sole liability of the user. ProjectbyAI accepts zero liability.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex items-center gap-6">
              <Link
                to="/linkedin-extension-privacy"
                className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" /> Read LinkedIn Extension Privacy Policy
              </Link>
              <Link
                to="/linkedin-extension-terms"
                className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1.5 transition-colors"
              >
                <Scale className="h-4 w-4" /> Read Extension Terms of Service
              </Link>
            </div>
            <span className="text-slate-500 font-normal">v2.4 • Last Updated October 2026</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
