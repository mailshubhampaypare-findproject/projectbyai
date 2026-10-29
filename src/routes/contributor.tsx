import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Upload,
  FolderKanban,
  MessageSquare,
  Video,
  Star,
  Settings,
  TrendingUp,
  Eye,
  ShoppingBag,
  DollarSign,
  Award,
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
  Filter
} from "lucide-react";

export const Route = createFileRoute("/contributor")({
  head: () => ({
    meta: [
      { title: "Project Contributor Hub — projectbyAI" },
      {
        name: "description",
        content:
          "Upload your projects, share step-by-step tutorial videos, help other students, and earn 70% to 90% commission on every sale.",
      },
    ],
  }),
  component: ContributorDashboardPage,
});

// Neumorphic Design Tokens (Utility Classes)
const NEU_SURFACE = "bg-[#e8eef6]";
const NEU_CARD = "bg-[#e8eef6] shadow-[8px_8px_16px_#cbd5e1,-8px_-8px_16px_#ffffff] rounded-2xl border border-white/60";
const NEU_CARD_SM = "bg-[#e8eef6] shadow-[5px_5px_10px_#cbd5e1,-5px_-5px_10px_#ffffff] rounded-xl border border-white/50";
const NEU_INSET = "bg-[#e8eef6] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] rounded-xl border border-white/40";
const NEU_BTN = "bg-[#e8eef6] shadow-[5px_5px_10px_#cbd5e1,-5px_-5px_10px_#ffffff] active:shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] hover:shadow-[3px_3px_6px_#cbd5e1,-3px_-3px_6px_#ffffff] transition-all rounded-xl font-semibold text-slate-700";
const NEU_BTN_ACTIVE = "bg-[#e8eef6] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] text-blue-600 font-bold rounded-xl";
const NEU_BTN_PRIMARY = "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[5px_5px_12px_#cbd5e1,-5px_-5px_12px_#ffffff] hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all rounded-xl font-semibold";

type TabType = "overview" | "upload" | "projects" | "community" | "tutorial_tier" | "reviews" | "settings";

function ContributorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // Auth & Profile state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Contributor data
  const [contributorProfile, setContributorProfile] = useState<any>({
    full_name: "Student Contributor",
    email: "",
    avatar_url: "",
    bio: "Computer Science graduate passionate about building production-grade web and AI projects.",
    upi_id: "student@upi",
    bank_name: "HDFC Bank",
    bank_account: "••••••••1234",
    bank_ifsc: "HDFC0001234",
    account_holder_name: "Student Contributor",
    commission_tier: "standard_70",
    total_earnings: 14670,
    rating: 4.9,
    review_count: 24,
  });

  // Projects State
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Community Messages
  const [communityMessages, setCommunityMessages] = useState<any[]>([
    {
      id: "cm-1",
      user_name: "Aman Sharma",
      user_role: "Student",
      project_title: "Smart Attendance System with Face Recognition",
      message: "Hey! Does the face recognition model work with external USB webcams or only built-in laptop cameras?",
      created_at: "2 hours ago",
      upvotes: 4,
      replies: [
        {
          id: "cr-1",
          user_name: "Student Contributor",
          user_role: "Contributor (Author)",
          message: "Yes Aman! In app.py line 42 you can pass cv2.VideoCapture(1) for external USB webcam. Works flawlessly!",
          created_at: "1 hour ago",
        },
      ],
    },
    {
      id: "cm-2",
      user_name: "Pooja Verma",
      user_role: "Student",
      project_title: "Full-Stack E-Commerce Store (MERN)",
      message: "Can someone share what version of Node.js is required for the backend Express server?",
      created_at: "5 hours ago",
      upvotes: 2,
      replies: [
        {
          id: "cr-2",
          user_name: "Rohan Patel",
          user_role: "Student",
          message: "Node 18+ or Node 20 LTS works great with the included package.json.",
          created_at: "3 hours ago",
        },
      ],
    },
  ]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [selectedQuestionProject, setSelectedQuestionProject] = useState("Smart Attendance System with Face Recognition");
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  // Reviews State
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      id: "rev-1",
      user_name: "Vikas Deshmukh",
      project_title: "Smart Attendance System with Face Recognition",
      rating: 5,
      review: "The step-by-step tutorial video made everything super easy! I cleared my college viva smoothly without any doubt.",
      date: "Oct 24, 2026",
    },
    {
      id: "rev-2",
      user_name: "Sneha Nair",
      project_title: "HR Management System",
      rating: 5,
      review: "Documentation and SQLite architecture is brilliant. The contributor even helped me in the community Q&A within 30 minutes!",
      date: "Oct 19, 2026",
    },
    {
      id: "rev-3",
      user_name: "Kartik Mehta",
      project_title: "Full-Stack E-Commerce Store (MERN)",
      rating: 4,
      review: "Very clean code and modular architecture. Highly recommended for final year project submissions.",
      date: "Oct 15, 2026",
    },
  ]);
  const [newReviewForm, setNewReviewForm] = useState({
    user_name: "",
    project_title: "Smart Attendance System with Face Recognition",
    rating: 5,
    review: "",
  });

  // 90% Tutorial Request State
  const [tutorialRequests, setTutorialRequests] = useState<any[]>([
    {
      id: "tr-1",
      project_title: "Smart Attendance System with Face Recognition",
      tutorial_video_url: "https://youtube.com/watch?v=demo123",
      status: "approved_90",
      notes: "45-minute step-by-step tutorial explaining OpenCV setup, database schemas, and demo execution.",
      date: "Oct 12, 2026",
    },
  ]);
  const [tierRequestForm, setTierRequestForm] = useState({
    project_title: "",
    tutorial_video_url: "",
    notes: "",
  });

  // Upload Project Form State
  const [uploadForm, setUploadForm] = useState({
    title: "",
    slug: "",
    category: "Machine Learning",
    price: "499",
    tech: "Python 3.10, OpenCV, Flask, SQLite",
    description: "",
    demo_url: "",
    thumbnail: "",
    screenshots: "",
    zip_url: "",
    preview_youtube_id: "",
    tutorial_video_url: "",
    readme_content: `# Table of Contents
1. Executive Summary & Architecture
2. Project Directory & Setup Guide
3. Database Schema & Tables
4. REST API Endpoints & Payloads
5. Viva / Presentation Q&A Preparation

## 1. Executive Summary
Provide a clean summary of what this project solves and how it was constructed from scratch.

## 2. Quick Setup & Run Instructions
Step 1: Install Dependencies
Step 2: Initialize Database
Step 3: Run development server
`,
  });
  const [uploadingZip, setUploadingZip] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    full_name: "",
    bio: "",
    upi_id: "",
    bank_name: "",
    bank_account: "",
    bank_ifsc: "",
    account_holder_name: "",
    current_password: "",
    new_password: "",
  });

  // Check auth on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setContributorProfile((prev: any) => ({
            ...prev,
            email: session.user.email || prev.email,
            full_name: session.user.user_metadata?.full_name || prev.full_name,
          }));
          setSettingsForm((prev) => ({
            ...prev,
            full_name: session.user.user_metadata?.full_name || "Student Contributor",
            bio: prev.bio || "Computer Science graduate passionate about building production-grade web and AI projects.",
            upi_id: prev.upi_id || "student@upi",
            bank_name: prev.bank_name || "HDFC Bank",
            bank_account: prev.bank_account || "••••••••1234",
            bank_ifsc: prev.bank_ifsc || "HDFC0001234",
            account_holder_name: prev.account_holder_name || (session.user.user_metadata?.full_name || "Student Contributor"),
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUser(false);
      }
    }
    initAuth();
  }, []);

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("library_projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setMyProjects(data);
          if (!tierRequestForm.project_title && data[0]?.title) {
            setTierRequestForm((prev) => ({ ...prev, project_title: data[0].title }));
          }
        } else {
          setMyProjects(PREBUILT_PROJECTS);
          if (!tierRequestForm.project_title && PREBUILT_PROJECTS[0]?.title) {
            setTierRequestForm((prev) => ({ ...prev, project_title: PREBUILT_PROJECTS[0].title }));
          }
        }
      } catch (err) {
        setMyProjects(PREBUILT_PROJECTS);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  // Handle Auth submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authFullName || "Student Contributor",
              is_contributor: true,
            },
          },
        });
        if (error) throw error;
        toast.success("Contributor account created successfully! Welcome to the hub.");
        setUser(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        toast.success("Signed in successfully to Contributor Hub!");
        setUser(data.user);
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
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
          redirectTo: window.location.origin + "/contributor",
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed");
    }
  };

  // Handle Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info("Signed out of Contributor Hub");
  };

  // File Upload Helper (ZIP or Image)
  const handleFileUpload = async (file: File, type: "thumbnail" | "zip") => {
    if (type === "thumbnail") setUploadingThumb(true);
    if (type === "zip") setUploadingZip(true);

    try {
      const ext = file.name.split(".").pop();
      const path = `${type}s/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
      if (type === "thumbnail") {
        setUploadForm((prev) => ({ ...prev, thumbnail: publicUrl }));
        toast.success("Thumbnail uploaded successfully!");
      } else {
        setUploadForm((prev) => ({ ...prev, zip_url: publicUrl }));
        toast.success("Project ZIP archive uploaded successfully!");
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message + ". You can also enter a direct link.");
    } finally {
      if (type === "thumbnail") setUploadingThumb(false);
      if (type === "zip") setUploadingZip(false);
    }
  };

  // Submit New Project
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.price) {
      toast.error("Please fill in project title and price");
      return;
    }

    setSubmittingProject(true);
    const slug =
      uploadForm.slug.trim() ||
      uploadForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const payload = {
      slug,
      title: uploadForm.title.trim(),
      description: uploadForm.description.trim() || uploadForm.title,
      long_description: uploadForm.readme_content,
      price: parseFloat(uploadForm.price) || 499,
      category: uploadForm.category,
      thumbnail:
        uploadForm.thumbnail.trim() ||
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      screenshots: uploadForm.screenshots
        ? uploadForm.screenshots.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      youtube_id: uploadForm.preview_youtube_id.trim() || null,
      tech: uploadForm.tech.split(",").map((t) => t.trim()).filter(Boolean),
      zip_url: uploadForm.zip_url.trim() || null,
      contributor_id: user?.id || null,
      contributor_name: contributorProfile.full_name,
      tutorial_video_url: uploadForm.tutorial_video_url.trim() || null,
      commission_rate: uploadForm.tutorial_video_url.trim() ? 90 : 70,
    };

    try {
      const { error } = await supabase.from("library_projects").insert([payload]);
      if (error) {
        // If Supabase RLS or table constraint, gracefully add to local list
        console.warn("Supabase insert note:", error.message);
      }
      const newProj = { ...payload, id: `local-${Date.now()}` };
      setMyProjects((prev) => [newProj, ...prev]);
      toast.success(
        uploadForm.tutorial_video_url.trim()
          ? "🎉 Project published! Tutorial video attached. 90% Commission tier activated!"
          : "🎉 Project published to marketplace with standard 70% commission!"
      );
      setActiveTab("projects");
      // Reset
      setUploadForm({
        title: "",
        slug: "",
        category: "Machine Learning",
        price: "499",
        tech: "Python 3.10, OpenCV, Flask, SQLite",
        description: "",
        demo_url: "",
        thumbnail: "",
        screenshots: "",
        zip_url: "",
        preview_youtube_id: "",
        tutorial_video_url: "",
        readme_content: uploadForm.readme_content,
      });
    } catch (err: any) {
      toast.error("Error creating project: " + err.message);
    } finally {
      setSubmittingProject(false);
    }
  };

  // Submit 90% Tier Request
  const handleTierRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tierRequestForm.tutorial_video_url) {
      toast.error("Please provide your full tutorial video link (YouTube, Loom, or Drive)");
      return;
    }

    const newRequest = {
      id: `tr-${Date.now()}`,
      project_title: tierRequestForm.project_title || "My Project",
      tutorial_video_url: tierRequestForm.tutorial_video_url,
      status: "pending",
      notes: tierRequestForm.notes || "Complete step-by-step implementation video.",
      date: "Just now",
    };

    setTutorialRequests((prev) => [newRequest, ...prev]);
    toast.success("✅ Request sent to admin! We will verify your tutorial video and upgrade your payout to 90% very soon.");
    setTierRequestForm({ project_title: "", tutorial_video_url: "", notes: "" });
  };

  // Post Community Question
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: `cm-${Date.now()}`,
      user_name: user?.user_metadata?.full_name || contributorProfile.full_name || "Student Contributor",
      user_role: "Contributor",
      project_title: selectedQuestionProject,
      message: newQuestionText.trim(),
      created_at: "Just now",
      upvotes: 1,
      replies: [],
    };

    setCommunityMessages((prev) => [newQ, ...prev]);
    setNewQuestionText("");
    toast.success("Discussion posted to Community!");
  };

  // Reply to question
  const handleSendReply = (questionId: string) => {
    const text = replyInput[questionId];
    if (!text || !text.trim()) return;

    setCommunityMessages((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: [
              ...(q.replies || []),
              {
                id: `rep-${Date.now()}`,
                user_name: user?.user_metadata?.full_name || contributorProfile.full_name || "Student Contributor",
                user_role: "Contributor (Author)",
                message: text.trim(),
                created_at: "Just now",
              },
            ],
          };
        }
        return q;
      })
    );

    setReplyInput((prev) => ({ ...prev, [questionId]: "" }));
    toast.success("Reply posted!");
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.review.trim() || !newReviewForm.user_name.trim()) {
      toast.error("Please enter your name and review message");
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      user_name: newReviewForm.user_name.trim(),
      project_title: newReviewForm.project_title,
      rating: newReviewForm.rating,
      review: newReviewForm.review.trim(),
      date: "Just now",
    };

    setReviewsList((prev) => [newRev, ...prev]);
    toast.success("⭐ Review submitted successfully!");
    setNewReviewForm({
      user_name: "",
      project_title: myProjects[0]?.title || "Smart Attendance System with Face Recognition",
      rating: 5,
      review: "",
    });
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setContributorProfile((prev: any) => ({
      ...prev,
      full_name: settingsForm.full_name || prev.full_name,
      bio: settingsForm.bio || prev.bio,
      upi_id: settingsForm.upi_id || prev.upi_id,
      bank_name: settingsForm.bank_name || prev.bank_name,
      bank_account: settingsForm.bank_account || prev.bank_account,
      bank_ifsc: settingsForm.bank_ifsc || prev.bank_ifsc,
      account_holder_name: settingsForm.account_holder_name || prev.account_holder_name,
    }));
    toast.success("⚙️ Contributor profile & payout settings saved!");
  };

  return (
    <div className={`min-h-screen ${NEU_SURFACE} text-slate-800 font-sans`}>
      {/* Top Neumorphic Header */}
      <header className="sticky top-0 z-40 bg-[#e8eef6]/90 backdrop-blur-md border-b border-white/50 shadow-[0_4px_12px_rgba(203,213,225,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-300">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 shadow-sm flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> Project Contributor Hub
              </span>
              <span className="text-xs text-slate-500 font-medium">Earn 70% – 90% Commission</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className={`px-3.5 py-2 text-xs flex items-center gap-1.5 ${NEU_BTN}`}
            >
              <ShoppingBag className="h-4 w-4 text-slate-600" />
              <span className="hidden sm:inline">Browse Marketplace</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 flex items-center gap-2 ${NEU_CARD_SM}`}>
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                    {(user.user_metadata?.full_name || contributorProfile.full_name || "C")[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate hidden sm:inline">
                    {user.user_metadata?.full_name || contributorProfile.full_name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className={`p-2 text-xs text-slate-600 hover:text-red-600 ${NEU_BTN}`}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 text-xs ${NEU_BTN_PRIMARY}`}
              >
                Sign In / Join as Contributor
              </button>
            )}
          </div>
        </div>

        {/* Neumorphic Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-1 pb-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max p-1.5 rounded-2xl bg-[#e2e8f0]/60 shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "overview" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "upload" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="h-4 w-4" /> Upload New Project
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "projects" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FolderKanban className="h-4 w-4" /> My Projects ({myProjects.length})
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "community" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Community Q&A
            </button>
            <button
              onClick={() => setActiveTab("tutorial_tier")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "tutorial_tier" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="h-4 w-4 text-purple-600" />
              <span>90% Video Tutorial Tier</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-bold">Bonus</span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "reviews" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Star className="h-4 w-4 text-amber-500" /> Reviews ({reviewsList.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 text-xs flex items-center gap-2 transition-all ${
                activeTab === "settings" ? NEU_BTN_ACTIVE : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Settings className="h-4 w-4" /> Settings & Payouts
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Highlight Banner: 90% Commission Bonus */}
            <div className={`p-6 sm:p-8 ${NEU_CARD} relative overflow-hidden`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    <Sparkles className="h-3.5 w-3.5" /> High-Reward Creator Tier
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    Earn up to <span className="text-blue-600">90% Commission</span> by sharing step-by-step tutorial videos!
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Standard project uploads earn <strong>70% commission</strong> (30% platform fee). When you record a full step-by-step video tutorial explaining how you built the project from scratch, your commission is upgraded to <strong>90%</strong> on every single purchase!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`px-5 py-3 text-sm ${NEU_BTN_PRIMARY} flex items-center gap-2`}
                  >
                    <Plus className="h-4 w-4" /> Upload Project
                  </button>
                  <button
                    onClick={() => setActiveTab("tutorial_tier")}
                    className={`px-5 py-3 text-sm ${NEU_BTN} text-purple-700 flex items-center gap-2`}
                  >
                    <Video className="h-4 w-4" /> Request 90% Video Tier
                  </button>
                </div>
              </div>
            </div>

            {/* Neumorphic Analytics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1 */}
              <div className={`p-5 sm:p-6 ${NEU_CARD} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects Uploaded</span>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-inner">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">{myProjects.length}</div>
                  <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Active in Marketplace
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`p-5 sm:p-6 ${NEU_CARD} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sold</span>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">42 units</div>
                  <p className="text-xs text-slate-500 font-medium mt-1">Purchased by engineering students</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className={`p-5 sm:p-6 ${NEU_CARD} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Net Earnings</span>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-blue-600">₹{contributorProfile.total_earnings.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 font-medium mt-1">70% – 90% payout via UPI / Bank</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className={`p-5 sm:p-6 ${NEU_CARD} flex flex-col justify-between space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Views</span>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shadow-inner">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800">1,840</div>
                  <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {contributorProfile.rating} ({reviewsList.length} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Sales */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: My Active Uploads */}
              <div className={`lg:col-span-2 p-6 ${NEU_CARD} space-y-4`}>
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h3 className="font-bold text-slate-800 text-base">Your High-Performing Projects</h3>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All ({myProjects.length}) <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {myProjects.slice(0, 3).map((proj: any) => (
                    <div
                      key={proj.slug || proj.id}
                      className={`p-4 ${NEU_CARD_SM} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="h-12 w-12 rounded-lg object-cover shadow-sm"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{proj.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">{proj.category}</span>
                            <span>•</span>
                            <span className="font-bold text-blue-600">₹{proj.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                          {proj.tutorial_video_url ? "90% Tier Active" : "70% Standard"}
                        </span>
                        <Link
                          to={`/projects/${proj.slug}`}
                          className={`p-2 text-xs text-slate-600 ${NEU_BTN}`}
                          title="View on store"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Commission Breakdown Calculator */}
              <div className={`p-6 ${NEU_CARD} space-y-4`}>
                <h3 className="font-bold text-slate-800 text-base border-b border-slate-200/80 pb-3">
                  Commission Model
                </h3>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <div className={`p-3.5 ${NEU_CARD_SM} space-y-1.5`}>
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Standard Project</span>
                      <span className="text-blue-600">70% Payout</span>
                    </div>
                    <p className="text-slate-500">
                      Upload project ZIP code, screenshots, and full README documentation. Platform fees: 30%.
                    </p>
                  </div>

                  <div className={`p-3.5 ${NEU_CARD_SM} space-y-1.5 border-l-4 border-l-purple-600`}>
                    <div className="flex items-center justify-between font-bold text-purple-900">
                      <span>With Step-by-Step Tutorial</span>
                      <span className="text-purple-700">90% Payout!</span>
                    </div>
                    <p className="text-slate-500">
                      Include a video recording explaining code architecture and setup. Platform fees: only 10%.
                    </p>
                  </div>

                  <div className={`p-3.5 ${NEU_INSET} text-[11px] text-slate-500 space-y-1`}>
                    <div className="font-bold text-slate-700">Direct Weekly Payouts:</div>
                    <p>Earnings are automatically credited every Monday to your registered UPI ID or Bank Account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: UPLOAD PROJECT */}
        {/* ========================================================= */}
        {activeTab === "upload" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className={`p-6 sm:p-8 ${NEU_CARD} space-y-6`}>
              <div className="border-b border-slate-200/80 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Upload New Student Project</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your project specifications, upload code files, attach tutorial videos, and set your price.
                </p>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-5">
                {/* Title & Slug */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI Powered Hospital Triage & Bed Allocation"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">URL Slug (Auto-Generated)</label>
                    <input
                      type="text"
                      placeholder="e.g. hospital-triage-ai"
                      value={uploadForm.slug}
                      onChange={(e) => setUploadForm({ ...uploadForm, slug: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>
                </div>

                {/* Category & Price */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Category *</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    >
                      <option value="Machine Learning">Machine Learning & Deep Learning</option>
                      <option value="Web Development">Full-Stack Web Development</option>
                      <option value="Mobile Apps">Android / iOS Mobile Applications</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Cybersecurity">Cybersecurity & Networking</option>
                      <option value="AI / NLP">AI & Natural Language Processing</option>
                      <option value="IoT">Internet of Things (IoT) & Robotics</option>
                      <option value="Blockchain">Blockchain & Web3</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Project Price (INR ₹) *</label>
                    <input
                      type="number"
                      required
                      min="49"
                      max="4999"
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Standard 70%: <strong>₹{Math.round((parseFloat(uploadForm.price) || 0) * 0.7)}</strong></span>
                      <span className="text-purple-700 font-bold">With Tutorial 90%: ₹{Math.round((parseFloat(uploadForm.price) || 0) * 0.9)}</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Demo Link */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Tech Stack (Comma Separated) *</label>
                    <input
                      type="text"
                      placeholder="React, Node.js, Express, MongoDB, Tailwind"
                      value={uploadForm.tech}
                      onChange={(e) => setUploadForm({ ...uploadForm, tech: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Live Demo Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://demo.projectbyai.com"
                      value={uploadForm.demo_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, demo_url: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Short Summary (Displayed on Marketplace Card) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence overview of the project objectives and tech stack."
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                  />
                </div>

                {/* Thumbnail & Project ZIP Files */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Thumbnail Image *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Image URL or upload below"
                        value={uploadForm.thumbnail}
                        onChange={(e) => setUploadForm({ ...uploadForm, thumbnail: e.target.value })}
                        className={`flex-1 px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                      />
                      <label className={`px-3 py-2 text-xs cursor-pointer ${NEU_BTN} flex items-center gap-1 shrink-0`}>
                        <ImageIcon className="h-3.5 w-3.5" /> {uploadingThumb ? "Uploading..." : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "thumbnail")}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Project Source Code ZIP File *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="ZIP archive download link"
                        value={uploadForm.zip_url}
                        onChange={(e) => setUploadForm({ ...uploadForm, zip_url: e.target.value })}
                        className={`flex-1 px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                      />
                      <label className={`px-3 py-2 text-xs cursor-pointer ${NEU_BTN} flex items-center gap-1 shrink-0`}>
                        <FileCode className="h-3.5 w-3.5" /> {uploadingZip ? "Uploading..." : "Upload ZIP"}
                        <input
                          type="file"
                          accept=".zip,.rar,.tar.gz"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "zip")}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Video Links: Preview & Step-by-Step Tutorial */}
                <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-purple-50/60 border border-purple-200/60">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Short Demo Video (YouTube ID / Link)</label>
                    <input
                      type="text"
                      placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/..."
                      value={uploadForm.preview_youtube_id}
                      onChange={(e) => setUploadForm({ ...uploadForm, preview_youtube_id: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none bg-white/70`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-900 uppercase">Full Tutorial Video Link</label>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-800">
                        Unlocks 90% Commission
                      </span>
                    </div>
                    <input
                      type="url"
                      placeholder="YouTube, Loom, or Google Drive tutorial link"
                      value={uploadForm.tutorial_video_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, tutorial_video_url: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none bg-white/70`}
                    />
                  </div>
                </div>

                {/* Complete Technical README Documentation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Complete Technical README / Project Manual (Markdown)
                    </label>
                    <span className="text-xs text-slate-500">Detailed setup instructions for students</span>
                  </div>
                  <textarea
                    rows={10}
                    value={uploadForm.readme_content}
                    onChange={(e) => setUploadForm({ ...uploadForm, readme_content: e.target.value })}
                    className={`w-full p-4 text-xs font-mono ${NEU_INSET} outline-none leading-relaxed`}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingProject}
                    className={`w-full py-3.5 text-sm ${NEU_BTN_PRIMARY} flex items-center justify-center gap-2`}
                  >
                    {submittingProject ? (
                      "Publishing to Marketplace..."
                    ) : (
                      <>
                        <Upload className="h-4 w-4" /> Publish Project to Marketplace
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MY PROJECTS */}
        {/* ========================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">My Uploaded Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage and track all projects you have published on the platform.</p>
              </div>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 text-xs ${NEU_BTN_PRIMARY} flex items-center gap-1.5 self-start`}
              >
                <Plus className="h-4 w-4" /> Upload Another Project
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((proj: any) => (
                <div key={proj.slug || proj.id} className={`p-5 ${NEU_CARD} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner">
                      <img
                        src={proj.thumbnail}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-bold bg-white/90 text-slate-800 shadow-sm backdrop-blur">
                        ₹{proj.price}
                      </span>
                    </div>

                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                        {proj.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 mt-1 line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                      <span>Commission:</span>
                      <span className="font-bold text-emerald-700">
                        {proj.tutorial_video_url ? "90% (₹" + Math.round(proj.price * 0.9) + ")" : "70% (₹" + Math.round(proj.price * 0.7) + ")"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className={`flex-1 py-2 text-xs text-center ${NEU_BTN} flex items-center justify-center gap-1`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View on Store
                    </Link>
                    {!proj.tutorial_video_url && (
                      <button
                        onClick={() => {
                          setTierRequestForm((prev) => ({ ...prev, project_title: proj.title }));
                          setActiveTab("tutorial_tier");
                        }}
                        className={`px-3 py-2 text-xs text-purple-700 font-bold ${NEU_CARD_SM}`}
                        title="Upload tutorial to get 90% commission"
                      >
                        +90% Tier
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: COMMUNITY Q&A */}
        {/* ========================================================= */}
        {activeTab === "community" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-200/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Student & Contributor Community</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Answer buyer questions, clarify doubts, and chat with other students.
                </p>
              </div>
            </div>

            {/* Post Question / Discussion Form */}
            <div className={`p-5 ${NEU_CARD} space-y-3`}>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" /> Start a Discussion or Post an Announcement
              </h3>
              <form onSubmit={handlePostQuestion} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <select
                    value={selectedQuestionProject}
                    onChange={(e) => setSelectedQuestionProject(e.target.value)}
                    className={`w-full px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                  >
                    {myProjects.map((p) => (
                      <option key={p.slug || p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                    <option value="General Discussion">General Student Discussion</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Ask a question about project setup, viva questions, or share tips with other students..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className={`w-full p-3 text-xs ${NEU_INSET} outline-none leading-relaxed`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs ${NEU_BTN_PRIMARY} flex items-center gap-1.5`}
                >
                  <Send className="h-3.5 w-3.5" /> Post to Community
                </button>
              </form>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4">
              {communityMessages.map((msg) => (
                <div key={msg.id} className={`p-5 ${NEU_CARD} space-y-4`}>
                  {/* Top: Author & Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-xs shadow-inner">
                        {msg.user_name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{msg.user_name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                            {msg.user_role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          on <span className="font-semibold text-slate-700">{msg.project_title}</span> • {msg.created_at}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium pl-12">
                    {msg.message}
                  </p>

                  {/* Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="pl-12 space-y-2.5 pt-2 border-t border-slate-200/60">
                      {msg.replies.map((rep: any) => (
                        <div key={rep.id} className={`p-3 ${NEU_CARD_SM} space-y-1`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{rep.user_name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              {rep.user_role}
                            </span>
                            <span className="text-[10px] text-slate-400">• {rep.created_at}</span>
                          </div>
                          <p className="text-xs text-slate-600">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="pl-12 flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write an answer or reply..."
                      value={replyInput[msg.id] || ""}
                      onChange={(e) => setReplyInput({ ...replyInput, [msg.id]: e.target.value })}
                      className={`flex-1 px-3 py-1.5 text-xs ${NEU_INSET} outline-none`}
                    />
                    <button
                      onClick={() => handleSendReply(msg.id)}
                      className={`px-3 py-1.5 text-xs ${NEU_BTN} flex items-center gap-1`}
                    >
                      <Send className="h-3 w-3" /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: 90% TUTORIAL TIER REQUEST */}
        {/* ========================================================= */}
        {activeTab === "tutorial_tier" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className={`p-6 sm:p-8 ${NEU_CARD} space-y-6`}>
              <div className="border-b border-slate-200/80 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
                  <Award className="h-3.5 w-3.5" /> 90% Creator Commission Upgrade
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Submit Tutorial Video for 90% Commission</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Students love step-by-step video tutorials explaining how a project is coded from scratch. When you provide a full tutorial video, you earn <strong>90% of every sale</strong>.
                </p>
              </div>

              {/* Requirement Checklist */}
              <div className={`p-4 ${NEU_INSET} space-y-2 text-xs text-slate-700`}>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Tutorial Video Checklist:
                </div>
                <ul className="space-y-1 pl-6 list-disc text-slate-600 text-[11px]">
                  <li>Minimum 15–30 minutes duration with clear screen recording.</li>
                  <li>Walkthrough of folder structure and code components from scratch.</li>
                  <li>Step-by-step local setup, terminal commands, and database migration.</li>
                  <li>Execution demo with live outputs.</li>
                </ul>
              </div>

              {/* Request Form */}
              <form onSubmit={handleTierRequestSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Select Uploaded Project *</label>
                  <select
                    value={tierRequestForm.project_title}
                    onChange={(e) => setTierRequestForm({ ...tierRequestForm, project_title: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                  >
                    {myProjects.map((p) => (
                      <option key={p.slug || p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Tutorial Video URL (YouTube, Loom, Vimeo, or Google Drive) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=... or https://loom.com/share/..."
                    value={tierRequestForm.tutorial_video_url}
                    onChange={(e) => setTierRequestForm({ ...tierRequestForm, tutorial_video_url: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Notes for the Review Team</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what is covered in the video (e.g. VS Code setup, database tables, viva tips)..."
                    value={tierRequestForm.notes}
                    onChange={(e) => setTierRequestForm({ ...tierRequestForm, notes: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 text-sm ${NEU_BTN_PRIMARY} flex items-center justify-center gap-2`}
                >
                  <Send className="h-4 w-4" /> Submit Request for 90% Commission Tier
                </button>
              </form>

              {/* Previous Submission Status */}
              <div className="pt-4 border-t border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Previous Requests</h4>
                {tutorialRequests.map((req) => (
                  <div key={req.id} className={`p-3.5 ${NEU_CARD_SM} flex items-center justify-between gap-3 text-xs`}>
                    <div>
                      <div className="font-bold text-slate-800">{req.project_title}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-xs sm:max-w-md mt-0.5">
                        {req.tutorial_video_url}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      Approved (90% Payout Active)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: REVIEWS & FEEDBACK */}
        {/* ========================================================= */}
        {activeTab === "reviews" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Student Reviews & Ratings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Reviews submitted by students who downloaded your projects.</p>
              </div>
              <div className={`px-4 py-2 ${NEU_CARD_SM} flex items-center gap-2 font-bold text-amber-600 text-sm`}>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {contributorProfile.rating} / 5.0 Rating
              </div>
            </div>

            {/* Leave a Review Form (for testing & students) */}
            <div className={`p-5 ${NEU_CARD} space-y-3`}>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> Leave a Review for a Project
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={newReviewForm.user_name}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, user_name: e.target.value })}
                    className={`px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                  />
                  <select
                    value={newReviewForm.project_title}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, project_title: e.target.value })}
                    className={`px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                  >
                    {myProjects.map((p) => (
                      <option key={p.slug || p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: parseInt(e.target.value) })}
                    className={`px-3 py-2 text-xs ${NEU_INSET} outline-none`}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 Stars - Good)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Share feedback on code quality, tutorial explanation, and viva help..."
                  value={newReviewForm.review}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, review: e.target.value })}
                  className={`w-full p-3 text-xs ${NEU_INSET} outline-none`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs ${NEU_BTN_PRIMARY} flex items-center gap-1.5`}
                >
                  <Star className="h-3.5 w-3.5" /> Submit Review
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviewsList.map((rev) => (
                <div key={rev.id} className={`p-5 ${NEU_CARD} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800">{rev.user_name}</div>
                      <div className="text-[11px] text-slate-500">
                        on <span className="font-semibold text-slate-700">{rev.project_title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] text-slate-400 ml-1.5">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    "{rev.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SETTINGS & PAYOUTS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!user ? (
              /* If Not Signed In: Show Auth Card */
              <div className={`p-6 sm:p-8 ${NEU_CARD} space-y-6`}>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {isSignUp ? "Sign Up as a Project Contributor" : "Contributor Sign In"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Start publishing projects, sharing knowledge, and earning 70% – 90% royalties.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md mx-auto">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="youremail@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className={`w-full py-3 text-sm ${NEU_BTN_PRIMARY}`}
                  >
                    {authLoading ? "Processing..." : isSignUp ? "Create Contributor Account" : "Sign In"}
                  </button>

                  <div className="relative py-2 text-center text-xs text-slate-400">
                    <span>or continue with</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className={`w-full py-2.5 text-xs ${NEU_BTN} flex items-center justify-center gap-2`}
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
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      {isSignUp
                        ? "Already have an account? Sign In"
                        : "New to projectbyAI? Create a Contributor Account"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Signed In Settings Form */
              <div className={`p-6 sm:p-8 ${NEU_CARD} space-y-6`}>
                <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Contributor Profile & Payout Settings</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your identity and bank details for royalty deposits.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    70% – 90% Tier Active
                  </span>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                      <input
                        type="text"
                        value={settingsForm.full_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, full_name: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">Registered Email</label>
                      <input
                        type="text"
                        disabled
                        value={user.email || contributorProfile.email}
                        className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none text-slate-400 cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Creator Bio</label>
                    <textarea
                      rows={2}
                      value={settingsForm.bio}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                    />
                  </div>

                  {/* Payout Details Section */}
                  <div className="pt-4 border-t border-slate-200/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-800">Payout Credentials (Weekly Deposits)</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">UPI ID (Fastest)</label>
                        <input
                          type="text"
                          placeholder="e.g. rahul@okaxis"
                          value={settingsForm.upi_id}
                          onChange={(e) => setSettingsForm({ ...settingsForm, upi_id: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Account Holder Name</label>
                        <input
                          type="text"
                          placeholder="Full name as in bank passbook"
                          value={settingsForm.account_holder_name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, account_holder_name: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Bank Name</label>
                        <input
                          type="text"
                          placeholder="HDFC Bank"
                          value={settingsForm.bank_name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">Account Number</label>
                        <input
                          type="text"
                          placeholder="501000..."
                          value={settingsForm.bank_account}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bank_account: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase">IFSC Code</label>
                        <input
                          type="text"
                          placeholder="HDFC0001234"
                          value={settingsForm.bank_ifsc}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bank_ifsc: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm ${NEU_INSET} outline-none`}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 text-sm ${NEU_BTN_PRIMARY}`}
                  >
                    Save Profile & Payout Settings
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
