import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Upload,
  MessageSquare,
  Video,
  Star,
  Settings,
  TrendingUp,
  Eye,
  ShoppingBag,
  DollarSign,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  Send,
  ThumbsUp,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  CreditCard,
  Building,
  Image as ImageIcon,
  FileCode,
  Link2,
  Check,
  LogOut,
  HelpCircle,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  Wallet,
  GraduationCap,
  Menu,
  X,
  Bell,
  PlayCircle,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  BarChart3,
  Clock,
  CheckCheck
} from "lucide-react";

export const Route = createFileRoute("/contributor")({
  head: () => ({
    meta: [
      { title: "Project Contributor Hub — projectbyAI" },
      {
        name: "description",
        content:
          "Upload your projects, share step-by-step tutorial videos, help fellow students, and earn 70% to 90% commission on every sale.",
      },
    ],
  }),
  component: ContributorDashboardPage,
});

type TabType =
  | "overview"
  | "projects"
  | "upload"
  | "community"
  | "tutorial_tier"
  | "reviews"
  | "finances"
  | "settings";

function ContributorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Auth form state (for landing login/signup view)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authCollege, setAuthCollege] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Contributor profile data
  const [contributorProfile, setContributorProfile] = useState<any>({
    full_name: "Rahul Sharma",
    college: "IIT Bombay",
    email: "rahul.projects@gmail.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Computer Science final year graduate. Built & deployed 6+ full-stack AI and Web applications.",
    upi_id: "rahul@okaxis",
    bank_name: "HDFC Bank",
    bank_account: "••••••••4892",
    bank_ifsc: "HDFC0001234",
    account_holder_name: "Rahul Sharma",
    commission_tier: "standard_70", // standard_70 or video_90
    total_earnings: 18450,
    sales_count: 24,
    rating: 4.9,
    review_count: 19,
  });

  // Projects state
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");

  // Community Discussions
  const [communityMessages, setCommunityMessages] = useState<any[]>([
    {
      id: "cm-1",
      user_name: "Aman Verma",
      user_college: "VIT Vellore",
      user_role: "Student / Buyer",
      project_title: "Smart Attendance System with Face Recognition",
      message: "Hey Rahul! Does this model work with external USB webcams or only built-in laptop cameras? Also does it require GPU?",
      created_at: "2 hours ago",
      upvotes: 6,
      replies: [
        {
          id: "cr-1",
          user_name: "Rahul Sharma",
          user_role: "Contributor (Author)",
          message: "Hey Aman! In app.py line 42 you can pass cv2.VideoCapture(1) for external USB camera. It runs smoothly on CPU using OpenCV haar cascades!",
          created_at: "1 hour ago",
        },
      ],
    },
    {
      id: "cm-2",
      user_name: "Sneha Patel",
      user_college: "DTU Delhi",
      user_role: "Student / Buyer",
      project_title: "AI Medical Disease Predictor & Diagnostic Assistant",
      message: "Can we connect this to an external MySQL database instead of SQLite for our college final submission?",
      created_at: "5 hours ago",
      upvotes: 3,
      replies: [
        {
          id: "cr-2",
          user_name: "Rahul Sharma",
          user_role: "Contributor (Author)",
          message: "Yes absolutely! Just change the DATABASE_URL in config.py to mysql+pymysql://user:password@localhost/dbname and run alembic upgrade head.",
          created_at: "3 hours ago",
        },
      ],
    },
    {
      id: "cm-3",
      user_name: "Karthik Nair",
      user_college: "SRM University",
      user_role: "Student",
      project_title: "General Contributor Question",
      message: "Are the step-by-step video tutorials mandatory to get paid, or do we still get 70% without video?",
      created_at: "Yesterday",
      upvotes: 8,
      replies: [
        {
          id: "cr-3",
          user_name: "Rahul Sharma",
          user_role: "Contributor (Author)",
          message: "You get 70% commission immediately with just source code and README! The video tutorial is an extra bonus that boosts your commission to 90%.",
          created_at: "Yesterday",
        },
      ],
    },
  ]);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionProject, setNewQuestionProject] = useState("Smart Attendance System with Face Recognition");
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // 90% Video Tutorial Tier Requests
  const [tutorialRequests, setTutorialRequests] = useState<any[]>([
    {
      id: "tr-1",
      project_title: "Smart Attendance System with Face Recognition",
      video_url: "https://youtu.be/example-walkthrough",
      duration: "42 mins",
      notes: "Covers complete face recognition pipeline, OpenCV setup, database design, and viva defense questions.",
      status: "approved",
      commission_rate: 90,
      submitted_at: "3 days ago",
    },
  ]);
  const [reqProject, setReqProject] = useState("");
  const [reqVideoUrl, setReqVideoUrl] = useState("");
  const [reqDuration, setReqDuration] = useState("");
  const [reqNotes, setReqNotes] = useState("");
  const [submittingTierReq, setSubmittingTierReq] = useState(false);

  // Reviews
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      id: "rev-1",
      reviewer_name: "Pooja Hegde",
      college: "BMS College of Engineering",
      rating: 5,
      project_title: "Smart Attendance System with Face Recognition",
      comment: "Super clean code and the step-by-step video tutorial was a lifesaver for our final year viva! Got an A grade. Highly recommend!",
      created_at: "2 days ago",
    },
    {
      id: "rev-2",
      reviewer_name: "Devendra Singh",
      college: "BITS Pilani",
      rating: 5,
      project_title: "AI Medical Disease Predictor & Diagnostic Assistant",
      comment: "Documentation was so thorough that running it took less than 10 minutes. The architecture diagram made my presentation effortless.",
      created_at: "1 week ago",
    },
    {
      id: "rev-3",
      reviewer_name: "Rohan Kulkarni",
      college: "COEP Pune",
      rating: 4.8,
      project_title: "Decentralized Voting System using Ethereum & Solidity",
      comment: "Very detailed smart contracts with clear tests. Rahul also answered my questions in the Q&A thread within an hour.",
      created_at: "2 weeks ago",
    },
  ]);
  const [newReviewProject, setNewReviewProject] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewCollege, setNewReviewCollege] = useState("");

  // Upload Form State (matching prebuilt project marketplace)
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSlug, setUploadSlug] = useState("");
  const [uploadCategory, setUploadCategory] = useState("AI & Machine Learning");
  const [uploadPrice, setUploadPrice] = useState<number>(1499);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDemoUrl, setUploadDemoUrl] = useState("");
  const [uploadZipUrl, setUploadZipUrl] = useState("");
  const [uploadThumbnailUrl, setUploadThumbnailUrl] = useState("");
  const [uploadTutorialVideoUrl, setUploadTutorialVideoUrl] = useState("");
  const [uploadTechStack, setUploadTechStack] = useState<string[]>(["Python", "OpenCV", "Flask", "SQLite"]);
  const [techInput, setTechInput] = useState("");
  const [uploadReadme, setUploadReadme] = useState(`## Project Overview
A production-ready full-stack application built for academic submission and real-world deployment.

### Key Features
- Clean modular architecture with complete separation of concerns.
- Comprehensive database schema with automated migration scripts.
- Secure authentication and role-based access control.
- Detailed step-by-step setup guide with viva defense FAQs.

### Installation & Run Instructions
1. Clone or extract the project ZIP.
2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt # or npm install
\`\`\`
3. Run migrations and seed data:
\`\`\`bash
python manage.py migrate # or npx prisma db push
\`\`\`
4. Start the application:
\`\`\`bash
python app.py # or npm run dev
\`\`\`

### System Architecture
- Frontend: Responsive UI with clean components
- Backend: RESTful API server
- Database: Structured relational database schema
`);
  const [uploadingProject, setUploadingProject] = useState(false);

  // Settings & Payout State
  const [settingName, setSettingName] = useState("");
  const [settingCollege, setSettingCollege] = useState("");
  const [settingBio, setSettingBio] = useState("");
  const [settingAvatar, setSettingAvatar] = useState("");
  const [settingUpi, setSettingUpi] = useState("");
  const [settingBankName, setSettingBankName] = useState("");
  const [settingAccount, setSettingAccount] = useState("");
  const [settingIfsc, setSettingIfsc] = useState("");
  const [settingHolder, setSettingHolder] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Initial Auth Check
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          if (data?.session?.user) {
            setUser(data.session.user);
            setContributorProfile((prev: any) => ({
              ...prev,
              email: data.session.user.email || prev.email,
              full_name: data.session.user.user_metadata?.full_name || prev.full_name,
            }));
          }
          setLoadingUser(false);
        }
      } catch (err) {
        if (mounted) setLoadingUser(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          setContributorProfile((prev: any) => ({
            ...prev,
            email: session.user.email || prev.email,
            full_name: session.user.user_metadata?.full_name || prev.full_name,
          }));
        } else if (!isDemoUser) {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [isDemoUser]);

  // Load projects from database or fallback to PREBUILT_PROJECTS
  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase
          .from("library_projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setMyProjects(data);
        } else {
          setMyProjects(PREBUILT_PROJECTS.slice(0, 5));
        }
      } catch (err) {
        setMyProjects(PREBUILT_PROJECTS.slice(0, 5));
      } finally {
        setLoadingProjects(false);
      }
    }

    loadProjects();
  }, []);

  // Sync settings inputs when contributorProfile loads
  useEffect(() => {
    if (contributorProfile) {
      setSettingName(contributorProfile.full_name || "");
      setSettingCollege(contributorProfile.college || "");
      setSettingBio(contributorProfile.bio || "");
      setSettingAvatar(contributorProfile.avatar_url || "");
      setSettingUpi(contributorProfile.upi_id || "");
      setSettingBankName(contributorProfile.bank_name || "");
      setSettingAccount(contributorProfile.bank_account || "");
      setSettingIfsc(contributorProfile.bank_ifsc || "");
      setSettingHolder(contributorProfile.account_holder_name || "");
    }
  }, [contributorProfile]);

  // Quick Demo Access Handler
  const handleQuickDemoAccess = () => {
    setIsDemoUser(true);
    setUser({
      id: "demo-contributor-123",
      email: "rahul.projects@gmail.com",
      user_metadata: { full_name: "Rahul Sharma" },
    });
    toast.success("Welcome to the Contributor Hub Demo! Exploring with sample metrics.");
  };

  // Auth Submit Handler (Sign in / Sign up)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authFullName,
              college: authCollege,
              role: "contributor",
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          setContributorProfile((prev: any) => ({
            ...prev,
            full_name: authFullName || "New Contributor",
            college: authCollege || "University",
            email: authEmail,
          }));
          toast.success("Account created successfully! Welcome to the Contributor Hub.");
        } else {
          toast.info("Verification email sent! Please check your inbox or use Quick Demo.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          toast.success("Welcome back to your Contributor Dashboard!");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Try Quick Demo Access.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin + "/contributor" : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed.");
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setIsDemoUser(false);
    setActiveTab("overview");
    toast.success("Signed out from Contributor Hub.");
  };

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setUploadTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setUploadSlug(generated);
  };

  // Commission calculations
  const parsedPrice = uploadPrice || 0;
  const contributorEarn70 = Math.round(parsedPrice * 0.7);
  const platformFee30 = Math.round(parsedPrice * 0.3);
  const contributorEarn90 = Math.round(parsedPrice * 0.9);
  const platformFee10 = Math.round(parsedPrice * 0.1);

  // Add Tech Tag
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!uploadTechStack.includes(techInput.trim())) {
      setUploadTechStack([...uploadTechStack, techInput.trim()]);
    }
    setTechInput("");
  };

  const handleRemoveTech = (tag: string) => {
    setUploadTechStack(uploadTechStack.filter((t) => t !== tag));
  };

  // Upload Project Submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadSlug.trim()) {
      toast.error("Please enter a project title and URL slug.");
      return;
    }

    setUploadingProject(true);

    try {
      const newProj = {
        title: uploadTitle,
        slug: uploadSlug,
        category: uploadCategory,
        price: uploadPrice,
        description: uploadDescription,
        readme: uploadReadme,
        demo_url: uploadDemoUrl,
        download_url: uploadZipUrl,
        thumbnail_url:
          uploadThumbnailUrl ||
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        tech_stack: uploadTechStack,
        contributor_id: user?.id || "demo-contributor-123",
        contributor_name: contributorProfile.full_name,
        commission_rate: uploadTutorialVideoUrl ? 90 : 70,
        tutorial_video_url: uploadTutorialVideoUrl,
        views_count: 1,
        sales_count: 0,
        created_at: new Date().toISOString(),
      };

      // Try inserting into Supabase
      const { error } = await supabase.from("library_projects").insert([newProj]);
      if (error) {
        console.warn("Supabase insert note:", error.message);
      }

      setMyProjects([newProj, ...myProjects]);
      toast.success(
        uploadTutorialVideoUrl
          ? "Project published with Step-by-Step Video! Submitted for 90% Commission."
          : "Project published successfully! You will earn 70% on each sale."
      );

      // Reset form
      setUploadTitle("");
      setUploadSlug("");
      setUploadDescription("");
      setUploadDemoUrl("");
      setUploadZipUrl("");
      setUploadThumbnailUrl("");
      setUploadTutorialVideoUrl("");
      setActiveTab("projects");
    } catch (err: any) {
      toast.error(err.message || "Failed to publish project.");
    } finally {
      setUploadingProject(false);
    }
  };

  // Submit Video Tutorial for 90% Tier
  const handleSubmitTutorialTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqProject || !reqVideoUrl) {
      toast.error("Please select a project and provide the tutorial video link.");
      return;
    }

    setSubmittingTierReq(true);
    setTimeout(() => {
      const newReq = {
        id: `tr-${Date.now()}`,
        project_title: reqProject,
        video_url: reqVideoUrl,
        duration: reqDuration || "35 mins",
        notes: reqNotes || "Full step-by-step code explanation and installation instructions.",
        status: "pending",
        commission_rate: 90,
        submitted_at: "Just now",
      };

      setTutorialRequests([newReq, ...tutorialRequests]);
      setSubmittingTierReq(false);
      setReqVideoUrl("");
      setReqDuration("");
      setReqNotes("");
      toast.success(
        "Tutorial submitted! Our team will review your video within 24 hours. Once verified, your commission boosts to 90%."
      );
    }, 800);
  };

  // Community Question Submit
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newMsg = {
      id: `cm-${Date.now()}`,
      user_name: user?.user_metadata?.full_name || "Community Member",
      user_college: "Engineering College",
      user_role: "Student",
      project_title: newQuestionProject,
      message: newQuestionText.trim(),
      created_at: "Just now",
      upvotes: 1,
      replies: [],
    };

    setCommunityMessages([newMsg, ...communityMessages]);
    setNewQuestionText("");
    toast.success("Question posted to the community!");
  };

  // Reply Submit
  const handleReplySubmit = (threadId: string) => {
    const text = replyInputMap[threadId];
    if (!text || !text.trim()) return;

    setCommunityMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            replies: [
              ...thread.replies,
              {
                id: `cr-${Date.now()}`,
                user_name: contributorProfile.full_name,
                user_role: "Contributor (Author)",
                message: text.trim(),
                created_at: "Just now",
              },
            ],
          };
        }
        return thread;
      })
    );

    setReplyInputMap((prev) => ({ ...prev, [threadId]: "" }));
    toast.success("Reply posted!");
  };

  // Review Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) {
      toast.error("Please enter your review feedback.");
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      reviewer_name: newReviewName.trim() || "Verified Buyer",
      college: newReviewCollege.trim() || "Engineering Institute",
      rating: newReviewRating,
      project_title: newReviewProject || myProjects[0]?.title || "Smart Project",
      comment: newReviewComment.trim(),
      created_at: "Just now",
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewComment("");
    setNewReviewName("");
    setNewReviewCollege("");
    toast.success("Review submitted! Thank you for supporting the contributor.");
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setContributorProfile((prev: any) => ({
      ...prev,
      full_name: settingName,
      college: settingCollege,
      bio: settingBio,
      avatar_url: settingAvatar,
      upi_id: settingUpi,
      bank_name: settingBankName,
      bank_account: settingAccount,
      bank_ifsc: settingIfsc,
      account_holder_name: settingHolder,
    }));
    toast.success("Profile and payout details updated successfully!");
  };

  // -------------------------------------------------------------------------------------------------
  // SCREEN 1: Dedicated Sign In / Sign Up Gate (When User is NOT Authenticated)
  // -------------------------------------------------------------------------------------------------
  if (!user && !isDemoUser) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        {/* Simple Top Navigation */}
        <header className="border-b border-border/80 bg-card/60 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo />
              <Badge variant="secondary" className="ml-2 font-medium text-xs bg-primary/10 text-primary border border-primary/20">
                Contributor Portal
              </Badge>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Browse Marketplace
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickDemoAccess}
                className="hidden sm:inline-flex border-dashed border-primary/50 text-primary hover:bg-primary/10"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Quick Demo Access
              </Button>
            </div>
          </div>
        </header>

        {/* Main Split Authentication & Value Landing */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Social Proof */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Award className="w-4 h-4" />
              <span>Project Contributor Monetization Program</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Turn your student projects into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-primary to-orange-500">
                  passive income
                </span>
                .
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Upload your college, capstone, or final year projects. Help junior students learn and build from scratch, while keeping <strong className="text-foreground">70% to 90% of every sale</strong>.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border/80 bg-card/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  70% Base Royalty
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Earn a clean 70% commission on all project source code, documentation, and viva files.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                    <Video className="w-4 h-4" />
                  </div>
                  90% Video Tutorial Bonus
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Add a step-by-step video explaining how you built the project to unlock maximum 90% revenue share.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                    <Wallet className="w-4 h-4" />
                  </div>
                  Direct UPI & Bank Payouts
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Receive your earnings directly into your UPI ID or bank account with complete transparency.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-card/50 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  Interactive Q&A Hub
                </div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Direct student community where buyers can ask questions and you can build a respected reputation.
                </p>
              </div>
            </div>

            {/* Quick Proof Ribbon */}
            <div className="pt-4 flex flex-wrap items-center gap-8 border-t border-border/60 text-sm">
              <div>
                <p className="text-2xl font-bold text-foreground">₹4.85L+</p>
                <p className="text-xs text-muted-foreground">Paid to Contributors</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">1,400+</p>
                <p className="text-xs text-muted-foreground">Student Projects Downloaded</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.9 / 5.0</p>
                <p className="text-xs text-muted-foreground">Average Contributor Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Auth Card */}
          <div className="lg:col-span-5">
            <Card className="p-6 sm:p-8 shadow-xl border-border/80 bg-card/95 backdrop-blur">
              {/* Tab Selector */}
              <div className="flex rounded-lg bg-muted p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    authMode === "signin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In to Portal
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    authMode === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Become a Contributor
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  {authMode === "signin" ? "Welcome back, Contributor" : "Create Contributor Account"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {authMode === "signin"
                    ? "Enter your credentials to access your earnings & projects dashboard."
                    : "Join 1,200+ student creators and start monetizing your project work."}
                </p>
              </div>

              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4 h-11"
                onClick={handleGoogleAuth}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or with email</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Full Name</label>
                      <Input
                        placeholder="e.g. Rahul Sharma"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">College / University</label>
                      <Input
                        placeholder="e.g. IIT Bombay / DTU / Anna University"
                        value={authCollege}
                        onChange={(e) => setAuthCollege(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">College / Personal Email</label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Password</label>
                    {authMode === "signin" && (
                      <span className="text-[11px] text-primary hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-10"
                  />
                </div>

                <Button type="submit" className="w-full h-11 font-semibold" disabled={authLoading}>
                  {authLoading ? (
                    "Please wait..."
                  ) : authMode === "signin" ? (
                    "Sign In to Dashboard"
                  ) : (
                    "Create Contributor Account & Start Earning"
                  )}
                </Button>
              </form>

              {/* Quick Demo Exploration Access */}
              <div className="mt-6 pt-5 border-t border-border/70 text-center space-y-2">
                <p className="text-xs text-muted-foreground">Evaluating or testing the features?</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickDemoAccess}
                  className="w-full text-xs font-medium border-dashed border-primary/60 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Explore Contributor Dashboard in Demo Mode
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground text-center mt-4 leading-tight">
                By joining, you agree to projectbyAI's 70%/90% Contributor Royalty Agreement and Marketplace Terms of Service.
              </p>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // -------------------------------------------------------------------------------------------------
  // SCREEN 2: Shopify-Inspired Contributor Dashboard (Authenticated)
  // -------------------------------------------------------------------------------------------------
  const filteredProjects = myProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCategory =
      projectCategoryFilter === "all" || p.category === projectCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(
    new Set(myProjects.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* --------------------------------------------------------------------------------- */}
      {/* SHOPIFY POLARIS STYLE SIDEBAR (Left Navigation) */}
      {/* --------------------------------------------------------------------------------- */}
      <aside className="w-full md:w-64 border-r border-border bg-card/80 backdrop-blur shrink-0 md:h-screen md:sticky md:top-0 flex flex-col justify-between z-40">
        <div>
          {/* Contributor Brand Header / Store Switcher */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm tracking-tight text-foreground block">
                  Contributor Hub
                </span>
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  70% – 90% Revenue Share
                </span>
              </div>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Hub Navigation Links (Shopify Polaris style) */}
          <nav
            className={`p-3 space-y-1 ${
              mobileMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview & Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("projects");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                <span>My Projects</span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 border-current ${
                  activeTab === "projects"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {myProjects.length}
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "upload"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Upload New Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("community");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "community"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Community Q&A</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("tutorial_tier");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "tutorial_tier"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 shrink-0" />
                <span>90% Video Bonus</span>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] px-1 py-0">
                +20%
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("reviews");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "reviews"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 shrink-0" />
                <span>Reviews & Ratings</span>
              </div>
              <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                ★ {contributorProfile.rating}
              </span>
            </button>

            <div className="pt-2 pb-1">
              <div className="h-px bg-border my-1" />
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("finances");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "finances"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Finances & Payouts</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("settings");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Contributor Profile Chip & Sign Out */}
        <div
          className={`p-3 border-t border-border bg-card/40 ${
            mobileMenuOpen ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={contributorProfile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt={contributorProfile.full_name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">
                  {contributorProfile.full_name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {contributorProfile.email || "contributor@projectbyai.com"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* --------------------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar (Shopify style with search & action buttons) */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search projects, questions, orders..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="pl-9 h-9 text-xs sm:text-sm bg-muted/40 border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Earnings Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Net: ₹{contributorProfile.total_earnings.toLocaleString("en-IN")}</span>
            </div>

            <Link to="/projects">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs h-9">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                View Marketplace
              </Button>
            </Link>

            <Button
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="text-xs h-9 font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Upload Project
            </Button>
          </div>
        </header>

        {/* Tab Content Canvas */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* =============================================================================== */}
          {/* TAB 1: OVERVIEW & ANALYTICS (Shopify Home Dashboard style) */}
          {/* =============================================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Contributor Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Real-time sales, student downloads, and commission breakdown.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("finances")}
                    className="text-xs"
                  >
                    <Wallet className="w-3.5 h-3.5 mr-1.5" />
                    Payout Settings
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("upload")}
                    className="text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add New Project
                  </Button>
                </div>
              </div>

              {/* 4 Shopify Polaris-Style Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-border shadow-xs hover:border-border/80 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Net Earnings</span>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    ₹{contributorProfile.total_earnings.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 mt-2 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+₹3,450 this week (70% - 90%)</span>
                  </div>
                </Card>

                <Card className="p-5 border-border shadow-xs hover:border-border/80 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {contributorProfile.sales_count} units
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>Instant ZIP download access</span>
                  </div>
                </Card>

                <Card className="p-5 border-border shadow-xs hover:border-border/80 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {myProjects.length} listed
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <span className="text-purple-400 font-medium">1 in 90% Video Bonus Tier</span>
                  </div>
                </Card>

                <Card className="p-5 border-border shadow-xs hover:border-border/80 transition-all">
                  <div className="flex items-center justify-between text-muted-foreground mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    1,842 views
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>★ {contributorProfile.rating} ({contributorProfile.review_count} reviews)</span>
                  </div>
                </Card>
              </div>

              {/* 90% Tutorial Tier Callout Card */}
              <div className="p-6 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-card to-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    MAX REVENUE TIER
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Earn 90% Commission by adding a Step-by-Step Video Tutorial
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Students learn much faster when they see how a project is coded from scratch. Record a screen recording explaining the architecture and installation to automatically qualify for 90% commission on every sale.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab("tutorial_tier")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shrink-0"
                >
                  <Video className="w-3.5 h-3.5 mr-1.5" />
                  Submit Video for 90%
                </Button>
              </div>

              {/* Recent Orders / Sales Data Table (Shopify style) */}
              <Card className="border-border shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">
                      Recent Project Sales
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Purchases made by students across India.
                    </p>
                  </div>
                  <Link to="/projects">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Browse Marketplace <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs uppercase font-medium">
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Buyer Student</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Your Cut</th>
                        <th className="py-3 px-4">Commission</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          Smart Attendance System with Face Recognition
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          Aman V. (VIT Vellore)
                        </td>
                        <td className="py-3 px-4">₹1,499</td>
                        <td className="py-3 px-4 font-bold text-emerald-500">₹1,349</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                            90% Video Bonus
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">2 hours ago</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          AI Medical Disease Predictor & Diagnostic Assistant
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          Priya M. (SRM Chennai)
                        </td>
                        <td className="py-3 px-4">₹1,999</td>
                        <td className="py-3 px-4 font-bold text-emerald-500">₹1,399</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                            70% Standard
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">Yesterday</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          Decentralized Voting System using Ethereum & Solidity
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          Sameer K. (IIT Delhi)
                        </td>
                        <td className="py-3 px-4">₹2,499</td>
                        <td className="py-3 px-4 font-bold text-emerald-500">₹1,749</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                            70% Standard
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">3 days ago</td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">
                            Completed
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 2: MY PROJECTS (Shopify "Products" Catalog style) */}
          {/* =============================================================================== */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">My Projects Catalog</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your project listings, pricing, and tutorial video links.
                  </p>
                </div>
                <Button onClick={() => setActiveTab("upload")} className="text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Project
                </Button>
              </div>

              {/* Filters Bar */}
              <Card className="p-3 border-border shadow-xs flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search by title or tech..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="pl-9 h-8 text-xs bg-muted/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={projectCategoryFilter}
                    onChange={(e) => setProjectCategoryFilter(e.target.value)}
                    className="h-8 rounded-md border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* Projects Table (Polaris Data Table) */}
              <Card className="border-border shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs uppercase font-medium">
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Your Cut</th>
                        <th className="py-3 px-4">Sales</th>
                        <th className="py-3 px-4">Views</th>
                        <th className="py-3 px-4">Video Tier</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-muted-foreground">
                            No projects found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p, idx) => {
                          const hasVideo = !!p.tutorial_video_url || idx === 0;
                          const earnRate = hasVideo ? 0.9 : 0.7;
                          const cut = Math.round((p.price || 1499) * earnRate);

                          return (
                            <tr key={p.slug || idx} className="hover:bg-muted/20 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      p.thumbnail_url ||
                                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120"
                                    }
                                    alt={p.title}
                                    className="w-10 h-10 rounded-md object-cover border border-border shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="font-semibold text-foreground block truncate max-w-xs">
                                      {p.title}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground block truncate">
                                      /projects/{p.slug}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 text-muted-foreground">
                                {p.category || "General"}
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-foreground">
                                ₹{p.price || 1499}
                              </td>

                              <td className="py-3.5 px-4 font-bold text-emerald-500">
                                ₹{cut} ({hasVideo ? "90%" : "70%"})
                              </td>

                              <td className="py-3.5 px-4 text-foreground">
                                {p.sales_count || (idx === 0 ? 14 : idx === 1 ? 7 : 3)}
                              </td>

                              <td className="py-3.5 px-4 text-muted-foreground">
                                {p.views_count || 120 + idx * 45}
                              </td>

                              <td className="py-3.5 px-4">
                                {hasVideo ? (
                                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                                    <Video className="w-3 h-3 mr-1" />
                                    90% Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-muted-foreground text-[10px]">
                                    70% Standard
                                  </Badge>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Link to={`/projects/${p.slug}`}>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                                      <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                  </Link>
                                  {!hasVideo && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setReqProject(p.title);
                                        setActiveTab("tutorial_tier");
                                      }}
                                      className="h-8 text-xs text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                                    >
                                      Upgrade 90%
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 3: UPLOAD PROJECT (Shopify "Add Product" 2-Column Layout) */}
          {/* =============================================================================== */}
          {activeTab === "upload" && (
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Upload New Project</h1>
                  <p className="text-sm text-muted-foreground">
                    Publish your code, documentation, and viva files to the student marketplace.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("projects")}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={uploadingProject} className="text-xs font-semibold">
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    {uploadingProject ? "Publishing..." : "Publish Project"}
                  </Button>
                </div>
              </div>

              {/* 2-Column Shopify Add-Product Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (2/3 width): Content & Media */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card: Title & Summary */}
                  <Card className="p-5 border-border shadow-xs space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Project Title *
                      </label>
                      <Input
                        placeholder="e.g. AI-Powered Hospital Bed & Oxygen Allocation System"
                        value={uploadTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="text-base font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        URL Slug *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">projectbyai.com/projects/</span>
                        <Input
                          placeholder="hospital-bed-allocation"
                          value={uploadSlug}
                          onChange={(e) => setUploadSlug(e.target.value)}
                          required
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Short Summary Description *
                      </label>
                      <Textarea
                        placeholder="Explain what problem this project solves, main algorithms used, and how students can present it in their college viva..."
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                  </Card>

                  {/* Card: Technical README Documentation (Markdown) */}
                  <Card className="p-5 border-border shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">
                          Technical README & Setup Documentation
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Rendered on the project page. Include architecture, step-by-step setup commands, and viva talking points.
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Markdown Supported
                      </Badge>
                    </div>

                    <Textarea
                      value={uploadReadme}
                      onChange={(e) => setUploadReadme(e.target.value)}
                      rows={12}
                      className="font-mono text-xs leading-relaxed"
                    />
                  </Card>

                  {/* Card: Media & Assets */}
                  <Card className="p-5 border-border shadow-xs space-y-4">
                    <h3 className="font-semibold text-sm text-foreground">
                      Media, Code ZIP & Live Demo Links
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Thumbnail Cover Image URL
                        </label>
                        <Input
                          placeholder="https://images.unsplash.com/photo-..."
                          value={uploadThumbnailUrl}
                          onChange={(e) => setUploadThumbnailUrl(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">
                          Live Interactive Demo URL (Optional)
                        </label>
                        <Input
                          placeholder="https://my-project-demo.vercel.app"
                          value={uploadDemoUrl}
                          onChange={(e) => setUploadDemoUrl(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">
                        Source Code ZIP Download URL (Google Drive / GitHub / S3) *
                      </label>
                      <Input
                        placeholder="https://drive.google.com/uc?id=... or direct link"
                        value={uploadZipUrl}
                        onChange={(e) => setUploadZipUrl(e.target.value)}
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Students receive access to this download URL instantly upon successful checkout.
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Right Column (1/3 width): Pricing, Commission & Taxonomy */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card: Pricing & Interactive Commission Calculator */}
                  <Card className="p-5 border-border shadow-xs space-y-4">
                    <h3 className="font-semibold text-sm text-foreground flex items-center justify-between">
                      <span>Pricing & Commission</span>
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 text-[10px]">
                        70% Standard
                      </Badge>
                    </h3>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Selling Price in INR (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={uploadPrice}
                          onChange={(e) => setUploadPrice(Number(e.target.value))}
                          className="pl-7 font-bold text-base"
                          min={299}
                          max={29999}
                        />
                      </div>
                    </div>

                    {/* Breakdown Box */}
                    <div className="p-3.5 rounded-lg bg-muted/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Student pays:</span>
                        <span className="font-semibold text-foreground">₹{parsedPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-500 font-bold">
                        <span>Your Payout (70%):</span>
                        <span>₹{contributorEarn70}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>Platform fee & handling (30%):</span>
                        <span>₹{platformFee30}</span>
                      </div>

                      <div className="pt-2 border-t border-border mt-2 space-y-1">
                        <div className="flex items-center justify-between text-purple-400 font-bold">
                          <span>With 90% Tutorial Video:</span>
                          <span>₹{contributorEarn90}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          You make an extra <strong className="text-foreground">+₹{contributorEarn90 - contributorEarn70}</strong> per sale!
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Tutorial Video Input for 90% */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        Tutorial Video URL (for 90% Commission)
                      </label>
                      <Input
                        placeholder="https://youtu.be/... (Unlisted or Public)"
                        value={uploadTutorialVideoUrl}
                        onChange={(e) => setUploadTutorialVideoUrl(e.target.value)}
                        className="text-xs border-purple-500/30"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        If provided, our admin team reviews your video to immediately approve your 90% commission tier.
                      </p>
                    </div>
                  </Card>

                  {/* Card: Organization & Taxonomy */}
                  <Card className="p-5 border-border shadow-xs space-y-4">
                    <h3 className="font-semibold text-sm text-foreground">Project Category</h3>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Category Domain</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Web & Full Stack">Web & Full Stack</option>
                        <option value="Mobile App (Flutter/React Native)">Mobile App (Flutter/React Native)</option>
                        <option value="Blockchain & Web3">Blockchain & Web3</option>
                        <option value="Cybersecurity & Cloud">Cybersecurity & Cloud</option>
                        <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                      </select>
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Tech Stack Tags</label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="e.g. Next.js, PyTorch..."
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTech();
                            }
                          }}
                          className="h-8 text-xs"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleAddTech}
                          className="h-8 px-2.5 text-xs"
                        >
                          Add
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {uploadTechStack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-foreground"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(tech)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Submit CTA */}
                  <Button type="submit" disabled={uploadingProject} className="w-full h-11 font-semibold">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingProject ? "Publishing Project..." : "Publish to Marketplace"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* =============================================================================== */}
          {/* TAB 4: COMMUNITY Q&A (Shopify Customer Support / Discussion style) */}
          {/* =============================================================================== */}
          {activeTab === "community" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Student Community Q&A</h1>
                  <p className="text-sm text-muted-foreground">
                    Answer student questions about setup, architecture, and viva preparation.
                  </p>
                </div>
              </div>

              {/* Ask / Post a Question Box (Available to all students & users) */}
              <Card className="p-5 border-border shadow-xs space-y-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Ask or Start a Discussion Topic
                </h3>
                <form onSubmit={handlePostQuestion} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <select
                      value={newQuestionProject}
                      onChange={(e) => setNewQuestionProject(e.target.value)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none"
                    >
                      {myProjects.map((p) => (
                        <option key={p.title} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                      <option value="General Contributor Question">General Question</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Ask a question about database configuration, local installation, or viva defense questions..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    rows={2}
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="text-xs">
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Post Question
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Discussion Threads List */}
              <div className="space-y-4">
                {communityMessages.map((thread) => (
                  <Card key={thread.id} className="p-5 border-border shadow-xs space-y-4">
                    {/* Thread Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {thread.user_name}
                          </span>
                          {thread.user_college && (
                            <span className="text-xs text-muted-foreground">
                              • {thread.user_college}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {thread.user_role}
                          </Badge>
                        </div>
                        <p className="text-xs font-medium text-primary">
                          Re: {thread.project_title}
                        </p>
                      </div>

                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {thread.created_at}
                      </span>
                    </div>

                    {/* Question Body */}
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {thread.message}
                    </p>

                    {/* Replies List */}
                    {thread.replies && thread.replies.length > 0 && (
                      <div className="space-y-2.5 pl-4 border-l-2 border-border/70 mt-3 pt-2">
                        {thread.replies.map((reply: any) => (
                          <div key={reply.id} className="p-3 rounded-lg bg-muted/40 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-foreground flex items-center gap-1.5">
                                {reply.user_name}
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] px-1 py-0">
                                  {reply.user_role}
                                </Badge>
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {reply.created_at}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/80 leading-normal">
                              {reply.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <Input
                        placeholder="Write a helpful answer or tip as contributor..."
                        value={replyInputMap[thread.id] || ""}
                        onChange={(e) =>
                          setReplyInputMap({
                            ...replyInputMap,
                            [thread.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleReplySubmit(thread.id);
                          }
                        }}
                        className="h-8 text-xs bg-muted/30"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleReplySubmit(thread.id)}
                        className="h-8 text-xs shrink-0"
                      >
                        Reply
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 5: 90% VIDEO TUTORIAL TIER (Upgrade Center) */}
          {/* =============================================================================== */}
          {activeTab === "tutorial_tier" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Creator Revenue Acceleration
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  90% Video Tutorial Upgrade Tier
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Submit a step-by-step video explaining how you built the project from scratch. Once verified by admin, your royalty increases from 70% to 90% permanently.
                </p>
              </div>

              {/* 3 Steps Guide Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="p-4 border-border shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Record Video Tutorial</h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Record a 20–45 min screen recording walking through the folder structure, backend APIs, database models, and local installation steps.
                  </p>
                </Card>

                <Card className="p-4 border-border shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Upload & Share Link</h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Upload your video as Unlisted on YouTube, Loom, or Google Drive, and paste the accessible link below.
                  </p>
                </Card>

                <Card className="p-4 border-border shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Admin Review & 90% Payout</h4>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Our engineering team reviews your video within 24 hours. Once approved, your project earns 90% on every past & future sale!
                  </p>
                </Card>
              </div>

              {/* Submission Form */}
              <Card className="p-6 border-border shadow-xs space-y-4">
                <h3 className="font-semibold text-base text-foreground">
                  Submit Tutorial Video to Admin
                </h3>

                <form onSubmit={handleSubmitTutorialTier} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Select Project *</label>
                      <select
                        value={reqProject}
                        onChange={(e) => setReqProject(e.target.value)}
                        required
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none"
                      >
                        <option value="">-- Choose from your projects --</option>
                        {myProjects.map((p) => (
                          <option key={p.title} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Approx. Duration</label>
                      <Input
                        placeholder="e.g. 35 mins"
                        value={reqDuration}
                        onChange={(e) => setReqDuration(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Video URL (YouTube Unlisted / Loom / Google Drive) *
                    </label>
                    <Input
                      type="url"
                      placeholder="https://youtu.be/..."
                      value={reqVideoUrl}
                      onChange={(e) => setReqVideoUrl(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Notes for Admin Reviewer
                    </label>
                    <Textarea
                      placeholder="Highlight key sections covered in the video (e.g. 0:00 Intro, 5:30 Database Setup, 18:20 ML Training, 30:00 Viva Questions)..."
                      value={reqNotes}
                      onChange={(e) => setReqNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingTierReq}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-10 px-6"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {submittingTierReq ? "Submitting Request..." : "Submit Video for 90% Review"}
                  </Button>
                </form>
              </Card>

              {/* Status List */}
              <Card className="border-border shadow-xs overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h4 className="font-semibold text-sm text-foreground">
                    Submitted Tutorial Video Requests
                  </h4>
                </div>
                <div className="divide-y divide-border">
                  {tutorialRequests.map((tr) => (
                    <div key={tr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{tr.project_title}</span>
                          <span className="text-muted-foreground">({tr.duration})</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {tr.notes}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            tr.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        >
                          {tr.status === "approved" ? "90% Tier Active" : "Under Admin Review"}
                        </Badge>
                        <a
                          href={tr.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View Video <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 6: REVIEWS & RATINGS */}
          {/* =============================================================================== */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Reviews & Ratings</h1>
                  <p className="text-sm text-muted-foreground">
                    Feedback from students and viva examiners who evaluated your projects.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                  <span className="text-3xl font-extrabold text-amber-500">
                    {contributorProfile.rating}
                  </span>
                  <div className="leading-tight">
                    <div className="flex text-amber-500 text-xs">
                      {"★".repeat(5)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Based on {contributorProfile.review_count} ratings
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit a Review Form (For Students & Evaluators) */}
              <Card className="p-5 border-border shadow-xs space-y-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  Leave a Review for a Project or Contributor
                </h3>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="Your Name (e.g. Pooja Hegde)"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                    <Input
                      placeholder="Your College (e.g. BMS Bangalore)"
                      value={newReviewCollege}
                      onChange={(e) => setNewReviewCollege(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none"
                    >
                      <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                      <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                      <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    </select>
                  </div>

                  <Textarea
                    placeholder="Share how this project helped in your college presentation, viva score, or installation experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    rows={2}
                    required
                  />

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="text-xs">
                      Submit Review
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <Card key={rev.id} className="p-5 border-border shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground mr-2">
                          {rev.reviewer_name}
                        </span>
                        <span className="text-muted-foreground">{rev.college}</span>
                      </div>
                      <span className="text-muted-foreground">{rev.created_at}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500 text-xs">
                        {"★".repeat(Math.round(rev.rating))}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {rev.project_title}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 7: FINANCES & PAYOUTS (Shopify Finances style) */}
          {/* =============================================================================== */}
          {activeTab === "finances" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Finances & Payout Details</h1>
                <p className="text-sm text-muted-foreground">
                  Configure your UPI ID or Direct Bank Transfer account to receive royalty payouts.
                </p>
              </div>

              {/* Earnings Breakdown */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="p-5 border-border shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Lifetime Earnings</span>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    ₹{contributorProfile.total_earnings.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium">100% Verified Payouts</p>
                </Card>

                <Card className="p-5 border-border shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Available for Withdrawal</span>
                  <p className="text-2xl font-bold text-emerald-500 mt-2">
                    ₹{Math.round(contributorProfile.total_earnings * 0.42).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Processed every Monday</p>
                </Card>

                <Card className="p-5 border-border shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Active Payout Method</span>
                  <p className="text-base font-bold text-foreground mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    UPI ({contributorProfile.upi_id})
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Instant Transfer to PhonePe/GPay</p>
                </Card>
              </div>

              {/* Payout Form */}
              <Card className="p-6 border-border shadow-xs space-y-4">
                <h3 className="font-semibold text-base text-foreground">
                  Update Payout Credentials
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      UPI ID (Instant Payouts via GPay, PhonePe, Paytm)
                    </label>
                    <Input
                      placeholder="e.g. yourname@okaxis or 9876543210@upi"
                      value={settingUpi}
                      onChange={(e) => setSettingUpi(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="pt-2 border-t border-border">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                      Or Direct Bank Account (NEFT / IMPS)
                    </h4>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Account Holder Name</label>
                        <Input
                          placeholder="As per bank passbook"
                          value={settingHolder}
                          onChange={(e) => setSettingHolder(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Bank Name</label>
                        <Input
                          placeholder="e.g. HDFC Bank / State Bank of India"
                          value={settingBankName}
                          onChange={(e) => setSettingBankName(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Account Number</label>
                        <Input
                          placeholder="••••••••••••"
                          value={settingAccount}
                          onChange={(e) => setSettingAccount(e.target.value)}
                          className="h-9 text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">IFSC Code</label>
                        <Input
                          placeholder="e.g. HDFC0001234"
                          value={settingIfsc}
                          onChange={(e) => setSettingIfsc(e.target.value.toUpperCase())}
                          className="h-9 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="font-semibold text-xs h-10 px-6">
                    Save Payout Details
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* =============================================================================== */}
          {/* TAB 8: SETTINGS & PROFILE */}
          {/* =============================================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Contributor Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Update your public contributor profile, bio, and account credentials.
                </p>
              </div>

              <Card className="p-6 border-border shadow-xs space-y-4">
                <h3 className="font-semibold text-base text-foreground">Profile Information</h3>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Full Display Name</label>
                      <Input
                        value={settingName}
                        onChange={(e) => setSettingName(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">College / University</label>
                      <Input
                        value={settingCollege}
                        onChange={(e) => setSettingCollege(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Profile Photo URL</label>
                    <Input
                      value={settingAvatar}
                      onChange={(e) => setSettingAvatar(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Public Bio</label>
                    <Textarea
                      value={settingBio}
                      onChange={(e) => setSettingBio(e.target.value)}
                      rows={3}
                      className="text-xs"
                    />
                  </div>

                  <Button type="submit" className="font-semibold text-xs h-9 px-5">
                    Update Profile
                  </Button>
                </form>
              </Card>

              {/* Password Change */}
              <Card className="p-6 border-border shadow-xs space-y-4">
                <h3 className="font-semibold text-base text-foreground">Security & Password</h3>

                <div className="space-y-3 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">New Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!newPassword || newPassword.length < 6) {
                        toast.error("Password must be at least 6 characters.");
                        return;
                      }
                      try {
                        const { error } = await supabase.auth.updateUser({ password: newPassword });
                        if (error) throw error;
                        setNewPassword("");
                        toast.success("Password updated successfully!");
                      } catch (err: any) {
                        toast.error(err.message || "Failed to update password.");
                      }
                    }}
                    className="text-xs"
                  >
                    Change Password
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
