import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GoogleDocsEditor } from "@/components/GoogleDocsEditor";
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
  CheckCheck,
  Inbox,
  UploadCloud,
  FileArchive,
  Trash2,
  ImagePlus,
  Loader2,
  Camera
} from "lucide-react";

export const Route = createFileRoute("/contributor")({
  head: () => ({
    meta: [
      { title: "Contributor Hub — projectbyAI" },
      {
        name: "description",
        content:
          "Upload your projects, share step-by-step tutorial videos, help fellow students, and earn royalties on every sale.",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Auth form state (for landing login/signup view)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authCollege, setAuthCollege] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Contributor profile data (clean - no prefilled demo data)
  const [contributorProfile, setContributorProfile] = useState<any>({
    full_name: "",
    college: "",
    email: "",
    avatar_url: "",
    bio: "",
    upi_id: "",
    bank_name: "",
    bank_account: "",
    bank_ifsc: "",
    account_holder_name: "",
    commission_tier: "standard_70", // standard_70 or video_90
    total_earnings: 0,
    sales_count: 0,
    rating: 0,
    review_count: 0,
  });

  // Projects state (clean - no demo projects)
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");

  // Community Discussions (clean - no prefilled threads)
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionProject, setNewQuestionProject] = useState("");
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // 90% Video Tutorial Tier Requests (clean - no prefilled requests)
  const [tutorialRequests, setTutorialRequests] = useState<any[]>([]);
  const [reqProject, setReqProject] = useState("");
  const [reqVideoUrl, setReqVideoUrl] = useState("");
  const [reqDuration, setReqDuration] = useState("");
  const [reqNotes, setReqNotes] = useState("");
  const [submittingTierReq, setSubmittingTierReq] = useState(false);

  // Reviews (clean - no prefilled reviews)
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewProject, setNewReviewProject] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewCollege, setNewReviewCollege] = useState("");

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadSlug, setUploadSlug] = useState("");
  const [uploadCategory, setUploadCategory] = useState("AI & Machine Learning");
  const [uploadPrice, setUploadPrice] = useState<number>(1499);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadDemoUrl, setUploadDemoUrl] = useState("");
  const [uploadZipUrl, setUploadZipUrl] = useState("");
  const [uploadThumbnailUrl, setUploadThumbnailUrl] = useState("");
  const [uploadTutorialVideoUrl, setUploadTutorialVideoUrl] = useState("");
  const [uploadTechStack, setUploadTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");

  // Media upload state (drag-and-drop & files)
  const [uploadScreenshots, setUploadScreenshots] = useState<string[]>([]);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);
  const [zipFileName, setZipFileName] = useState("");
  const [zipFileSize, setZipFileSize] = useState("");

  // Categories list & create category state
  const [categoryList, setCategoryList] = useState<string[]>([
    "AI & Machine Learning",
    "Web & Full Stack",
    "Mobile App (Flutter/React Native)",
    "Blockchain & Web3",
    "Cybersecurity & Cloud",
    "IoT & Embedded Systems",
    "Data Science & Analytics",
    "DevOps & Automation",
  ]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const README_SAMPLE_GUIDE = `## Project Overview
Briefly explain the real-world problem statement, core purpose, and key deliverables.

### Key Features
- Clean modular structure with clear separation of concerns.
- Comprehensive database schema with automated migration scripts.
- Secure token-based authentication and role permissions.
- Step-by-step setup guide with viva defense FAQs.

### Installation & Run Instructions
1. Clone or extract the project ZIP archive.
2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt # or npm install
\`\`\`
3. Run migrations and seed sample data:
\`\`\`bash
python manage.py migrate # or npx prisma db push
\`\`\`
4. Start the development server:
\`\`\`bash
python app.py # or npm run dev
\`\`\`

### System Architecture
- Frontend: Responsive UI with clean reusable components
- Backend: RESTful API server with endpoint controllers
- Database: Structured relational database entities

### Viva Defense FAQs
- Common examiner questions & how to answer during college viva`;

  const [uploadReadme, setUploadReadme] = useState("");
  const [uploadDetailedDescription, setUploadDetailedDescription] = useState("");
  const [uploadingProject, setUploadingProject] = useState(false);

  // Settings & Payout State
  const [settingName, setSettingName] = useState("");
  const [settingCollege, setSettingCollege] = useState("");
  const [settingBio, setSettingBio] = useState("");
  const [settingAvatar, setSettingAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  const [settingUpi, setSettingUpi] = useState("");
  const [settingBankName, setSettingBankName] = useState("");
  const [settingAccount, setSettingAccount] = useState("");
  const [settingIfsc, setSettingIfsc] = useState("");
  const [settingHolder, setSettingHolder] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch real data for logged-in user
  const loadContributorData = async (userId: string, userEmail: string, userMeta: any) => {
    setLoadingProjects(true);
    try {
      // 1. Load contributor profile
      const { data: profile } = await supabase
        .from("contributor_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        setContributorProfile({
          full_name: profile.full_name || userMeta?.full_name || "",
          college: profile.college || userMeta?.college || "",
          email: userEmail || profile.email || "",
          avatar_url: profile.avatar_url || "",
          bio: profile.bio || "",
          upi_id: profile.upi_id || "",
          bank_name: profile.bank_name || "",
          bank_account: profile.bank_account || "",
          bank_ifsc: profile.bank_ifsc || "",
          account_holder_name: profile.account_holder_name || profile.full_name || "",
          commission_tier: profile.commission_tier || "standard_70",
          total_earnings: profile.total_earnings || 0,
          sales_count: profile.sales_count || 0,
          rating: profile.rating || 0,
          review_count: profile.review_count || 0,
        });
      } else {
        setContributorProfile({
          full_name: userMeta?.full_name || "",
          college: userMeta?.college || "",
          email: userEmail || "",
          avatar_url: "",
          bio: "",
          upi_id: "",
          bank_name: "",
          bank_account: "",
          bank_ifsc: "",
          account_holder_name: userMeta?.full_name || "",
          commission_tier: "standard_70",
          total_earnings: 0,
          sales_count: 0,
          rating: 0,
          review_count: 0,
        });
      }

      // 2. Load ONLY this contributor's uploaded projects (no demo projects)
      const { data: projs } = await supabase
        .from("library_projects")
        .select("*")
        .eq("contributor_id", userId)
        .order("created_at", { ascending: false });

      setMyProjects(projs || []);
      if (projs && projs.length > 0 && !newQuestionProject) {
        setNewQuestionProject(projs[0].title);
      }

      // 3. Load community messages for this contributor
      const { data: msgs } = await supabase
        .from("project_community_messages")
        .select("*")
        .order("created_at", { ascending: false });

      setCommunityMessages(msgs || []);

      // 4. Load tutorial tier requests
      const { data: treqs } = await supabase
        .from("tutorial_tier_requests")
        .select("*")
        .eq("contributor_id", userId)
        .order("created_at", { ascending: false });

      setTutorialRequests(treqs || []);

      // 5. Load reviews
      const { data: revs } = await supabase
        .from("project_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      setReviewsList(revs || []);
    } catch (err) {
      console.warn("Contributor data load note:", err);
      setMyProjects([]);
      setCommunityMessages([]);
      setTutorialRequests([]);
      setReviewsList([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Initial Auth Check
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted && data?.session?.user) {
          setUser(data.session.user);
          loadContributorData(
            data.session.user.id,
            data.session.user.email || "",
            data.session.user.user_metadata || {}
          );
        }
      } catch (err) {
        // stay on login view
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          loadContributorData(
            session.user.id,
            session.user.email || "",
            session.user.user_metadata || {}
          );
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync settings inputs when contributorProfile changes
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
            full_name: authFullName || "",
            college: authCollege || "",
            email: authEmail,
          }));
          loadContributorData(data.user.id, authEmail, {
            full_name: authFullName,
            college: authCollege,
          });
          toast.success("Account created successfully! Welcome to the Contributor Hub.");
        } else {
          toast.info("Verification email sent! Please check your inbox to confirm your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          loadContributorData(
            data.user.id,
            data.user.email || authEmail,
            data.user.user_metadata || {}
          );
          toast.success("Welcome back to your Contributor Dashboard!");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Please check your credentials.");
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
    setActiveTab("overview");
    setMyProjects([]);
    setCommunityMessages([]);
    setTutorialRequests([]);
    setReviewsList([]);
    setContributorProfile({
      full_name: "",
      college: "",
      email: "",
      avatar_url: "",
      bio: "",
      upi_id: "",
      bank_name: "",
      bank_account: "",
      bank_ifsc: "",
      account_holder_name: "",
      commission_tier: "standard_70",
      total_earnings: 0,
      sales_count: 0,
      rating: 0,
      review_count: 0,
    });
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

  // Helper for uploading image and zip files to Supabase storage with FileReader fallback
  const uploadFileToStorage = async (file: File, folder: string): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${folder}/${Date.now()}_${cleanName}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) {
        console.warn("Supabase storage upload note:", error.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      console.warn("Storage upload exception, fallback to Data URL:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  };

  // Upload Thumbnail Handler (Drag & Drop or Click)
  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    setUploadingThumbnail(true);
    try {
      const url = await uploadFileToStorage(file, "project-thumbnails");
      setUploadThumbnailUrl(url);
      toast.success("Thumbnail cover image uploaded!");
    } catch (err: any) {
      toast.error("Failed to upload thumbnail.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Upload Multiple Screenshots Handler
  const handleScreenshotsUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }
    setUploadingScreenshots(true);
    try {
      const newUrls: string[] = [];
      for (const file of fileArray) {
        const url = await uploadFileToStorage(file, "project-screenshots");
        newUrls.push(url);
      }
      setUploadScreenshots((prev) => [...prev, ...newUrls]);
      toast.success(`${fileArray.length} screenshot${fileArray.length > 1 ? "s" : ""} added!`);
    } catch (err: any) {
      toast.error("Failed to upload screenshots.");
    } finally {
      setUploadingScreenshots(false);
    }
  };

  // Upload ZIP File Handler
  const handleZipUpload = async (file: File) => {
    const validExts = [".zip", ".rar", ".7z", ".tar", ".gz"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext) && !file.type.includes("zip") && !file.type.includes("compressed")) {
      toast.error("Please upload a ZIP archive (.zip, .rar, .7z, .tar.gz).");
      return;
    }

    setUploadingZip(true);
    setZipFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setZipFileSize(`${sizeInMB} MB`);

    try {
      const url = await uploadFileToStorage(file, "project-zips");
      setUploadZipUrl(url);
      toast.success("Project ZIP file uploaded successfully!");
    } catch (err: any) {
      toast.error("Failed to upload ZIP file.");
    } finally {
      setUploadingZip(false);
    }
  };

  // Profile Photo Upload Handler (Drag & Drop or Browse)
  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }
    setUploadingAvatar(true);
    try {
      const url = await uploadFileToStorage(file, "contributor-avatars");
      setSettingAvatar(url);
      toast.success("Profile photo uploaded!");
    } catch (err: any) {
      toast.error("Failed to upload profile photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Add Custom Category Handler
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Please enter a category name.");
      return;
    }
    if (!categoryList.includes(trimmed)) {
      setCategoryList([...categoryList, trimmed]);
    }
    setUploadCategory(trimmed);
    setNewCategoryName("");
    setShowNewCategoryInput(false);
    toast.success(`Category "${trimmed}" created and selected!`);
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
        detailed_description: uploadDetailedDescription,
        long_description: uploadDetailedDescription,
        demo_url: uploadDemoUrl,
        download_url: uploadZipUrl,
        thumbnail_url:
          uploadThumbnailUrl ||
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        screenshots: uploadScreenshots,
        tech_stack: uploadTechStack,
        contributor_id: user?.id,
        contributor_name: contributorProfile.full_name || user?.user_metadata?.full_name || "Contributor",
        commission_rate: uploadTutorialVideoUrl ? 90 : 70,
        tutorial_video_url: uploadTutorialVideoUrl,
        views_count: 0,
        sales_count: 0,
        created_at: new Date().toISOString(),
      };

      // Insert into Supabase
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
      setUploadDetailedDescription("");
      setUploadDemoUrl("");
      setUploadZipUrl("");
      setUploadThumbnailUrl("");
      setUploadScreenshots([]);
      setZipFileName("");
      setZipFileSize("");
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
        contributor_id: user?.id,
        project_title: reqProject,
        video_url: reqVideoUrl,
        duration: reqDuration || "30 mins",
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
    }, 600);
  };

  // Community Question Submit
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newMsg = {
      id: `cm-${Date.now()}`,
      user_name: contributorProfile.full_name || user?.user_metadata?.full_name || "Community Member",
      user_college: contributorProfile.college || "College",
      user_role: "Contributor",
      project_title: newQuestionProject || "General Discussion",
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
              ...(thread.replies || []),
              {
                id: `cr-${Date.now()}`,
                user_name: contributorProfile.full_name || "Contributor",
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
      reviewer_name: newReviewName.trim() || "Student",
      college: newReviewCollege.trim() || "Engineering Institute",
      rating: newReviewRating,
      project_title: newReviewProject || myProjects[0]?.title || "Project Review",
      comment: newReviewComment.trim(),
      created_at: "Just now",
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewComment("");
    setNewReviewName("");
    setNewReviewCollege("");
    toast.success("Review submitted! Thank you for the feedback.");
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
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

    if (user?.id) {
      try {
        await supabase.from("contributor_profiles").upsert([
          {
            id: user.id,
            full_name: settingName,
            college: settingCollege,
            bio: settingBio,
            avatar_url: settingAvatar,
            upi_id: settingUpi,
            bank_name: settingBankName,
            bank_account: settingAccount,
            bank_ifsc: settingIfsc,
            account_holder_name: settingHolder,
            email: user.email,
          },
        ]);
      } catch (err) {
        console.warn("Profile save note:", err);
      }
    }

    toast.success("Profile and payout details updated successfully!");
  };

  // -------------------------------------------------------------------------------------------------
  // SCREEN 1: Dedicated Sign In / Sign Up Gate (When User is NOT Authenticated)
  // -------------------------------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        {/* Simple Top Navigation Header */}
        <header className="border-b border-border/80 bg-card/60 backdrop-blur sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo />
              <Badge variant="secondary" className="ml-2 font-medium text-xs bg-primary/10 text-primary border border-primary/20">
                Contributor Hub
              </Badge>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Split Authentication & Value Landing */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-16 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Program Overview */}
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

            {/* Transparency Ribbon */}
            <div className="pt-4 flex flex-wrap items-center gap-8 border-t border-border/60 text-sm">
              <div>
                <p className="text-2xl font-bold text-foreground">70% – 90%</p>
                <p className="text-xs text-muted-foreground">Royalty Rate</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">Instant</p>
                <p className="text-xs text-muted-foreground">UPI & Bank Settlements</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Project Code Ownership</p>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Auth Card */}
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
                  Sign In
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
                  Create Contributor Account
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  {authMode === "signin" ? "Welcome back" : "Create Contributor Account"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {authMode === "signin"
                    ? "Sign in to access your projects, sales, and payouts."
                    : "Join as a project contributor and start sharing your knowledge."}
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
                        placeholder="Your full name"
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">College / University</label>
                      <Input
                        placeholder="Your college name"
                        value={authCollege}
                        onChange={(e) => setAuthCollege(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email</label>
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
                    "Create Contributor Account"
                  )}
                </Button>
              </form>

              <p className="text-[11px] text-muted-foreground text-center mt-4 leading-tight">
                By joining, you agree to projectbyAI's Contributor Royalty Agreement and Marketplace Terms of Service.
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
      p.title?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesCategory =
      projectCategoryFilter === "all" || p.category === projectCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(
    new Set(myProjects.map((p) => p.category).filter(Boolean))
  );

  const totalViewsCount = myProjects.reduce((acc, p) => acc + (p.views_count || 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* --------------------------------------------------------------------------------- */}
      {/* SHOPIFY POLARIS STYLE SIDEBAR (Left Navigation) */}
      {/* --------------------------------------------------------------------------------- */}
      <aside className="w-full md:w-64 border-r border-border bg-card/80 backdrop-blur shrink-0 md:h-screen md:sticky md:top-0 flex flex-col justify-between z-40">
        <div>
          {/* Contributor Brand Header */}
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
                  Partner Dashboard
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
              {communityMessages.length > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              )}
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
              {contributorProfile.rating > 0 && (
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-0.5">
                  ★ {contributorProfile.rating}
                </span>
              )}
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
              {contributorProfile.avatar_url ? (
                <img
                  src={contributorProfile.avatar_url}
                  alt={contributorProfile.full_name || "Contributor"}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase border border-border">
                  {contributorProfile.full_name
                    ? contributorProfile.full_name.charAt(0)
                    : user?.email?.charAt(0) || "C"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">
                  {contributorProfile.full_name || "Contributor"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {contributorProfile.email || user?.email || ""}
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
        {/* Top Header Bar */}
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
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
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
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 font-medium">
                    <span>
                      {contributorProfile.total_earnings > 0
                        ? "Active Royalty Balance"
                        : "Upload projects to start earning"}
                    </span>
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
                    <span className="text-muted-foreground">
                      {myProjects.length > 0 ? "Published on Marketplace" : "0 active listings"}
                    </span>
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
                    {totalViewsCount} views
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>
                      {contributorProfile.review_count > 0
                        ? `★ ${contributorProfile.rating} (${contributorProfile.review_count} reviews)`
                        : "No ratings yet"}
                    </span>
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
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                            <p className="font-medium text-foreground text-sm">No sales yet</p>
                            <p className="text-xs text-muted-foreground max-w-sm">
                              Once students purchase your uploaded projects, their orders, royalty payouts, and completion status will appear here in real time.
                            </p>
                          </div>
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
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Package className="w-8 h-8 text-muted-foreground/40" />
                              <p className="font-medium text-foreground text-sm">No projects uploaded yet</p>
                              <p className="text-xs text-muted-foreground max-w-sm">
                                You haven't listed any student projects yet. Click "Add Project" to publish your code and documentation.
                              </p>
                              <Button
                                size="sm"
                                onClick={() => setActiveTab("upload")}
                                className="text-xs mt-2"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Your First Project
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((p, idx) => {
                          const hasVideo = !!p.tutorial_video_url;
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
                                {p.sales_count || 0}
                              </td>

                              <td className="py-3.5 px-4 text-muted-foreground">
                                {p.views_count || 0}
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
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Project Title *
                        </label>
                        <span className="text-[10px] text-muted-foreground/40 font-normal">Academic standard title</span>
                      </div>
                      <Input
                        placeholder="e.g. AI-Powered Hospital Bed & Oxygen Allocation System"
                        value={uploadTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                        className="text-sm font-medium placeholder:text-xs placeholder:text-muted-foreground/35 placeholder:font-normal"
                      />
                      <p className="text-[10px] text-muted-foreground/50">
                        Guide: Clearly mention the application purpose and primary framework or core algorithm.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        URL Slug *
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/50">projectbyai.com/projects/</span>
                        <Input
                          placeholder="e.g. hospital-bed-allocation"
                          value={uploadSlug}
                          onChange={(e) => setUploadSlug(e.target.value)}
                          required
                          className="text-xs placeholder:text-[11px] placeholder:text-muted-foreground/35"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Short Summary Description *
                        </label>
                        <span className="text-[10px] text-muted-foreground/40 font-normal">2–3 sentences</span>
                      </div>
                      <Textarea
                        placeholder="Explain what problem this project solves, main algorithms used, and how students can present it in their college viva..."
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        rows={3}
                        required
                        className="text-xs placeholder:text-[11px] placeholder:text-muted-foreground/35 placeholder:font-normal leading-relaxed"
                      />
                      <p className="text-[10px] text-muted-foreground/50">
                        Guide: Keep it concise (2–3 sentences) summarizing project purpose, algorithms, and viva talking points.
                      </p>
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
                      <div className="flex items-center gap-2">
                        {!uploadReadme && (
                          <button
                            type="button"
                            onClick={() => setUploadReadme(README_SAMPLE_GUIDE)}
                            className="text-[11px] text-primary/70 hover:text-primary transition-colors hover:underline"
                          >
                            + Use Sample Template
                          </button>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          Markdown Supported
                        </Badge>
                      </div>
                    </div>

                    <Textarea
                      placeholder={README_SAMPLE_GUIDE}
                      value={uploadReadme}
                      onChange={(e) => setUploadReadme(e.target.value)}
                      rows={12}
                      className="font-mono text-xs leading-relaxed placeholder:text-[11px] placeholder:text-muted-foreground/35 placeholder:font-mono placeholder:leading-relaxed"
                    />
                    <p className="text-[10px] text-muted-foreground/50">
                      Guide: Markdown structure for project overview, key features, step-by-step run commands, and examiner viva FAQs.
                    </p>
                  </Card>

                  {/* Card: Detailed Description (Google Docs Interface) */}
                  <div className="space-y-2">
                    <div className="px-1">
                      <h3 className="font-semibold text-sm text-foreground">
                        Detailed Description & Full Project Documentation
                      </h3>
                    </div>

                    <GoogleDocsEditor
                      value={uploadDetailedDescription}
                      onChange={setUploadDetailedDescription}
                      placeholder="Write your detailed project overview, architecture diagram explanation, database schema, API documentation, step-by-step workflow, and college viva questions..."
                    />
                  </div>

                  {/* Card: Media & Assets */}
                  <Card className="p-5 border-border shadow-xs space-y-5">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">
                        Media, Code ZIP & Live Demo Links
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Upload your project cover image, multiple screenshots, and project source code ZIP file.
                      </p>
                    </div>

                    {/* Section 1: Thumbnail Cover Image (Drag & Drop + Upload) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-primary" />
                          Thumbnail Cover Image *
                        </label>
                        <span className="text-[11px] text-muted-foreground">
                          Recommended: 1200x675 (16:9)
                        </span>
                      </div>

                      {uploadThumbnailUrl ? (
                        <div className="relative rounded-lg border border-border p-2 bg-muted/30 flex items-center gap-4">
                          <img
                            src={uploadThumbnailUrl}
                            alt="Cover thumbnail"
                            className="w-28 h-18 object-cover rounded-md border border-border bg-background"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-xs font-medium text-foreground truncate">
                              Cover image selected
                            </p>
                            <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready for display
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pr-2">
                            <label className="cursor-pointer inline-flex items-center gap-1 text-xs border border-border hover:bg-muted px-2.5 py-1.5 rounded-md font-medium text-foreground transition-colors">
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Replace</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleThumbnailUpload(e.target.files[0]);
                                }}
                              />
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadThumbnailUrl("")}
                              className="text-muted-foreground hover:text-destructive h-8 px-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files?.[0]) {
                              handleThumbnailUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 cursor-pointer"
                          onClick={() => document.getElementById("thumbnail-file-input")?.click()}
                        >
                          <input
                            id="thumbnail-file-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleThumbnailUpload(e.target.files[0]);
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-foreground">
                              {uploadingThumbnail ? "Uploading cover image..." : "Upload thumbnail cover image"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/50">
                              Guide: Drag & drop 16:9 image (PNG, JPG, WEBP up to 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-border my-2" />

                    {/* Section 2: Project Screenshots (Multiple) */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <ImagePlus className="w-3.5 h-3.5 text-primary" />
                            Project Screenshots (Multiple)
                          </label>
                          <p className="text-[10px] text-muted-foreground/50">
                            Upload screenshots of UI pages, architecture diagrams, database schema, or terminal outputs.
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {uploadScreenshots.length} {uploadScreenshots.length === 1 ? "Screenshot" : "Screenshots"}
                        </Badge>
                      </div>

                      {/* Dropzone for multiple screenshots */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleScreenshotsUpload(e.dataTransfer.files);
                          }
                        }}
                        className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 bg-muted/15 hover:bg-muted/30 cursor-pointer"
                        onClick={() => document.getElementById("screenshots-file-input")?.click()}
                      >
                        <input
                          id="screenshots-file-input"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleScreenshotsUpload(e.target.files);
                            }
                          }}
                        />
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <ImagePlus className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {uploadingScreenshots ? "Uploading screenshots..." : "Drag and drop multiple screenshots here, or click to browse"}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50">
                          Guide: Select multiple image files at once (PNG, JPG, WEBP)
                        </p>
                      </div>

                      {/* Screenshots Gallery / Grid */}
                      {uploadScreenshots.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                          {uploadScreenshots.map((url, idx) => (
                            <div
                              key={idx}
                              className="group relative rounded-lg border border-border overflow-hidden bg-card aspect-video flex items-center justify-center shadow-xs"
                            >
                              <img
                                src={url}
                                alt={`Screenshot ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                                #{idx + 1}
                              </div>
                              <button
                                type="button"
                                title="Remove screenshot"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUploadScreenshots(uploadScreenshots.filter((_, i) => i !== idx));
                                }}
                                className="absolute top-1 right-1 w-6 h-6 rounded bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-border my-2" />

                    {/* Section 3: Upload project zip file */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <FileArchive className="w-3.5 h-3.5 text-primary" />
                          Upload project zip file *
                        </label>
                        <span className="text-[10px] text-muted-foreground/50">
                          Accepts .zip, .rar, .tar.gz (Max 100MB)
                        </span>
                      </div>

                      {uploadZipUrl ? (
                        <div className="rounded-lg border border-border p-3.5 bg-muted/30 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <FileArchive className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <p className="text-xs font-semibold text-foreground truncate">
                                {zipFileName || "Project Source Code Archive.zip"}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                {zipFileSize && <span>{zipFileSize} •</span>}
                                <span className="text-emerald-500 flex items-center gap-1 font-medium">
                                  <Check className="w-3 h-3" /> Ready for student download
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label className="cursor-pointer inline-flex items-center gap-1 text-xs border border-border hover:bg-muted px-2.5 py-1.5 rounded-md font-medium text-foreground transition-colors">
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Replace ZIP</span>
                              <input
                                type="file"
                                accept=".zip,.rar,.tar,.gz,.7z"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) handleZipUpload(e.target.files[0]);
                                }}
                              />
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setUploadZipUrl("");
                                setZipFileName("");
                                setZipFileSize("");
                              }}
                              className="text-muted-foreground hover:text-destructive h-8 px-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files?.[0]) {
                              handleZipUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 cursor-pointer"
                          onClick={() => document.getElementById("zip-file-input")?.click()}
                        >
                          <input
                            id="zip-file-input"
                            type="file"
                            accept=".zip,.rar,.tar,.gz,.7z"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleZipUpload(e.target.files[0]);
                            }}
                          />
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <FileArchive className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-foreground">
                              {uploadingZip ? "Uploading ZIP archive..." : "Drag and drop your project ZIP file here, or browse"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/50">
                              Guide: Contains full source code, database script, setup instructions, and viva documentation
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-border my-2" />

                    {/* Section 4: Live Interactive Demo Link (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                        Live Interactive Demo URL (Optional)
                      </label>
                      <Input
                        placeholder="https://my-project-demo.vercel.app"
                        value={uploadDemoUrl}
                        onChange={(e) => setUploadDemoUrl(e.target.value)}
                        className="text-xs placeholder:text-[11px] placeholder:text-muted-foreground/35"
                      />
                      <p className="text-[10px] text-muted-foreground/50">
                        Guide: Allow students to test drive the live deployment before purchasing.
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
                  </Card>

                  {/* Card: Organization & Taxonomy */}
                  <Card className="p-5 border-border shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-foreground">Project Category</h3>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                        className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Create New Category</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Category Domain</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => {
                          if (e.target.value === "__create_new__") {
                            setShowNewCategoryInput(true);
                          } else {
                            setUploadCategory(e.target.value);
                          }
                        }}
                        className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none"
                      >
                        {categoryList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__create_new__">+ Create New Category...</option>
                      </select>

                      {/* Inline Create New Category Input */}
                      {showNewCategoryInput && (
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2 mt-2">
                          <label className="text-xs font-semibold text-foreground">
                            Create New Category Name
                          </label>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="e.g. AR/VR & Gaming, Robotics..."
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCategory();
                                }
                              }}
                              className="h-8 text-xs bg-background placeholder:text-[11px] placeholder:text-muted-foreground/35"
                              autoFocus
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleAddCategory}
                              className="h-8 text-xs font-medium shrink-0"
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowNewCategoryInput(false);
                                setNewCategoryName("");
                              }}
                              className="h-8 text-xs shrink-0"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack Tags */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Tech Stack Tags</label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="e.g. Next.js, PyTorch, MongoDB..."
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTech();
                            }
                          }}
                          className="h-8 text-xs placeholder:text-[11px] placeholder:text-muted-foreground/35"
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
                      <p className="text-[10px] text-muted-foreground/50">
                        Guide: Type framework or language name and click Add or press Enter.
                      </p>

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

              {/* Ask / Post a Question Box */}
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
                {communityMessages.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                      <p className="font-medium text-foreground text-sm">No community questions yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        When students or buyers ask questions about your project architecture and setup, the threads will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  communityMessages.map((thread) => (
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
                              {thread.user_role || "Student"}
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
                  ))
                )}
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
                  {tutorialRequests.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      <p className="text-sm">No tutorial video requests submitted yet.</p>
                      <p className="text-xs text-muted-foreground mt-1">Submit your project walkthrough video above to unlock the 90% commission tier.</p>
                    </div>
                  ) : (
                    tutorialRequests.map((tr) => (
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
                    ))
                  )}
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
                    {contributorProfile.rating > 0 ? contributorProfile.rating : "—"}
                  </span>
                  <div className="leading-tight">
                    <div className="flex text-amber-500 text-xs">
                      {contributorProfile.rating > 0 ? "★".repeat(Math.round(contributorProfile.rating)) : "☆☆☆☆☆"}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {contributorProfile.review_count > 0
                        ? `Based on ${contributorProfile.review_count} ratings`
                        : "No reviews yet"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit a Review Form */}
              <Card className="p-5 border-border shadow-xs space-y-3">
                <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  Leave a Review for a Project or Contributor
                </h3>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Input
                      placeholder="Your Name"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                    <Input
                      placeholder="Your College"
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
                {reviewsList.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Star className="w-8 h-8 text-muted-foreground/40" />
                      <p className="font-medium text-foreground text-sm">No reviews yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Reviews from students who download your project will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  reviewsList.map((rev) => (
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
                  ))
                )}
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
                  <p className="text-xs text-muted-foreground mt-1 font-medium">100% Transparent Tracking</p>
                </Card>

                <Card className="p-5 border-border shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Available for Withdrawal</span>
                  <p className="text-2xl font-bold text-emerald-500 mt-2">
                    ₹{Math.round(contributorProfile.total_earnings * 0.7).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Processed weekly</p>
                </Card>

                <Card className="p-5 border-border shadow-xs">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Active Payout Method</span>
                  <p className="text-base font-bold text-foreground mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {contributorProfile.upi_id ? `UPI (${contributorProfile.upi_id})` : "Not configured yet"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Direct Transfer to UPI or Bank</p>
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
                          placeholder="Bank Account Number"
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

                  {/* Profile Photo (Drag & Drop + Upload) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-primary" />
                        Profile Photo
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        Recommended: Square 1:1 (Max 5MB)
                      </span>
                    </div>

                    {settingAvatar ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleAvatarUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`relative rounded-xl border p-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                          isAvatarDragging
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={settingAvatar}
                              alt="Profile Preview"
                              className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-xs ring-1 ring-border"
                            />
                            {uploadingAvatar && (
                              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-white">
                                <Loader2 className="w-5 h-5 animate-spin" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Profile photo selected
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Drag and drop a new photo here to replace, or click Replace
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs border border-border bg-background hover:bg-muted px-3 py-1.5 rounded-md font-medium text-foreground transition-colors shadow-2xs">
                            <UploadCloud className="w-3.5 h-3.5 text-primary" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]);
                              }}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSettingAvatar("")}
                            className="text-muted-foreground hover:text-destructive h-8 px-2.5"
                            title="Remove profile photo"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAvatarDragging(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleAvatarUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => document.getElementById("avatar-file-input")?.click()}
                        className={`border-2 border-dashed transition-all rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          isAvatarDragging
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[0.99]"
                            : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <input
                          id="avatar-file-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]);
                          }}
                        />
                        {uploadingAvatar ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <p className="text-xs font-medium text-foreground">Uploading profile photo...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium text-foreground">
                                Drag and drop your photo here, or{" "}
                                <span className="text-primary font-semibold underline underline-offset-2">browse</span>
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Supports PNG, JPG, WEBP (Square recommended, max 5MB)
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Public Bio</label>
                    <Textarea
                      value={settingBio}
                      onChange={(e) => setSettingBio(e.target.value)}
                      rows={3}
                      placeholder="Tell students about your technical background and projects..."
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
