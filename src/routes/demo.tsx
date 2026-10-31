import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  FileCode,
  Video,
  HelpCircle,
  GraduationCap,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Download,
  BookOpen,
  Cpu,
  Smartphone,
  Globe,
  Database,
  Lock,
  Code2,
  Terminal,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Projectbyai Demo — Verified Final-Year Engineering Projects" },
      {
        name: "description",
        content:
          "Explore tested final-year student projects with source code, IEEE reports, viva defense FAQs, and video walkthroughs.",
      },
    ],
  }),
  component: DemoHomePage,
});

// Category pills for quick hero search
const QUICK_DOMAINS = [
  { label: "AI & Machine Learning", icon: Cpu, category: "Machine Learning" },
  { label: "Full Stack Web", icon: Globe, category: "Web Development" },
  { label: "Mobile Apps (Flutter)", icon: Smartphone, category: "Mobile Apps" },
  { label: "Blockchain & Web3", icon: Database, category: "Blockchain" },
  { label: "Cybersecurity & Cloud", icon: Lock, category: "Cybersecurity" },
];

const DELIVERABLES = [
  {
    icon: FileCode,
    title: "Zero-Error Source Code",
    desc: "100% working, modular code with clean directory separation, setup scripts, and requirements.",
    tag: "Run-Tested",
    tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200",
  },
  {
    icon: FileText,
    title: "IEEE Format Documentation",
    desc: "Complete 60–90 page college report with ER diagrams, DFD levels 0-2, UML charts, and references.",
    tag: "University Ready",
    tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200",
  },
  {
    icon: HelpCircle,
    title: "College Viva Defense FAQs",
    desc: "Top 25 examiner viva questions with model answers, algorithm trade-offs, and architecture defense.",
    tag: "Examiner Tested",
    tagColor: "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200",
  },
  {
    icon: Video,
    title: "Step-by-Step Video Walkthrough",
    desc: "High-definition video guide explaining how to install, configure the database, and run locally in minutes.",
    tag: "10-Min Setup",
    tagColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200",
  },
];

const FAQS = [
  {
    q: "Can I customize the project for my college requirements?",
    a: "Yes, absolutely! You receive complete uncompiled source code in a ZIP archive with full editing rights. You can easily add your college logo, modify the database schema, add custom API endpoints, or change styling.",
  },
  {
    q: "Is the project report formatted according to university standards?",
    a: "Yes. Every project includes a professionally formatted project synopsis and final report (Word .docx and PDF) formatted according to standard university IEEE guidelines, complete with system flowcharts, database normalization (3NF), and literature survey.",
  },
  {
    q: "What if I get stuck while setting up or running the code locally?",
    a: "You get access to our Student Community Q&A where you can ask questions directly about your project setup. Verified project authors and community contributors actively answer setup questions and provide troubleshooting tips.",
  },
  {
    q: "Are viva defense questions and presentation slides included?",
    a: "Yes! Every single project package comes with a dedicated College Viva Defense Cheat Sheet covering the top 20–25 examiner viva questions, plus presentation slides (PPT) to help you present with confidence.",
  },
  {
    q: "How fast do I receive the project after acquisition?",
    a: "Access is 100% instantaneous. As soon as you acquire a project, you receive direct one-click download access to the complete source code ZIP, report files, and video tutorial in your dashboard.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aman Tripathi",
    college: "VIT Vellore",
    branch: "B.Tech CSE",
    rating: 5,
    text: "Saved me at least 3 weeks of sleepless nights. The Flask + OpenCV attendance project ran on my laptop in 10 minutes, and the viva questions were almost identical to what our external examiner asked!",
  },
  {
    name: "Rhea Deshmukh",
    college: "Mumbai University",
    branch: "B.E. Information Technology",
    rating: 5,
    text: "The documentation report was super thorough. It had all the UML diagrams, 3NF schema tables, and architecture explanations ready. My project guide approved it on the very first review.",
  },
  {
    name: "Karthik Nair",
    college: "SRM University",
    branch: "MCA",
    rating: 5,
    text: "I was super worried about my final viva presentation. The viva defense cheat sheet explained the exact architectural trade-offs between MongoDB and PostgreSQL that our professor grilled me on.",
  },
];

function DemoHomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));

    async function loadProjects() {
      try {
        const { data } = await supabase
          .from("library_projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(PREBUILT_PROJECTS);
        }
      } catch (err) {
        setProjects(PREBUILT_PROJECTS);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickDomainClick = (catName: string) => {
    setSelectedCategory(selectedCategory === catName ? null : catName);
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      !selectedCategory ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Machine Learning" && p.category?.toLowerCase().includes("learning")) ||
      (selectedCategory === "Web Development" && p.category?.toLowerCase().includes("web"));

    const matchesQuery =
      searchQuery.trim() === "" ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(p.tech) && p.tech.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesQuery;
  });

  const categories = ["All Projects", "Machine Learning", "Web Development", "Mobile Apps", "Blockchain", "Cybersecurity"];

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-foreground flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* --------------------------------------------------------------------------------- */}
      {/* 1. HEADER & TOP NAVIGATION */}
      {/* --------------------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-200/50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-4">
          <BrandLogo />

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
            <a href="#deliverables" className="hover:text-foreground transition-colors">
              What's Included
            </a>
            <a href="#project-showcase" className="hover:text-foreground transition-colors">
              Project Library
            </a>
            <Link to="/dashboard/community" className="hover:text-foreground transition-colors">
              Community Q&A
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Viva Guides & Blog
            </Link>
            <Link to="/contributor" className="hover:text-amber-700 transition-colors font-semibold text-amber-700/90 dark:text-amber-400">
              Contributor Hub
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <Button asChild className="bg-gradient-primary shadow-elegant font-semibold text-xs h-9 px-4">
                <Link to="/dashboard/prebuilt">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="bg-gradient-primary shadow-elegant font-semibold text-xs h-9 px-4">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------------------- */}
      {/* 2. HERO SECTION — SEARCH-FIRST & IMMEDIATE HOOK */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-18 md:pb-28 border-b border-amber-100 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED]/50 to-[#FFFDF9]">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-7 relative z-10">
          {/* Trust Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
            <GraduationCap className="h-3.5 w-3.5 text-amber-700" />
            <span>100% Tested Final-Year Projects • Viva Defense & IEEE Reports Included</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white max-w-4xl mx-auto">
            Skip the Setup Stress. Download{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600">
              Verified Engineering Projects
            </span>{" "}
            Ready for Viva.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop debugging broken GitHub code. Get run-tested student projects with full source code, 60+ page formatted academic reports, architecture diagrams, and examiner viva Q&A.
          </p>

          {/* PROMINENT DIRECT SEARCH BAR (Immediate Focus) */}
          <div className="max-w-2xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="relative rounded-2xl p-2 bg-white dark:bg-card border-2 border-amber-300/80 shadow-lg shadow-amber-500/5 hover:border-amber-400 transition-all flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-amber-600 ml-3 shrink-0" />
              <Input
                type="text"
                placeholder="Search by tech stack, project title, or domain (e.g. Python, Flutter, Face Recognition, Smart Contracts)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 text-sm md:text-base placeholder:text-muted-foreground/70 bg-transparent h-11"
              />
              <Button
                type="submit"
                className="bg-gradient-primary shadow-elegant font-semibold text-sm px-6 h-11 rounded-xl shrink-0"
              >
                Find Project
              </Button>
            </form>

            {/* Quick Domain Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <span className="text-xs font-medium text-muted-foreground mr-1">Popular:</span>
              {QUICK_DOMAINS.map((domain) => (
                <button
                  key={domain.label}
                  type="button"
                  onClick={() => handleQuickDomainClick(domain.category)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedCategory === domain.category
                      ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                      : "bg-white/80 dark:bg-card border-amber-200/70 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:bg-amber-50/50"
                  }`}
                >
                  <domain.icon className="w-3 h-3 text-amber-600" />
                  <span>{domain.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Zero Missing Libraries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">IEEE Synopsis & Report</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Top 25 Viva Defense Answers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Peer Troubleshooting Q&A</span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 3. WHAT YOU GET — 4 PILLARS IN EVERY PROJECT DOWNLOAD */}
      {/* --------------------------------------------------------------------------------- */}
      <section id="deliverables" className="py-20 bg-[#FAF7F2]/60 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge className="bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 text-xs font-semibold">
              The Complete Package
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Everything You Need to Submit & Defend
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Most projects fail during viva presentation because students only have code without documentation. Every download on Projectbyai provides all 4 critical deliverables.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERABLES.map((item, idx) => (
              <Card
                key={item.title}
                className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-100 dark:border-border/60 shadow-xs hover:shadow-md hover:border-amber-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-2xs">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-semibold ${item.tagColor}`}>
                    {item.tag}
                  </Badge>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-border/40 text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <span>Guaranteed Included</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 4. INTERACTIVE PROJECT LIBRARY SHOWCASE (Dynamic Grid + Category Filter) */}
      {/* --------------------------------------------------------------------------------- */}
      <section id="project-showcase" ref={showcaseRef} className="py-20 max-w-7xl mx-auto px-6 space-y-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Verified Repositories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Available Projects
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Choose your project domain, inspect the tech stack, and download immediately with zero compilation errors.
            </p>
          </div>

          {/* Search indicator */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 dark:bg-card px-3 py-1.5 rounded-lg border border-amber-200">
              <span>Filtering by: "<strong>{searchQuery}</strong>"</span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-amber-700 font-bold hover:underline ml-1"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/70 scrollbar-none">
          {categories.map((cat) => {
            const isAll = cat === "All Projects";
            const isActive = isAll ? !selectedCategory : selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(isAll ? null : cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-white dark:bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-amber-50/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loadingProjects ? (
          <div className="py-20 text-center text-muted-foreground space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs">Loading verified project library...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-amber-200 bg-amber-50/30 space-y-3">
            <Search className="w-10 h-10 mx-auto text-amber-500/50" />
            <h3 className="font-bold text-base text-foreground">No matching projects found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any projects matching "{searchQuery}". Try searching for broader terms like "Python", "React", or "AI".
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="text-xs mt-2"
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => {
              const [thumbUrl, thumbAlt] = (p.thumbnail || "").split("||");
              const techList: string[] = Array.isArray(p.tech) ? p.tech : [];

              return (
                <Card
                  key={p.slug || p.id}
                  className="rounded-2xl overflow-hidden border border-amber-100/90 dark:border-border/60 bg-white dark:bg-card hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={thumbUrl || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"}
                        alt={thumbAlt || p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-black/5 text-[10px] font-semibold">
                        {p.category || "Engineering"}
                      </Badge>
                      <div className="absolute top-3 right-3 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-xs">
                        ₹{p.price || 999}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.description ? p.description.replace(/<[^>]*>/g, "") : "Comprehensive engineering final-year project package."}
                      </p>

                      {/* Tech stack pills */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-medium bg-slate-100 dark:bg-muted text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                          {techList.length > 3 && (
                            <span className="text-[10px] font-medium text-muted-foreground px-1 py-0.5">
                              +{techList.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Guaranteed badges */}
                      <div className="pt-2 border-t border-slate-100 dark:border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Source Code
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <FileText className="w-3 h-3" /> 60p Report
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <HelpCircle className="w-3 h-3" /> Viva Q&A
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-5 pt-0">
                    <Button
                      asChild
                      className="w-full bg-gradient-primary shadow-elegant font-semibold text-xs h-9"
                    >
                      <Link to="/projects/$slug" params={{ slug: p.slug }}>
                        <span>View Project & Viva Demo</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 5. HOW IT WORKS (3 SIMPLE FRICTIONLESS STEPS) */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2]/80 border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge className="bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 text-xs font-semibold">
              Frictionless Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              From Download to Viva in 3 Steps
            </h2>
            <p className="text-sm text-muted-foreground">
              We remove the guesswork so you can present a high-scoring project to your college department without stress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-100 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                01
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Choose Your Project Domain
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Filter by your university syllabus, preferred technology (Python, MERN, Flutter, AI), and inspect the architecture overview and live video preview.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-100 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                02
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Instant One-Click Download
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Immediately download the complete, clean ZIP archive containing the working source code, the IEEE documentation (.docx/.pdf), and presentation slides.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-100 shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                03
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Run Locally & Ace Your Viva
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Follow the 5-minute setup instructions, review the top 25 examiner viva defense talking points, and walk into your examination room with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 6. COMMUNITY Q&A & CONTRIBUTOR VALUE SPOTLIGHT */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="py-20 max-w-6xl mx-auto px-6 space-y-12">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Community Q&A Highlight */}
          <Card className="p-8 rounded-3xl bg-white dark:bg-card border border-amber-200/70 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 text-xs">
                  Peer & Author Support
                </Badge>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Student Community Q&A
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Never get stuck. If you encounter an installation error or need clarification on database configurations, ask in our student discussion threads.
              </p>

              {/* Sample Question Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Rahul V. (IIT Delhi)</span>
                  <span className="text-[10px] text-muted-foreground">Answered by Author</span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "Which PyTorch version is recommended for the CNN model weights in the AI Diagnostic system?"
                </p>
                <div className="pt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Solved with pinned requirements.txt
                </div>
              </div>
            </div>

            <Button asChild variant="outline" className="text-xs font-semibold h-10 w-full sm:w-auto self-start">
              <Link to="/dashboard/community">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Student Community Q&A
              </Link>
            </Button>
          </Card>

          {/* Right: Contributor Hub Spotlight */}
          <Card className="p-8 rounded-3xl bg-gradient-to-br from-[#FFF9EE] to-[#FFF3DC] dark:from-card dark:to-card border border-amber-300/80 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600 text-white border-0 text-xs font-bold">
                  Creator Royalty Program
                </Badge>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Earn 70% to 90% as a Contributor
              </h3>
              <p className="text-xs text-slate-700 dark:text-muted-foreground leading-relaxed">
                Built an exceptional engineering project during college? Don't let your code sit idle. Upload your project on Projectbyai and earn royalties every time a student downloads it.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/90 dark:bg-muted rounded-xl border border-amber-200/60 text-center">
                  <p className="text-lg font-black text-amber-700">70%</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Standard Royalty</p>
                </div>
                <div className="p-3 bg-white/90 dark:bg-muted rounded-xl border border-amber-200/60 text-center">
                  <p className="text-lg font-black text-amber-700">90%</p>
                  <p className="text-[10px] text-muted-foreground font-medium">With Video Tutorial</p>
                </div>
              </div>
            </div>

            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-10 w-full sm:w-auto self-start shadow-xs">
              <Link to="/contributor">
                <span>Explore Contributor Hub</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 7. SOCIAL PROOF & STUDENT REVIEWS */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2]/60 border-y border-amber-100">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <Badge className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 text-xs font-semibold">
              Student Reviews
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trusted by 5,000+ Engineering Students
            </h2>
            <p className="text-sm text-muted-foreground">
              Read how final-year students cleared their college oral examinations with top grades using our verified repositories.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-100 dark:border-border/60 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-border/50">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.branch} • {t.college}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="py-20 max-w-4xl mx-auto px-6 space-y-10 w-full">
        <div className="text-center space-y-3">
          <Badge className="bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 text-xs font-semibold">
            Common Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Clear answers to everything you need to know before acquiring a project.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <Card
                key={faq.q}
                className="rounded-2xl border border-amber-100 dark:border-border/60 overflow-hidden bg-white dark:bg-card transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-amber-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-slate-100 dark:border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 9. CLOSING CALL TO ACTION BANNER */}
      {/* --------------------------------------------------------------------------------- */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl p-10 md:p-14 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to Ace Your Final-Year Project Presentation?
            </h2>
            <p className="text-sm md:text-base text-amber-100">
              Get run-tested code, IEEE reports, and top 25 viva questions today. Never worry about examiner cross-questions again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm px-8 h-12 rounded-xl shadow-md"
            >
              <a href="#project-showcase">
                <span>Browse Verified Projects</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 font-bold text-sm px-6 h-12 rounded-xl"
            >
              <Link to="/dashboard/community">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask in Community Q&A
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- */}
      {/* 10. FOOTER */}
      {/* --------------------------------------------------------------------------------- */}
      <Footer />
    </div>
  );
}
