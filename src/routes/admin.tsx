import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { listRegisteredUsers, getSalesStatistics, listContactQueries, deleteContactQuery, listContributorsWithStats, recordContributorPayout } from "@/lib/projects.functions";
import { MOCK_BLOG_POSTS } from "@/lib/blog-data";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  FolderLock,
  ArrowLeft,
  Loader2,
  X,
  PlusCircle,
  HelpCircle,
  Upload,
  Link2,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Users,
  Tag,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Download,
  ExternalLink,
  Video,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Wallet,
  CreditCard,
  Building,
  Copy,
  ArrowUpRight,
  CheckCheck
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Portal — ScholarBuild" }] }),
  component: AdminPortal,
});

type RichTextEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
};

function RichTextEditor({ value, onChange, placeholder, minHeight = "150px" }: RichTextEditorProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    if (localRef.current && localRef.current.innerHTML !== value) {
      localRef.current.innerHTML = value || "";
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (!selectionRef.current) return;
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
  };

  const execCommand = (command: string, arg: string = "") => {
    restoreSelection();
    if (localRef.current && document.activeElement !== localRef.current) {
      localRef.current.focus();
    }
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch (e) {}

    if (command === "formatBlock") {
      const tag = arg.replace(/[<>]/g, "").toUpperCase();
      let success = false;
      try {
        success = document.execCommand("formatBlock", false, `<${tag}>`);
      } catch (e) {}
      if (!success) {
        try {
          success = document.execCommand("formatBlock", false, tag);
        } catch (e) {}
      }
    } else {
      document.execCommand(command, false, arg);
    }

    if (localRef.current) {
      onChange(localRef.current.innerHTML);
    }
    saveSelection();
  };

  return (
    <div className="border rounded-md shadow-sm overflow-hidden flex flex-col bg-white border-slate-200">
      {/* Light Black toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-800 border-b border-slate-700 text-slate-100 select-none">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("bold")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5 font-bold" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("italic")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("underline")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <div className="h-3.5 w-[1px] bg-slate-700 mx-1" />
        {["H1", "H2", "H3", "H4"].map((h) => (
          <button
            key={h}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => execCommand("formatBlock", h)}
            className="px-1.5 py-0.5 text-[10px] font-extrabold hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
            title={`Heading ${h.slice(1)}`}
          >
            {h}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("formatBlock", "P")}
          className="px-1.5 py-0.5 text-[10px] font-medium hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Normal"
        >
          P
        </button>
        <div className="h-3.5 w-[1px] bg-slate-700 mx-1" />
        <div className="flex items-center gap-1" title="Text Color">
          <span className="text-[9px] uppercase font-bold text-slate-400">Color</span>
          <input
            type="color"
            onMouseDown={() => saveSelection()}
            onChange={(e) => execCommand("foreColor", e.target.value)}
            className="w-4 h-4 border border-slate-600 rounded cursor-pointer p-0 bg-transparent"
          />
        </div>
        <div className="h-3.5 w-[1px] bg-slate-700 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => {
            saveSelection();
            e.preventDefault();
          }}
          onClick={() => {
            const url = prompt("Enter hyperlink URL (e.g. https://google.com):");
            if (url) execCommand("createLink", url);
          }}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Insert Link"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
        <div className="h-3.5 w-[1px] bg-slate-700 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyLeft")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyCenter")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("justifyRight")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </button>
        <div className="h-3.5 w-[1px] bg-slate-700 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand("insertOrderedList")}
          className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-200 hover:text-white"
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
      </div>
      {/* Content editable area - forced text color for visibility */}
      <div
        ref={localRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onFocus={() => {
          try {
            document.execCommand("defaultParagraphSeparator", false, "p");
          } catch (e) {}
        }}
        placeholder={placeholder}
        className="block w-full bg-white px-3 py-2.5 text-sm focus:outline-none overflow-y-auto prose max-w-none text-slate-900"
        style={{ minHeight, fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}
      />
    </div>
  );
}

const DEFAULT_ADMIN_USER = "admin@eduprojects.com";
const DEFAULT_ADMIN_PASS = "adminpassword123";

function AdminPortal() {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [activeTab, setActiveTab] = useState<"library" | "approvals" | "contributors" | "blogs" | "users" | "coupons" | "queries">("library");

  // Project Approvals state
  const [approvalsFilter, setApprovalsFilter] = useState<"all" | "pending" | "published" | "rejected">("pending");
  const [approvalsSearch, setApprovalsSearch] = useState("");
  const [reviewingProject, setReviewingProject] = useState<any | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionTargetProject, setRejectionTargetProject] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [processingApprovalId, setProcessingApprovalId] = useState<string | null>(null);

  // Contributors & Payouts state
  const [contributorsData, setContributorsData] = useState<{
    contributors: any[];
    summary: {
      totalContributors: number;
      totalEarnings: number;
      totalDisbursed: number;
      pendingWeeklySettlement: number;
    };
  }>({
    contributors: [],
    summary: { totalContributors: 0, totalEarnings: 0, totalDisbursed: 0, pendingWeeklySettlement: 0 },
  });
  const [loadingContributors, setLoadingContributors] = useState(false);
  const [contributorsTab, setContributorsTab] = useState<"queue" | "directory">("queue");
  const [contributorsSearch, setContributorsSearch] = useState("");
  const [viewingLedgerContributor, setViewingLedgerContributor] = useState<any | null>(null);

  // Payout action modal state
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutTargetContributor, setPayoutTargetContributor] = useState<any | null>(null);
  const [payoutAmountInput, setPayoutAmountInput] = useState<number>(0);
  const [payoutUtrInput, setPayoutUtrInput] = useState("");
  const [payoutNotesInput, setPayoutNotesInput] = useState("");
  const [processingPayout, setProcessingPayout] = useState(false);
  const fetchContributors = useServerFn(listContributorsWithStats);
  const submitPayout = useServerFn(recordContributorPayout);

  // Contact queries state
  const [queries, setQueries] = useState<any[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [queriesTableMissing, setQueriesTableMissing] = useState(false);
  const fetchQueries = useServerFn(listContactQueries);
  const deleteQueryFn = useServerFn(deleteContactQuery);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState("");
  const fetchUsers = useServerFn(listRegisteredUsers);

  // Sales state
  const [sales, setSales] = useState<any[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const fetchSales = useServerFn(getSalesStatistics);

  // Coupons state
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponsTableMissing, setCouponsTableMissing] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    active: true,
  });

  // Project categories & Blog categories
  const [projCategories, setProjCategories] = useState<string[]>([]);
  const [blogCategories, setBlogCategories] = useState<string[]>([]);

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Projects form state
  const [projectForm, setProjectForm] = useState({
    slug: "",
    title: "",
    description: "",
    long_description: "",
    price: "",
    category: "",
    thumbnail: "",
    thumbnail_alt: "",
    screenshots: "",
    youtube_id: "",
    tech: "",
    zip_url: "",
  });
  
  // Custom Category variables
  const [customProjCategory, setCustomProjCategory] = useState("");
  const [isCustomProjCategorySelected, setIsCustomProjCategorySelected] = useState(false);

  const [projectFaqs, setProjectFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Upload states (projects)
  const [uploadingProjThumb, setUploadingProjThumb] = useState(false);
  const [uploadingProjScreenshots, setUploadingProjScreenshots] = useState(false);
  const [uploadingProjZip, setUploadingProjZip] = useState(false);

  // Blogs state
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Blogs form state
  const [blogForm, setBlogForm] = useState({
    slug: "",
    title: "",
    content: "",
    thumbnail: "",
    category: "",
  });
  const [customBlogCategory, setCustomBlogCategory] = useState("");
  const [isCustomBlogCategorySelected, setIsCustomBlogCategorySelected] = useState(false);

  // Upload states (blogs)
  const [uploadingBlogThumb, setUploadingBlogThumb] = useState(false);

  // WYSIWYG editor ref
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRangeRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRangeRef.current = range;
      }
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRangeRef.current);
      }
    }
  };

  useEffect(() => {
    const authSession = sessionStorage.getItem("sb_admin_auth");
    if (authSession === "true") {
      setIsLogged(true);
    }
  }, []);

  useEffect(() => {
    if (isLogged) {
      loadLibraryProjects();
      loadBlogPosts();
      loadUsers();
      loadSales();
      loadCoupons();
      loadQueries();
      loadContributors();
    }
  }, [isLogged]);

  // Extract unique categories
  useEffect(() => {
    const pCats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    const bCats = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));
    setProjCategories(pCats.length > 0 ? pCats : ["Machine Learning", "Web Development", "AI / NLP", "IoT"]);
    setBlogCategories(bCats.length > 0 ? bCats : ["Academic Guidelines", "Viva Preparation", "Report Writing"]);
  }, [projects, blogs]);

  // Upload file helper
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // YouTube Link parser
  const extractYoutubeId = (input: string): string => {
    if (!input) return "";
    // Regex matches watch urls, embed urls, short urls
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
  };

  // Load from Supabase
  const loadLibraryProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from("library_projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      toast.error("Failed to load projects: " + err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadBlogPosts = async () => {
    setLoadingBlogs(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (err: any) {
      toast.error("Failed to load blogs: " + err.message);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const [usersError, setUsersError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.warn("Failed to load users: ", err);
      // Clean up the error message if it's the environment key warning
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        setUsersError("SUPABASE_SERVICE_ROLE_KEY is missing in your .env file. Please paste your service role key in your .env to see registered users.");
      } else {
        setUsersError(msg);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadSales = async () => {
    setLoadingSales(true);
    try {
      const data = await fetchSales();
      setSales(data || []);
    } catch (err: any) {
      console.warn("Failed to load sales statistics: ", err);
    } finally {
      setLoadingSales(false);
    }
  };

  const loadContributors = async () => {
    setLoadingContributors(true);
    try {
      const res = await fetchContributors();
      if (res && res.contributors) {
        setContributorsData(res);
      }
    } catch (err: any) {
      console.warn("Failed to load contributors:", err);
    } finally {
      setLoadingContributors(false);
    }
  };

  const handleOpenPayoutModal = (contributor: any) => {
    setPayoutTargetContributor(contributor);
    setPayoutAmountInput(contributor.unpaid_balance || 0);
    setPayoutUtrInput("");
    setPayoutNotesInput(`Weekly payout for ${contributor.name}`);
    setPayoutModalOpen(true);
  };

  const handleProcessPayout = async () => {
    if (!payoutTargetContributor) return;
    if (payoutAmountInput <= 0) {
      toast.error("Please enter a valid payout amount greater than 0.");
      return;
    }
    if (!payoutUtrInput.trim()) {
      toast.error("Please enter a bank/UPI transaction UTR reference number.");
      return;
    }

    setProcessingPayout(true);
    try {
      const method = payoutTargetContributor.preferred_payout_method || (payoutTargetContributor.upi_id ? "upi" : "bank");
      const details = {
        upi_id: payoutTargetContributor.upi_id,
        bank_name: payoutTargetContributor.bank_name,
        bank_account: payoutTargetContributor.bank_account,
        bank_ifsc: payoutTargetContributor.bank_ifsc,
        account_holder_name: payoutTargetContributor.account_holder_name,
      };

      const res = await submitPayout({
        data: {
          contributor_id: payoutTargetContributor.id,
          amount: Number(payoutAmountInput),
          payout_method: method as "upi" | "bank",
          payout_details: details,
          utr_reference: payoutUtrInput.trim(),
          notes: payoutNotesInput.trim() || "Weekly settlement",
        },
      });

      if (res && res.success) {
        toast.success(`Disbursed ₹${Number(payoutAmountInput).toLocaleString("en-IN")} to ${payoutTargetContributor.name}!`);
        setPayoutModalOpen(false);
        setPayoutTargetContributor(null);
        setPayoutUtrInput("");
        setPayoutNotesInput("");
        loadContributors();
      }
    } catch (err: any) {
      toast.error("Failed to record payout: " + (err.message || String(err)));
    } finally {
      setProcessingPayout(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`Copied ${label} to clipboard!`);
    }
  };

  const getContributorStatement = (contributor: any) => {
    if (!contributor) return [];
    const entries: any[] = [];

    // Add sales
    (contributor.sales_events || []).forEach((s: any) => {
      entries.push({
        id: s.id,
        date: new Date(s.created_at || Date.now()).getTime(),
        dateStr: new Date(s.created_at || Date.now()).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "sale",
        description: `Project Sale: ${s.title}`,
        details: `${s.commission_rate || 70}% royalty cut of ₹${s.gross_amount || s.amount}`,
        reference: s.payment_id ? `Ref: ${s.payment_id}` : `Units: ${s.units || 1}`,
        amount: s.amount,
        status: "completed",
      });
    });

    // Add payouts
    (contributor.payouts || []).forEach((p: any) => {
      entries.push({
        id: p.id,
        date: new Date(p.created_at || Date.now()).getTime(),
        dateStr: new Date(p.created_at || Date.now()).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "payout",
        description: `Weekly Payout Disbursed via ${p.payout_method?.toUpperCase() || "UPI"}`,
        details: p.notes || "Weekly automated payout",
        reference: p.utr_reference ? `UTR: ${p.utr_reference}` : "Completed",
        amount: p.amount,
        status: p.status || "completed",
      });
    });

    // Sort ascending first to calculate running balance, then reverse for display
    entries.sort((a, b) => a.date - b.date);
    let balance = 0;
    entries.forEach((e) => {
      if (e.type === "sale") {
        balance += e.amount;
      } else {
        balance = Math.max(0, balance - e.amount);
      }
      e.runningBalance = balance;
    });

    return entries.reverse();
  };

  const loadCoupons = async () => {
    setLoadingCoupons(true);
    setCouponsTableMissing(false);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        if (error.code === "PGRST116" || error.message.includes("does not exist")) {
          setCouponsTableMissing(true);
        } else {
          throw error;
        }
      } else {
        setCoupons(data || []);
      }
    } catch (err: any) {
      console.warn("Coupons load failed: ", err);
      setCouponsTableMissing(true);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const loadQueries = async () => {
    setLoadingQueries(true);
    setQueriesTableMissing(false);
    try {
      const data = await fetchQueries();
      setQueries(data || []);
    } catch (err: any) {
      console.warn("Queries load failed: ", err);
      const msg = err?.message || String(err);
      if (
        msg.includes("contact_queries") ||
        msg.includes("does not exist") ||
        msg.includes("PGRST205") ||
        msg.includes("PGRST116")
      ) {
        setQueriesTableMissing(true);
      } else {
        toast.error("Failed to load queries: " + msg);
      }
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact query?")) return;
    try {
      await deleteQueryFn({ data: { id } });
      toast.success("Query deleted successfully");
      loadQueries();
    } catch (err: any) {
      toast.error("Failed to delete query: " + err.message);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const val = parseFloat(couponForm.discount_value);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (couponForm.discount_type === "percentage" && val > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    try {
      const { error } = await supabase
        .from("coupons")
        .insert({
          code: couponForm.code.trim().toUpperCase(),
          discount_type: couponForm.discount_type,
          discount_value: val,
          active: couponForm.active
        });

      if (error) throw error;
      toast.success("Coupon created successfully!");
      setCouponForm({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        active: true
      });
      loadCoupons();
    } catch (err: any) {
      toast.error("Failed to create coupon: " + err.message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Coupon deleted!");
      loadCoupons();
    } catch (err: any) {
      toast.error("Failed to delete coupon: " + err.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
      sessionStorage.setItem("sb_admin_auth", "true");
      setIsLogged(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sb_admin_auth");
    setIsLogged(false);
    toast.success("Logged out successfully.");
  };

  // Upload Project Thumbnail
  const handleProjThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProjThumb(true);
    try {
      const publicUrl = await uploadFile(file, "thumbnails");
      setProjectForm((prev) => ({ ...prev, thumbnail: publicUrl }));
      toast.success("Thumbnail uploaded successfully!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingProjThumb(false);
    }
  };

  // Upload Project Screenshots
  const handleProjScreenshotsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingProjScreenshots(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], "screenshots");
        urls.push(url);
      }
      const existing = projectForm.screenshots ? projectForm.screenshots.split(",").map((s) => s.trim()) : [];
      const updated = [...existing, ...urls].filter(Boolean).join(", ");
      setProjectForm((prev) => ({ ...prev, screenshots: updated }));
      toast.success(`Successfully uploaded ${files.length} screenshots!`);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingProjScreenshots(false);
    }
  };

  // Upload Project Zip File
  const handleProjZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProjZip(true);
    try {
      const publicUrl = await uploadFile(file, "zips");
      setProjectForm((prev) => ({ ...prev, zip_url: publicUrl }));
      toast.success("Project ZIP file uploaded successfully!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingProjZip(false);
    }
  };

  // Submit project
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustomProjCategorySelected ? customProjCategory : projectForm.category;

    if (!projectForm.slug || !projectForm.title || !projectForm.description || !projectForm.price || !finalCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      slug: projectForm.slug,
      title: projectForm.title,
      description: projectForm.description,
      long_description: projectForm.long_description,
      price: parseFloat(projectForm.price),
      category: finalCategory,
      thumbnail: projectForm.thumbnail 
        ? (projectForm.thumbnail.trim() + (projectForm.thumbnail_alt ? "||" + projectForm.thumbnail_alt.trim() : ""))
        : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      screenshots: projectForm.screenshots.split(",").map((s) => s.trim()).filter(Boolean),
      youtube_id: extractYoutubeId(projectForm.youtube_id),
      tech: projectForm.tech.split(",").map((t) => t.trim()).filter(Boolean),
      zip_url: projectForm.zip_url,
      faqs: projectFaqs,
    };

    try {
      if (editingProject) {
        // Update
        const { error } = await supabase
          .from("library_projects")
          .update(payload)
          .eq("id", editingProject.id);
        if (error) throw error;
        toast.success("Project updated successfully!");
      } else {
        // Create
        const { error } = await supabase
          .from("library_projects")
          .insert([payload]);
        if (error) throw error;
        toast.success("Project added to library!");
      }
      setIsProjectModalOpen(false);
      resetProjectForm();
      loadLibraryProjects();
    } catch (err: any) {
      toast.error("Error saving project: " + err.message);
    }
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setProjectForm({
      slug: "",
      title: "",
      description: "",
      long_description: "",
      price: "",
      category: "",
      thumbnail: "",
      thumbnail_alt: "",
      screenshots: "",
      youtube_id: "",
      tech: "",
      zip_url: "",
    });
    setCustomProjCategory("");
    setIsCustomProjCategorySelected(false);
    setProjectFaqs([]);
    setNewFaqQ("");
    setNewFaqA("");
  };

  const editProject = (p: any) => {
    setEditingProject(p);
    const [thumbUrl, thumbAlt] = (p.thumbnail || "").split("||");
    setProjectForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      long_description: p.long_description || "",
      price: p.price.toString(),
      category: p.category,
      thumbnail: thumbUrl || "",
      thumbnail_alt: thumbAlt || "",
      screenshots: (p.screenshots || []).join(", "),
      youtube_id: p.youtube_id || "",
      tech: (p.tech || []).join(", "),
      zip_url: p.zip_url || "",
    });
    setCustomProjCategory("");
    setIsCustomProjCategorySelected(false);
    setProjectFaqs(p.faqs || []);
    setIsProjectModalOpen(true);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from("library_projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted successfully.");
      loadLibraryProjects();
    } catch (err: any) {
      toast.error("Error deleting project: " + err.message);
    }
  };

  // Computed Project Approvals
  const contributorProjects = projects.filter(
    (p) => p.contributor_id || p.status === "under_review" || p.status === "rejected" || p.is_approved === false
  );
  const pendingApprovalsCount = projects.filter(
    (p) => p.status === "under_review" || p.is_approved === false
  ).length;
  const publishedApprovalsCount = projects.filter(
    (p) => (p.status === "published" || (!p.status && p.is_approved !== false)) && (p.contributor_id || p.is_approved === true)
  ).length;
  const rejectedApprovalsCount = projects.filter(
    (p) => p.status === "rejected"
  ).length;

  const filteredApprovals = contributorProjects.filter((p) => {
    const isPending = p.status === "under_review" || p.is_approved === false;
    const isPublished = (p.status === "published" || (!p.status && p.is_approved !== false)) && (p.contributor_id || p.is_approved === true);
    const isRejected = p.status === "rejected";

    if (approvalsFilter === "pending" && !isPending) return false;
    if (approvalsFilter === "published" && !isPublished) return false;
    if (approvalsFilter === "rejected" && !isRejected) return false;

    if (approvalsSearch.trim()) {
      const q = approvalsSearch.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchCategory = (p.category || "").toLowerCase().includes(q);
      const matchTech = Array.isArray(p.tech) ? p.tech.some((t: string) => (t || "").toLowerCase().includes(q)) : false;
      const matchAuthor = (p.contributor_name || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchTech && !matchAuthor) return false;
    }
    return true;
  });

  const handleApproveProject = async (project: any) => {
    setProcessingApprovalId(project.id);
    try {
      const { error } = await supabase
        .from("library_projects")
        .update({
          status: "published",
          is_approved: true,
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", project.id);
      
      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? { ...p, status: "published", is_approved: true, rejection_reason: null }
            : p
        )
      );

      if (reviewingProject && reviewingProject.id === project.id) {
        setReviewingProject({ ...reviewingProject, status: "published", is_approved: true, rejection_reason: null });
      }

      toast.success(`Project "${project.title}" approved & published to Marketplace!`);
    } catch (err: any) {
      toast.error("Failed to approve project: " + err.message);
    } finally {
      setProcessingApprovalId(null);
    }
  };

  const handleOpenRejectModal = (project: any) => {
    setRejectionTargetProject(project);
    setRejectionReasonInput(project.rejection_reason || "");
    setRejectionModalOpen(true);
  };

  const handleRejectProject = async () => {
    if (!rejectionTargetProject) return;
    setProcessingApprovalId(rejectionTargetProject.id);
    try {
      const reason = rejectionReasonInput.trim() || "Project requirements not fully met. Please verify code or documentation.";
      const { error } = await supabase
        .from("library_projects")
        .update({
          status: "rejected",
          is_approved: false,
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq("id", rejectionTargetProject.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === rejectionTargetProject.id
            ? { ...p, status: "rejected", is_approved: false, rejection_reason: reason }
            : p
        )
      );

      if (reviewingProject && reviewingProject.id === rejectionTargetProject.id) {
        setReviewingProject({ ...reviewingProject, status: "rejected", is_approved: false, rejection_reason: reason });
      }

      toast.error(`Project marked as rejected with feedback.`);
      setRejectionModalOpen(false);
      setRejectionTargetProject(null);
      setRejectionReasonInput("");
    } catch (err: any) {
      toast.error("Failed to reject project: " + err.message);
    } finally {
      setProcessingApprovalId(null);
    }
  };

  const addProjectFaq = () => {
    if (!newFaqQ || !newFaqA) {
      toast.error("Please fill in both question and answer.");
      return;
    }
    setProjectFaqs([...projectFaqs, { question: newFaqQ, answer: newFaqA }]);
    setNewFaqQ("");
    setNewFaqA("");
  };

  const removeProjectFaq = (idx: number) => {
    setProjectFaqs(projectFaqs.filter((_, i) => i !== idx));
  };

  // Upload Blog Thumbnail
  const handleBlogThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBlogThumb(true);
    try {
      const publicUrl = await uploadFile(file, "blogs");
      setBlogForm((prev) => ({ ...prev, thumbnail: publicUrl }));
      toast.success("Blog thumbnail uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingBlogThumb(false);
    }
  };

  // Rich Editor toolbar action
  const execEditorCommand = (command: string, value: string = "") => {
    restoreSelection();
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    // Set default paragraph block separator
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch (e) {}
    
    if (command === "formatBlock") {
      const tag = value.replace(/[<>]/g, "").toUpperCase(); // e.g. "H1", "H2", "H3", "H4", "P"
      let success = false;
      
      try {
        // Try executing formatBlock with native tag format
        success = document.execCommand("formatBlock", false, `<${tag}>`);
      } catch (e) {}
      
      if (!success) {
        try {
          // Try executing formatBlock with raw tag name
          success = document.execCommand("formatBlock", false, tag);
        } catch (e) {}
      }
      
      // Fallback: Manually swap block level containers if browser execution fails
      if (!success) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let container: Node | null = range.commonAncestorContainer;
          
          while (
            container &&
            container !== editorRef.current &&
            container.nodeName !== "P" &&
            container.nodeName !== "DIV" &&
            !/^H[1-6]$/.test(container.nodeName)
          ) {
            container = container.parentNode;
          }
          
          if (container && container !== editorRef.current) {
            const newElement = document.createElement(tag);
            newElement.innerHTML = (container as HTMLElement).innerHTML;
            (container.parentNode as HTMLElement).replaceChild(newElement, container);
            
            // Re-select newly created block
            const newRange = document.createRange();
            newRange.selectNodeContents(newElement);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            const newElement = document.createElement(tag);
            newElement.innerHTML = "&#8203;"; // Zero-width space to keep selection focusable
            range.insertNode(newElement);
            
            const newRange = document.createRange();
            newRange.setStart(newElement, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setBlogForm((prev) => ({ ...prev, content: html }));
    }
    
    saveSelection();
  };

  // Upload Image inside Rich Editor
  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info("Uploading image to storage...");
    try {
      const publicUrl = await uploadFile(file, "blog-images");
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand("insertImage", false, publicUrl);
        const html = editorRef.current.innerHTML;
        setBlogForm((prev) => ({ ...prev, content: html }));
        toast.success("Image embedded in editor!");
      }
    } catch (err: any) {
      toast.error("Image upload failed: " + err.message);
    }
  };

  // Submit blog
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustomBlogCategorySelected ? customBlogCategory : blogForm.category;

    if (!blogForm.slug || !blogForm.title || !blogForm.content || !finalCategory) {
      toast.error("Please fill in slug, title, content, and category.");
      return;
    }

    const payload = {
      slug: blogForm.slug,
      title: blogForm.title,
      content: blogForm.content,
      thumbnail: blogForm.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      category: finalCategory,
    };

    try {
      if (editingBlog) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editingBlog.id);
        if (error) throw error;
        toast.success("Blog post updated!");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([payload]);
        if (error) throw error;
        toast.success("Blog post created!");
      }
      setIsBlogModalOpen(false);
      resetBlogForm();
      loadBlogPosts();
    } catch (err: any) {
      toast.error("Error saving blog post: " + err.message);
    }
  };

  const resetBlogForm = () => {
    setEditingBlog(null);
    setBlogForm({
      slug: "",
      title: "",
      content: "",
      thumbnail: "",
      category: "",
    });
    setCustomBlogCategory("");
    setIsCustomBlogCategorySelected(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const editBlog = (b: any) => {
    setEditingBlog(b);
    setBlogForm({
      slug: b.slug,
      title: b.title,
      content: b.content,
      thumbnail: b.thumbnail || "",
      category: b.category || "",
    });
    setCustomBlogCategory("");
    setIsCustomBlogCategorySelected(false);
    setIsBlogModalOpen(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = b.content || "";
      }
    }, 50);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Blog post deleted.");
      loadBlogPosts();
    } catch (err: any) {
      toast.error("Error deleting blog post: " + err.message);
    }
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-slate-100 shadow-2xl">
          <CardHeader className="space-y-2 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
              <FolderLock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Authentication</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to manage ScholarBuild's Project Library and Blog Posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username / Email</label>
                <Input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@eduprojects.com"
                  className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 font-semibold mt-2">
                Log In
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Return to Website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Side bar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between shrink-0 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="projectbyAI Admin" 
              className="h-9 w-auto object-contain brightness-0 invert" 
            />
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("library")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "library" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Project Library
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "approvals" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>Project Approvals</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("contributors")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "contributors" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4" />
                <span>Contributors & Payouts</span>
              </div>
              {contributorsData.summary.pendingWeeklySettlement > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                  ₹{Math.round(contributorsData.summary.pendingWeeklySettlement).toLocaleString("en-IN")}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "blogs" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "users" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Users className="h-4 w-4" />
              Registered Users
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "coupons" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Tag className="h-4 w-4" />
              Marketing Coupons
            </button>
            <button
              onClick={() => setActiveTab("queries")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "queries" ? "bg-primary text-primary-foreground shadow" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Mail className="h-4 w-4" />
              Contact Queries
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              User Portal
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "library" ? (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-5">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Project Library Manager</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage project templates and downloadables.</p>
              </div>
              <Button onClick={() => { resetProjectForm(); setIsProjectModalOpen(true); }} className="bg-gradient-primary shadow-elegant font-semibold">
                <Plus className="h-4 w-4 mr-1.5" /> Create New
              </Button>
            </div>

            {/* List in 1 row 3 column layout */}
            {loadingProjects ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-white">
                No library projects found. Click "Create New" above to add your first template.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <Card key={p.id} className="overflow-hidden bg-white shadow hover:shadow-elegant transition-all flex flex-col border border-slate-200">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      {(() => {
                        const [thumbUrl, thumbAlt] = (p.thumbnail || "").split("||");
                        return (
                          <img src={thumbUrl} alt={thumbAlt || p.title} className="w-full h-full object-cover" />
                        );
                      })()}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary">{p.category}</Badge>
                          <span className="font-bold text-primary text-base">₹{p.price}</span>
                        </div>
                        <h3 className="font-bold text-lg leading-snug line-clamp-2">{p.title}</h3>
                        <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed prose dark:prose-invert max-w-none text-[10px]" dangerouslySetInnerHTML={{ __html: p.description || "" }} />
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 border-slate-200 text-slate-770 hover:bg-slate-50" onClick={() => editProject(p)}>
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteProject(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Modal Overlay for Add/Edit Project */}
            {isProjectModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
                  <button onClick={() => { setIsProjectModalOpen(false); resetProjectForm(); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
                    <X className="h-5 w-5" />
                  </button>
                  <CardHeader className="border-b">
                    <CardTitle className="text-2xl font-bold">
                      {editingProject ? "Edit Library Project" : "Create New Library Project"}
                    </CardTitle>
                    <CardDescription>
                      Upload thumbnails, screenshots, and codes. Changes sync live.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="overflow-y-auto p-6 space-y-6 flex-1">
                    <form onSubmit={handleProjectSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase">URL Slug *</label>
                          <Input
                            value={projectForm.slug}
                            onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                            placeholder="e.g. smart-attendance"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase">Project Title *</label>
                          <Input
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="e.g. Smart Attendance System"
                            required
                          />
                        </div>
                      </div>

                       <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Short Card Summary *</label>
                        <RichTextEditor
                          value={projectForm.description}
                          onChange={(val) => setProjectForm({ ...projectForm, description: val })}
                          placeholder="Brief 2-sentence summary visible in grids..."
                          minHeight="120px"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Detailed Description</label>
                        <RichTextEditor
                          value={projectForm.long_description}
                          onChange={(val) => setProjectForm({ ...projectForm, long_description: val })}
                          placeholder="Comprehensive details about the project stack, database structure, and module layouts..."
                          minHeight="300px"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase">Price (₹) *</label>
                          <Input
                            type="number"
                            step="1"
                            value={projectForm.price}
                            onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                            placeholder="e.g. 499"
                            required
                          />
                        </div>
                        
                        {/* Category Dropdown Selector */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase block">Category *</label>
                          {isCustomProjCategorySelected ? (
                            <div className="flex gap-2">
                              <Input
                                value={customProjCategory}
                                onChange={(e) => setCustomProjCategory(e.target.value)}
                                placeholder="New category name..."
                                className="flex-1 bg-white"
                              />
                              <Button 
                                type="button" 
                                size="sm"
                                onClick={() => {
                                  if (!customProjCategory.trim()) {
                                    toast.error("Please enter a category name");
                                    return;
                                  }
                                  const cleaned = customProjCategory.trim();
                                  if (!projCategories.includes(cleaned)) {
                                    setProjCategories([...projCategories, cleaned]);
                                  }
                                  setProjectForm((prev) => ({ ...prev, category: cleaned }));
                                  setIsCustomProjCategorySelected(false);
                                  toast.success(`Category "${cleaned}" created and selected!`);
                                }}
                                className="bg-primary hover:opacity-95 font-semibold shrink-0"
                              >
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsCustomProjCategorySelected(false);
                                  setCustomProjCategory("");
                                }}
                                className="shrink-0"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <select
                              value={projectForm.category}
                              onChange={(e) => {
                                if (e.target.value === "new") {
                                  setIsCustomProjCategorySelected(true);
                                  setCustomProjCategory("");
                                } else {
                                  setProjectForm((prev) => ({ ...prev, category: e.target.value }));
                                }
                              }}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white"
                            >
                              <option value="">Select category...</option>
                              {projCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="new">+ Create New Category</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Thumbnail upload */}
                      <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50">
                        <label className="text-xs font-bold text-slate-700 uppercase block">Thumbnail Image</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Input
                              value={projectForm.thumbnail}
                              onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                              placeholder="Image URL or upload below..."
                              className="bg-white mb-2"
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-white hover:bg-slate-50 h-8 px-3 transition-colors gap-1.5">
                                <Upload className="h-3.5 w-3.5 text-slate-500" />
                                {uploadingProjThumb ? "Uploading..." : "Upload File"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleProjThumbUpload}
                                  disabled={uploadingProjThumb}
                                />
                              </label>
                              {projectForm.thumbnail && <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5"><Check className="h-3 w-3" /> Ready</span>}
                            </div>
                            <Input
                              value={projectForm.thumbnail_alt}
                              onChange={(e) => setProjectForm({ ...projectForm, thumbnail_alt: e.target.value })}
                              placeholder="Thumbnail Alt Tag (SEO keyword)..."
                              className="bg-white mt-2 text-xs h-8"
                            />
                          </div>
                          {projectForm.thumbnail && (
                            <div className="h-20 w-28 rounded border overflow-hidden shrink-0 bg-slate-100 self-start">
                              <img src={projectForm.thumbnail} className="w-full h-full object-cover" alt={projectForm.thumbnail_alt} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Screenshots upload */}
                      <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50">
                        <label className="text-xs font-bold text-slate-700 uppercase block">Screenshots (comma-separated URLs)</label>
                        <Input
                          value={projectForm.screenshots}
                          onChange={(e) => setProjectForm({ ...projectForm, screenshots: e.target.value })}
                          placeholder="Upload screenshots below or paste URLs..."
                          className="bg-white mb-2 text-xs"
                        />
                        <div className="flex flex-col gap-2">
                          <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-white hover:bg-slate-50 h-8 px-3 transition-colors gap-1.5 self-start">
                            <Upload className="h-3.5 w-3.5 text-slate-500" />
                            {uploadingProjScreenshots ? "Uploading..." : "Upload Screenshots (Multiple)"}
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleProjScreenshotsUpload}
                              disabled={uploadingProjScreenshots}
                            />
                          </label>
                          
                          {/* Screenshots preview & alt tag inputs list */}
                          {(() => {
                            const screenshotsList = projectForm.screenshots
                              ? projectForm.screenshots.split(",").map(s => {
                                  const parts = s.trim().split("||");
                                  return {
                                    url: parts[0] || "",
                                    alt: parts[1] || ""
                                  };
                                }).filter(item => item.url)
                              : [];

                            if (screenshotsList.length === 0) return null;

                            return (
                              <div className="space-y-3 pt-2 w-full">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Manage Screenshots & Alt Tags:</div>
                                <div className="grid gap-3 sm:grid-cols-2 max-h-60 overflow-y-auto pr-1">
                                  {screenshotsList.map((item, idx) => (
                                    <div key={idx} className="flex gap-2.5 p-2 bg-white border rounded-lg items-center relative group shadow-sm">
                                      <div className="h-11 w-16 rounded border overflow-hidden shrink-0 bg-slate-100">
                                        <img src={item.url} className="w-full h-full object-cover" alt={item.alt} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[9px] text-slate-400 truncate mb-1" title={item.url}>{item.url}</div>
                                        <Input
                                          size="sm"
                                          value={item.alt}
                                          onChange={(e) => {
                                            const updatedList = [...screenshotsList];
                                            updatedList[idx] = { ...item, alt: e.target.value };
                                            const serialized = updatedList.map(x => x.url + (x.alt ? "||" + x.alt : "")).join(", ");
                                            setProjectForm(prev => ({ ...prev, screenshots: serialized }));
                                          }}
                                          placeholder="Alt Tag (SEO keyword)..."
                                          className="h-6.5 text-[11px] bg-slate-50/50 py-1"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedList = screenshotsList.filter((_, i) => i !== idx);
                                          const serialized = updatedList.map(x => x.url + (x.alt ? "||" + x.alt : "")).join(", ");
                                          setProjectForm(prev => ({ ...prev, screenshots: serialized }));
                                          toast.success("Screenshot removed.");
                                        }}
                                        className="h-4.5 w-4.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 self-start mt-0.5"
                                        title="Remove screenshot"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* YouTube Video URL */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase block">YouTube Video link *</label>
                          <Input
                            value={projectForm.youtube_id}
                            onChange={(e) => setProjectForm({ ...projectForm, youtube_id: e.target.value })}
                            placeholder="Paste watch url or embed link..."
                          />
                          {projectForm.youtube_id && (
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                              <Link2 className="h-3 w-3" /> Extracted ID: <span className="font-semibold text-slate-700">{extractYoutubeId(projectForm.youtube_id)}</span>
                            </div>
                          )}
                        </div>

                        {/* Project Zip file upload */}
                        <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50">
                          <label className="text-xs font-bold text-slate-700 uppercase block">Project ZIP File</label>
                          <Input
                            value={projectForm.zip_url}
                            onChange={(e) => setProjectForm({ ...projectForm, zip_url: e.target.value })}
                            placeholder="ZIP download URL or upload below..."
                            className="bg-white mb-2 text-xs"
                          />
                          <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-white hover:bg-slate-50 h-8 px-3 transition-colors gap-1.5">
                            <Upload className="h-3.5 w-3.5 text-slate-500" />
                            {uploadingProjZip ? "Uploading ZIP..." : "Upload ZIP File"}
                            <input
                              type="file"
                              accept=".zip"
                              className="hidden"
                              onChange={handleProjZipUpload}
                              disabled={uploadingProjZip}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Tech Stack (comma-separated)</label>
                        <Input
                          value={projectForm.tech}
                          onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                          placeholder="React, Python, OpenCV"
                        />
                      </div>

                      {/* FAQs Builder */}
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                          <HelpCircle className="h-4 w-4 text-primary" />
                          <span>Custom Project FAQs</span>
                        </div>
                        
                        {projectFaqs.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded-lg bg-slate-50">
                            {projectFaqs.map((faq, idx) => (
                              <div key={idx} className="flex justify-between items-start gap-3 text-xs border-b pb-2 last:border-0 last:pb-0">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-slate-800">Q: {faq.question}</div>
                                  <div className="text-slate-600">A: {faq.answer}</div>
                                </div>
                                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeProjectFaq(idx)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="bg-slate-50 border p-4 rounded-lg space-y-3">
                          <div className="text-xs font-bold text-slate-700">Add New FAQ Question</div>
                          <Input
                            value={newFaqQ}
                            onChange={(e) => setNewFaqQ(e.target.value)}
                            placeholder="e.g. Is database configuration included?"
                            className="bg-white"
                          />
                          <Textarea
                            value={newFaqA}
                            onChange={(e) => setNewFaqA(e.target.value)}
                            placeholder="e.g. Yes, SQLite/Postgres schemas are bundled in the repository..."
                            className="bg-white min-h-16"
                          />
                          <Button type="button" variant="outline" size="sm" onClick={addProjectFaq} className="border-slate-200">
                            <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add FAQ
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" className="border-slate-200" onClick={() => { setIsProjectModalOpen(false); resetProjectForm(); }}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                          {editingProject ? "Save Changes" : "Create Project"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : activeTab === "approvals" ? (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight">Project Approvals</h1>
                  {pendingApprovalsCount > 0 && (
                    <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 font-bold px-2.5 py-0.5">
                      {pendingApprovalsCount} Pending
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Inspect and verify projects submitted by contributors before publishing to the public marketplace.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={loadLibraryProjects}
                disabled={loadingProjects}
                className="gap-2 border-slate-200"
              >
                <RefreshCw className={`h-4 w-4 ${loadingProjects ? "animate-spin" : ""}`} />
                Refresh Submissions
              </Button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Review</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">{pendingApprovalsCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting verification</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Published in Market</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{publishedApprovalsCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Live & purchasable</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Changes Requested</p>
                    <p className="text-2xl font-black text-rose-600 mt-1">{rejectedApprovalsCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Feedback sent</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Submissions</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{contributorProjects.length}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">From all contributors</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <Button
                  size="sm"
                  variant={approvalsFilter === "pending" ? "default" : "ghost"}
                  onClick={() => setApprovalsFilter("pending")}
                  className={`text-xs gap-1.5 h-8 font-medium ${approvalsFilter === "pending" ? "bg-amber-600 hover:bg-amber-700 text-white" : "text-slate-600"}`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Pending ({pendingApprovalsCount})
                </Button>
                <Button
                  size="sm"
                  variant={approvalsFilter === "published" ? "default" : "ghost"}
                  onClick={() => setApprovalsFilter("published")}
                  className={`text-xs gap-1.5 h-8 font-medium ${approvalsFilter === "published" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-slate-600"}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Published ({publishedApprovalsCount})
                </Button>
                <Button
                  size="sm"
                  variant={approvalsFilter === "rejected" ? "default" : "ghost"}
                  onClick={() => setApprovalsFilter("rejected")}
                  className={`text-xs gap-1.5 h-8 font-medium ${approvalsFilter === "rejected" ? "bg-rose-600 hover:bg-rose-700 text-white" : "text-slate-600"}`}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Changes Needed ({rejectedApprovalsCount})
                </Button>
                <Button
                  size="sm"
                  variant={approvalsFilter === "all" ? "default" : "ghost"}
                  onClick={() => setApprovalsFilter("all")}
                  className={`text-xs gap-1.5 h-8 font-medium ${approvalsFilter === "all" ? "bg-slate-900 hover:bg-slate-800 text-white" : "text-slate-600"}`}
                >
                  All ({contributorProjects.length})
                </Button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={approvalsSearch}
                  onChange={(e) => setApprovalsSearch(e.target.value)}
                  placeholder="Search title, contributor, stack..."
                  className="pl-8 text-xs h-8 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* Submissions List */}
            {loadingProjects ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                Loading submissions...
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-white space-y-2 p-6">
                <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700">No submissions found</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {approvalsFilter === "pending"
                    ? "Great job! All contributor projects have been reviewed and approved."
                    : "No projects match the selected status or search filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((p) => {
                  const [thumbUrl, thumbAlt] = (p.thumbnail || "").split("||");
                  const isPending = p.status === "under_review" || p.is_approved === false;
                  const isPublished = (p.status === "published" || (!p.status && p.is_approved !== false)) && (p.contributor_id || p.is_approved === true);
                  const isRejected = p.status === "rejected";

                  return (
                    <Card key={p.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                        {/* Thumbnail & Title Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="h-20 w-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={thumbAlt || p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-base text-slate-900 truncate">{p.title}</h3>
                              {p.category && (
                                <Badge variant="secondary" className="text-[11px] font-medium bg-slate-100 text-slate-700">
                                  {p.category}
                                </Badge>
                              )}
                              {isPending ? (
                                <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Pending Review
                                </Badge>
                              ) : isRejected ? (
                                <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[11px] font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  Changes Needed
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Published Live
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>
                                Contributor: <strong className="text-slate-800">{p.contributor_name || "Academic Contributor"}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Commission: <strong className="text-slate-800">{p.commission_rate || (p.tutorial_video_url ? 90 : 70)}%</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Price: <strong className="text-slate-900 font-bold">₹{p.price}</strong>
                              </span>
                              {p.created_at && (
                                <>
                                  <span>•</span>
                                  <span>Submitted: {new Date(p.created_at).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>

                            {/* Tech pills */}
                            {Array.isArray(p.tech) && p.tech.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                {p.tech.slice(0, 4).map((techName: string, idx: number) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                                    {techName}
                                  </span>
                                ))}
                                {p.tech.length > 4 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    +{p.tech.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Rejection reason callout if present */}
                            {isRejected && p.rejection_reason && (
                              <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
                                <span className="font-semibold">Feedback sent to contributor: </span>
                                {p.rejection_reason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0 self-end lg:self-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReviewingProject(p)}
                            className="text-xs h-8 gap-1.5 border-slate-300 hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-600" />
                            Review Project
                          </Button>

                          {!isPublished && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveProject(p)}
                              disabled={processingApprovalId === p.id}
                              className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                            >
                              {processingApprovalId === p.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                              Approve & Publish
                            </Button>
                          )}

                          {!isRejected && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenRejectModal(p)}
                              disabled={processingApprovalId === p.id}
                              className="text-xs h-8 gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                              Request Changes
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => editProject(p)}
                            className="text-xs h-8 text-slate-500 hover:text-slate-800 px-2"
                            title="Edit details directly"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteProject(p.id)}
                            className="text-xs h-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2"
                            title="Delete submission"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Detailed Inspection Modal */}
            {reviewingProject && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-4xl bg-white border border-slate-200 text-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
                  <button
                    onClick={() => setReviewingProject(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-1 rounded-full hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Inspection & Approval</span>
                      {reviewingProject.status === "under_review" || reviewingProject.is_approved === false ? (
                        <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 text-xs">Under Review</Badge>
                      ) : reviewingProject.status === "rejected" ? (
                        <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-xs">Changes Needed</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-xs">Published Live</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold mt-1">{reviewingProject.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-3 mt-1 flex-wrap">
                      <span>Category: <strong>{reviewingProject.category || "General"}</strong></span>
                      <span>•</span>
                      <span>Slug: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/projects/{reviewingProject.slug}</code></span>
                      <span>•</span>
                      <span>Price: <strong className="text-slate-900 font-bold">₹{reviewingProject.price}</strong></span>
                      <span>•</span>
                      <span>Contributor: <strong>{reviewingProject.contributor_name || "Academic Contributor"}</strong></span>
                      <span>•</span>
                      <span>Royalty: <strong>{reviewingProject.commission_rate || 70}%</strong></span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="overflow-y-auto p-6 space-y-6 flex-1 text-sm">
                    {/* Deliverables checklist */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submitted Project Deliverables</h4>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {/* Source Code ZIP */}
                        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                            <Download className="h-4 w-4 text-primary" />
                            Source Code ZIP
                          </div>
                          {reviewingProject.zip_url ? (
                            <a
                              href={reviewingProject.zip_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline break-all"
                            >
                              Download Code Archive <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs text-rose-600 font-medium">No code ZIP provided</p>
                          )}
                        </div>

                        {/* Tutorial Video */}
                        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                            <Video className="h-4 w-4 text-amber-600" />
                            Walkthrough Video
                          </div>
                          {reviewingProject.tutorial_video_url ? (
                            <a
                              href={reviewingProject.tutorial_video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium hover:underline break-all"
                            >
                              Open Contributor Video <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ) : reviewingProject.youtube_id ? (
                            <a
                              href={`https://www.youtube.com/watch?v=${reviewingProject.youtube_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium hover:underline"
                            >
                              YouTube Demo <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs text-muted-foreground">Standard 70% rate (no video)</p>
                          )}
                        </div>

                        {/* Live Public Page */}
                        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                          <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                            <ExternalLink className="h-4 w-4 text-emerald-600" />
                            Marketplace URL
                          </div>
                          <Link
                            to="/projects/$slug"
                            params={{ slug: reviewingProject.slug }}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium hover:underline"
                          >
                            Preview Project Page <ExternalLink className="h-3 w-3 shrink-0" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail & Media Preview */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Visual Assets</h4>
                      <div className="flex items-start gap-4 flex-wrap">
                        {reviewingProject.thumbnail && (
                          <div className="space-y-1">
                            <span className="text-[11px] text-muted-foreground block">Cover Thumbnail:</span>
                            <img
                              src={reviewingProject.thumbnail.split("||")[0]}
                              alt="Thumbnail"
                              className="h-32 w-auto max-w-xs object-cover rounded-lg border border-slate-200 shadow-sm"
                            />
                          </div>
                        )}
                        {Array.isArray(reviewingProject.screenshots) && reviewingProject.screenshots.length > 0 && (
                          <div className="space-y-1 flex-1">
                            <span className="text-[11px] text-muted-foreground block">Screenshots ({reviewingProject.screenshots.length}):</span>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                              {reviewingProject.screenshots.map((s: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={s}
                                  alt={`Screenshot ${idx + 1}`}
                                  className="h-32 w-auto max-w-xs object-cover rounded-lg border border-slate-200 shadow-sm shrink-0"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    {Array.isArray(reviewingProject.tech) && reviewingProject.tech.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tech Stack</h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {reviewingProject.tech.map((t: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-slate-50 font-normal">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short Summary */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Summary</h4>
                      <div
                        className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs leading-relaxed max-h-40 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: reviewingProject.description || "No summary provided." }}
                      />
                    </div>

                    {/* Long Description / README */}
                    {reviewingProject.long_description && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Documentation / README</h4>
                        <div
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs leading-relaxed max-h-60 overflow-y-auto prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: reviewingProject.long_description }}
                        />
                      </div>
                    )}

                    {/* Rejection Feedback History */}
                    {reviewingProject.rejection_reason && (
                      <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-900 text-xs space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-rose-800">
                          <AlertCircle className="h-4 w-4" /> Current Feedback Notes:
                        </span>
                        <p>{reviewingProject.rejection_reason}</p>
                      </div>
                    )}
                  </CardContent>

                  {/* Inspection Footer Actions */}
                  <div className="p-4 border-t bg-slate-50 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const p = reviewingProject;
                          setReviewingProject(null);
                          editProject(p);
                        }}
                        className="text-xs gap-1.5 border-slate-300"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const p = reviewingProject;
                          setReviewingProject(null);
                          handleOpenRejectModal(p);
                        }}
                        className="text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <AlertCircle className="h-3.5 w-3.5" />
                        Request Changes
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReviewingProject(null)}
                        className="text-xs"
                      >
                        Close
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveProject(reviewingProject)}
                        disabled={processingApprovalId === reviewingProject.id}
                        className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        {processingApprovalId === reviewingProject.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Approve & Publish to Marketplace
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Rejection / Change Request Modal */}
            {rejectionModalOpen && rejectionTargetProject && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl relative">
                  <button
                    onClick={() => {
                      setRejectionModalOpen(false);
                      setRejectionTargetProject(null);
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <CardHeader className="border-b">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-rose-700">
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                      Request Changes / Reject Submission
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Project: <strong className="text-slate-800">{rejectionTargetProject.title}</strong>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Feedback for Contributor *
                      </label>
                      <Textarea
                        value={rejectionReasonInput}
                        onChange={(e) => setRejectionReasonInput(e.target.value)}
                        placeholder="e.g. The source code ZIP archive is missing the database schema file (schema.sql), and the live demo URL returns 404. Please re-upload with these resolved."
                        className="min-h-28 text-xs bg-white"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        This feedback will appear in the contributor's dashboard so they know exactly what to revise before re-submitting.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-600 block">Quick reason presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Missing README / setup installation instructions",
                          "Source code ZIP archive is corrupted or password-protected",
                          "Missing database schema / migration files",
                          "Step-by-step video walkthrough link is inaccessible",
                          "Documentation does not meet academic IEEE standards"
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setRejectionReasonInput(preset)}
                            className="px-2 py-1 rounded text-[11px] bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-left transition-colors"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRejectionModalOpen(false);
                          setRejectionTargetProject(null);
                        }}
                        className="text-xs border-slate-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleRejectProject}
                        disabled={processingApprovalId === rejectionTargetProject.id}
                        className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5"
                      >
                        {processingApprovalId === rejectionTargetProject.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        Send Feedback & Request Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : activeTab === "contributors" ? (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight">Contributor Directory & Payout Hub</h1>
                  {contributorsData.summary.pendingWeeklySettlement > 0 && (
                    <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold px-2.5 py-0.5">
                      ₹{Math.round(contributorsData.summary.pendingWeeklySettlement).toLocaleString("en-IN")} Due
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage academic project contributors, track their project sales & royalties, and process weekly automated payouts.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={loadContributors}
                disabled={loadingContributors}
                className="gap-2 border-slate-200"
              >
                <RefreshCw className={`h-4 w-4 ${loadingContributors ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
            </div>

            {/* Weekly Settlement Notification Banner */}
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-50/80 text-indigo-950 flex items-start gap-3">
              <Clock className="w-5 h-5 shrink-0 text-indigo-600 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-sm block text-indigo-950">
                  Weekly Automated Payout Policy
                </span>
                <p className="text-indigo-800 leading-relaxed">
                  Contributors receive weekly payouts with <strong>no minimum price threshold</strong>. Any positive balance earned from project sales during the week is queued for settlement directly to their saved UPI ID or Bank Account.
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Contributors</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{contributorsData.summary.totalContributors}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Registered creators</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Creator Royalties</p>
                    <p className="text-2xl font-black text-indigo-600 mt-1">₹{Math.round(contributorsData.summary.totalEarnings).toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">70% & 90% tiers earned</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Disbursed</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">₹{Math.round(contributorsData.summary.totalDisbursed).toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Transferred to date</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due for Settlement</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">₹{Math.round(contributorsData.summary.pendingWeeklySettlement).toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Weekly queue</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant={contributorsTab === "queue" ? "default" : "ghost"}
                  onClick={() => setContributorsTab("queue")}
                  className={`text-xs gap-1.5 h-8 font-medium ${contributorsTab === "queue" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-slate-600"}`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  Weekly Settlement Queue ({contributorsData.contributors.filter((c: any) => c.unpaid_balance > 0).length})
                </Button>
                <Button
                  size="sm"
                  variant={contributorsTab === "directory" ? "default" : "ghost"}
                  onClick={() => setContributorsTab("directory")}
                  className={`text-xs gap-1.5 h-8 font-medium ${contributorsTab === "directory" ? "bg-slate-900 hover:bg-slate-800 text-white" : "text-slate-600"}`}
                >
                  <Users className="h-3.5 w-3.5" />
                  All Contributors ({contributorsData.contributors.length})
                </Button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  value={contributorsSearch}
                  onChange={(e) => setContributorsSearch(e.target.value)}
                  placeholder="Search name, email, UPI, bank..."
                  className="pl-8 text-xs h-8 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* Loading state */}
            {loadingContributors ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                Loading contributor statistics and ledger accounts...
              </div>
            ) : (() => {
              const q = contributorsSearch.toLowerCase();
              const filteredList = contributorsData.contributors.filter((c: any) => {
                if (contributorsTab === "queue" && c.unpaid_balance <= 0) return false;
                if (!q) return true;
                return (
                  (c.name || "").toLowerCase().includes(q) ||
                  (c.email || "").toLowerCase().includes(q) ||
                  (c.upi_id || "").toLowerCase().includes(q) ||
                  (c.bank_name || "").toLowerCase().includes(q) ||
                  (c.bank_account || "").toLowerCase().includes(q)
                );
              });

              if (filteredList.length === 0) {
                return (
                  <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-white space-y-2 p-6">
                    <CheckCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                    <p className="font-semibold text-slate-800">
                      {contributorsTab === "queue"
                        ? "All weekly payouts are settled!"
                        : "No contributors found matching your search."}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {contributorsTab === "queue"
                        ? "There are no pending contributor balances awaiting weekly disbursement."
                        : "Try a different search query or click Refresh Data above."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredList.map((c: any) => (
                    <Card key={c.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                        {/* Contributor Profile & Details */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
                              {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-base text-slate-900 truncate">{c.name}</h3>
                                {c.unpaid_balance > 0 && (
                                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[11px] font-semibold">
                                    ₹{Math.round(c.unpaid_balance).toLocaleString("en-IN")} Due
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                            </div>
                          </div>

                          {/* Stats Pills */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-1">
                            <span>
                              Registered: <strong className="text-slate-800">{new Date(c.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Live Projects: <strong className="text-slate-800">{c.projects_count}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Units Sold: <strong className="text-slate-800">{c.units_sold}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Lifetime Earned: <strong className="text-indigo-600 font-bold">₹{Math.round(c.lifetime_earnings).toLocaleString("en-IN")}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Paid to Date: <strong className="text-slate-800">₹{Math.round(c.total_withdrawn).toLocaleString("en-IN")}</strong>
                            </span>
                          </div>

                          {/* Payment Coordinates Box */}
                          <div className="mt-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3 flex-wrap text-xs">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5 shrink-0">
                              {c.preferred_payout_method === "bank" ? (
                                <>
                                  <Building className="h-3.5 w-3.5 text-indigo-600" /> Direct Bank:
                                </>
                              ) : (
                                <>
                                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> UPI ID:
                                </>
                              )}
                            </span>

                            {c.preferred_payout_method === "bank" && c.bank_account ? (
                              <div className="flex items-center gap-2 flex-wrap text-slate-800 font-mono text-[11px]">
                                <span>{c.bank_name || "Bank"}</span>
                                <span>•</span>
                                <span className="font-bold">A/C: {c.bank_account}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(c.bank_account, "Account Number")}
                                  className="text-slate-500 hover:text-slate-800 p-0.5"
                                  title="Copy Account Number"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <span>•</span>
                                <span>IFSC: {c.bank_ifsc}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(c.bank_ifsc, "IFSC Code")}
                                  className="text-slate-500 hover:text-slate-800 p-0.5"
                                  title="Copy IFSC Code"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <span>•</span>
                                <span>Holder: {c.account_holder_name}</span>
                              </div>
                            ) : c.upi_id ? (
                              <div className="flex items-center gap-2 text-slate-800 font-mono font-bold text-[11px]">
                                <span>{c.upi_id}</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(c.upi_id, "UPI ID")}
                                  className="text-slate-500 hover:text-slate-800 p-0.5"
                                  title="Copy UPI ID"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-amber-600 font-medium">No payout credentials saved yet</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingLedgerContributor(c)}
                            className="text-xs h-9 gap-1.5 border-slate-300 hover:bg-slate-50"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-slate-600" />
                            View Passbook / Ledger
                          </Button>

                          {c.unpaid_balance > 0 && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPayoutModal(c)}
                              className="text-xs h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Pay ₹{Math.round(c.unpaid_balance).toLocaleString("en-IN")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })()}

            {/* Passbook / Ledger Modal */}
            {viewingLedgerContributor && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-4xl bg-white border border-slate-200 text-slate-900 shadow-2xl relative max-h-[90vh] flex flex-col">
                  <button
                    onClick={() => setViewingLedgerContributor(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 p-1 rounded-full hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <CardHeader className="border-b pb-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-500/15 text-indigo-700 border-indigo-500/30 text-xs">
                        Official Contributor Ledger
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">ID: {viewingLedgerContributor.id}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold mt-1">
                      {viewingLedgerContributor.name} — Passbook Statement
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-3 mt-1 flex-wrap">
                      <span>Email: <strong>{viewingLedgerContributor.email}</strong></span>
                      <span>•</span>
                      <span>Lifetime Earnings: <strong className="text-indigo-600 font-bold">₹{Math.round(viewingLedgerContributor.lifetime_earnings).toLocaleString("en-IN")}</strong></span>
                      <span>•</span>
                      <span>Total Withdrawn: <strong>₹{Math.round(viewingLedgerContributor.total_withdrawn).toLocaleString("en-IN")}</strong></span>
                      <span>•</span>
                      <span>Unpaid Balance: <strong className="text-emerald-600 font-bold">₹{Math.round(viewingLedgerContributor.unpaid_balance).toLocaleString("en-IN")}</strong></span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="overflow-y-auto p-6 space-y-4 flex-1">
                    {/* Payment Info Card */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-muted-foreground block font-medium">Configured Payout Destination:</span>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {viewingLedgerContributor.preferred_payout_method === "bank" && viewingLedgerContributor.bank_account
                            ? `${viewingLedgerContributor.bank_name || "Bank"} — A/C: ${viewingLedgerContributor.bank_account} (IFSC: ${viewingLedgerContributor.bank_ifsc})`
                            : viewingLedgerContributor.upi_id
                            ? `UPI ID: ${viewingLedgerContributor.upi_id}`
                            : "No payout details on file"}
                        </div>
                      </div>
                      {viewingLedgerContributor.unpaid_balance > 0 && (
                        <Button
                          size="sm"
                          onClick={() => {
                            const c = viewingLedgerContributor;
                            setViewingLedgerContributor(null);
                            handleOpenPayoutModal(c);
                          }}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Settle ₹{Math.round(viewingLedgerContributor.unpaid_balance).toLocaleString("en-IN")}
                        </Button>
                      )}
                    </div>

                    {/* Statement Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                              <th className="p-3">Date & Time</th>
                              <th className="p-3">Transaction</th>
                              <th className="p-3">Reference / Notes</th>
                              <th className="p-3 text-right">Amount</th>
                              <th className="p-3 text-right">Running Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(() => {
                              const stmt = getContributorStatement(viewingLedgerContributor);
                              if (stmt.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                      No transaction history found for this contributor yet.
                                    </td>
                                  </tr>
                                );
                              }

                              return stmt.map((entry: any) => (
                                <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="p-3 text-slate-600 whitespace-nowrap">
                                    {entry.dateStr}
                                  </td>
                                  <td className="p-3">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5 font-semibold">
                                        {entry.type === "sale" ? (
                                          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-[10px] py-0 px-1.5">
                                            + SALE CREDIT
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30 text-[10px] py-0 px-1.5">
                                            - WEEKLY PAYOUT
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-slate-900 font-medium">{entry.description}</p>
                                      <p className="text-[11px] text-muted-foreground">{entry.details}</p>
                                    </div>
                                  </td>
                                  <td className="p-3 font-mono text-[11px] text-slate-600">
                                    {entry.reference}
                                  </td>
                                  <td className="p-3 text-right font-bold whitespace-nowrap">
                                    {entry.type === "sale" ? (
                                      <span className="text-emerald-600">+₹{Math.round(entry.amount).toLocaleString("en-IN")}</span>
                                    ) : (
                                      <span className="text-rose-600">-₹{Math.round(entry.amount).toLocaleString("en-IN")}</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right font-bold text-slate-900 font-mono whitespace-nowrap">
                                    ₹{Math.round(entry.runningBalance).toLocaleString("en-IN")}
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>

                  <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setViewingLedgerContributor(null)}>
                      Close Passbook
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Disburse Payout Modal */}
            {payoutModalOpen && payoutTargetContributor && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl relative">
                  <button
                    onClick={() => {
                      setPayoutModalOpen(false);
                      setPayoutTargetContributor(null);
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <CardHeader className="border-b">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-emerald-700">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                      Disburse Weekly Payout
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Recipient: <strong className="text-slate-800">{payoutTargetContributor.name}</strong> ({payoutTargetContributor.email})
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4 text-xs">
                    {/* Payment destination display */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <span className="font-semibold text-slate-700 uppercase tracking-wider block text-[10px]">
                        Payment Destination ({payoutTargetContributor.preferred_payout_method === "bank" ? "Direct Bank" : "UPI"})
                      </span>
                      {payoutTargetContributor.preferred_payout_method === "bank" && payoutTargetContributor.bank_account ? (
                        <div className="space-y-1 font-mono text-slate-900">
                          <div>Bank: <strong>{payoutTargetContributor.bank_name || "Bank"}</strong></div>
                          <div className="flex items-center gap-2">
                            <span>A/C: <strong>{payoutTargetContributor.bank_account}</strong></span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(payoutTargetContributor.bank_account, "Account Number")}
                              className="text-primary hover:underline text-[10px] inline-flex items-center gap-0.5"
                            >
                              <Copy className="h-3 w-3" /> Copy
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>IFSC: <strong>{payoutTargetContributor.bank_ifsc}</strong></span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(payoutTargetContributor.bank_ifsc, "IFSC Code")}
                              className="text-primary hover:underline text-[10px] inline-flex items-center gap-0.5"
                            >
                              <Copy className="h-3 w-3" /> Copy
                            </button>
                          </div>
                          <div>Holder: <strong>{payoutTargetContributor.account_holder_name}</strong></div>
                        </div>
                      ) : payoutTargetContributor.upi_id ? (
                        <div className="flex items-center justify-between font-mono font-bold text-slate-900 bg-white p-2 rounded border border-slate-200">
                          <span>{payoutTargetContributor.upi_id}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(payoutTargetContributor.upi_id, "UPI ID")}
                            className="text-primary hover:underline text-[10px] inline-flex items-center gap-0.5"
                          >
                            <Copy className="h-3 w-3" /> Copy UPI
                          </button>
                        </div>
                      ) : (
                        <p className="text-rose-600 font-semibold">No payout credentials configured by contributor.</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase text-[11px]">Payout Amount (₹) *</label>
                      <Input
                        type="number"
                        value={payoutAmountInput}
                        onChange={(e) => setPayoutAmountInput(Number(e.target.value))}
                        min={1}
                        className="text-sm font-bold bg-white"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Current unpaid balance: ₹{Math.round(payoutTargetContributor.unpaid_balance).toLocaleString("en-IN")}.
                      </p>
                    </div>

                    {/* UTR / Transaction Ref */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase text-[11px]">
                        Bank / UPI Transaction UTR Reference *
                      </label>
                      <Input
                        placeholder="e.g. 40921820491 or IMPS202611039"
                        value={payoutUtrInput}
                        onChange={(e) => setPayoutUtrInput(e.target.value)}
                        className="font-mono text-xs bg-white uppercase"
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Enter the transaction UTR number generated by your bank / UPI app after sending the money. This will be posted to the contributor's passbook.
                      </p>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase text-[11px]">Internal Notes / Label</label>
                      <Input
                        placeholder="e.g. Weekly settlement - Nov 3"
                        value={payoutNotesInput}
                        onChange={(e) => setPayoutNotesInput(e.target.value)}
                        className="text-xs bg-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPayoutModalOpen(false);
                          setPayoutTargetContributor(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleProcessPayout}
                        disabled={processingPayout}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5"
                      >
                        {processingPayout ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Confirm & Record Payout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : activeTab === "blogs" ? (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Blog Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-5">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Blog Post Manager</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage articles and guides for ScholarBuild.</p>
              </div>
              <Button onClick={() => { resetBlogForm(); setIsBlogModalOpen(true); }} className="bg-gradient-primary shadow-elegant font-semibold">
                <Plus className="h-4 w-4 mr-1.5" /> New Blog
              </Button>
            </div>

            {/* Blogs List in 3 column grid */}
            {loadingBlogs ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-white">
                No blog posts found. Click "New Blog" above to write your first article.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((b) => (
                  <Card key={b.id} className="overflow-hidden bg-white shadow hover:shadow-elegant transition-all flex flex-col border border-slate-200">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={b.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Badge variant="secondary">{b.category || "General"}</Badge>
                        <h3 className="font-bold text-lg leading-snug line-clamp-2">{b.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {b.content.replace(/[#*`]/g, "")}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => editBlog(b)}>
                          <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteBlog(b.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Modal Overlay for Add/Edit Blog */}
            {isBlogModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
                <Card className="w-full max-w-6xl bg-white border border-slate-200 text-slate-900 shadow-2xl relative h-[90vh] max-h-[90vh] flex flex-col">
                  <button onClick={() => { setIsBlogModalOpen(false); resetBlogForm(); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
                    <X className="h-5 w-5" />
                  </button>
                  <CardHeader className="border-b">
                    <CardTitle className="text-2xl font-bold">
                      {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                    </CardTitle>
                    <CardDescription>
                      Write your blog using the formatting toolbar and rich WYSIWYG content editor below.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="overflow-y-auto p-6 flex-1">
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase">Title *</label>
                          <Input
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            placeholder="e.g. 10 Tips for Your Presentation"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase">URL Slug *</label>
                          <Input
                            value={blogForm.slug}
                            onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                            placeholder="e.g. how-to-pass-viva"
                            required
                          />
                        </div>
                      </div>

                      {/* Rich WYSIWYG Content Editor */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase block">Content (Rich Text Editor) *</label>
                        
                        {/* Editor Toolbar */}
                        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 border border-b-0 rounded-t-md text-slate-700 select-none">
                          {/* Formatting */}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("bold")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Bold"
                          >
                            <Bold className="h-4 w-4 font-bold" />
                          </button>
                          
                          {/* Headings */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          {["H1", "H2", "H3", "H4"].map((h) => (
                            <button
                              key={h}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => execEditorCommand("formatBlock", h)}
                              className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded transition-colors"
                              title={`Heading ${h.slice(1)}`}
                            >
                              {h}
                            </button>
                          ))}
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("formatBlock", "P")}
                            className="px-2 py-1 text-xs hover:bg-slate-200 rounded transition-colors"
                            title="Normal Text (Paragraph)"
                          >
                            P
                          </button>

                          {/* Font Family selector */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <select
                            onMouseDown={(e) => {
                              // Save current selection before click drops it
                              saveSelection();
                            }}
                            onChange={(e) => execEditorCommand("fontName", e.target.value)}
                            className="text-xs border rounded bg-white p-1"
                            title="Font Family"
                            defaultValue="sans-serif"
                          >
                            <option value="system-ui, sans-serif">Sans-Serif</option>
                            <option value="Georgia, serif">Serif</option>
                            <option value="Courier New, monospace">Monospace</option>
                          </select>

                          {/* Font Color */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <div className="flex items-center gap-1" title="Text Color">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Color</span>
                            <input
                              type="color"
                              onMouseDown={(e) => {
                                // Save selection range before color picker input takes focus
                                saveSelection();
                              }}
                              onChange={(e) => execEditorCommand("foreColor", e.target.value)}
                              className="w-5 h-5 border rounded cursor-pointer p-0"
                            />
                          </div>

                          {/* Hyperlink */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              // Save range before showing prompt
                              saveSelection();
                              e.preventDefault();
                            }}
                            onClick={() => {
                              const url = prompt("Enter hyperlink URL (e.g. https://google.com):");
                              if (url) execEditorCommand("createLink", url);
                            }}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Insert Link"
                          >
                            <Link2 className="h-4 w-4" />
                          </button>

                          {/* Alignments */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("justifyLeft")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Align Left"
                          >
                            <AlignLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("justifyCenter")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Align Center"
                          >
                            <AlignCenter className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("justifyRight")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Align Right"
                          >
                            <AlignRight className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("justifyFull")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Justify Align"
                          >
                            <AlignJustify className="h-4 w-4" />
                          </button>

                          {/* Lists */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("insertUnorderedList")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Unordered Bullet List"
                          >
                            <List className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => execEditorCommand("insertOrderedList")}
                            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                            title="Ordered Numbered List"
                          >
                            <ListOrdered className="h-4 w-4" />
                          </button>
                          
                          {/* Image upload inside editor */}
                          <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                          <label 
                            className="p-1.5 hover:bg-slate-200 rounded cursor-pointer inline-flex items-center" 
                            title="Embed Image Inline"
                            onMouseDown={(e) => {
                              saveSelection();
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleEditorImageUpload}
                            />
                          </label>
                        </div>
                        
                        {/* Content Editable Area */}
                        <div
                          ref={editorRef}
                          contentEditable
                          onInput={(e) => {
                            const html = e.currentTarget.innerHTML;
                            setBlogForm((prev) => ({ ...prev, content: html }));
                          }}
                          onKeyUp={saveSelection}
                          onMouseUp={saveSelection}
                          onFocus={() => {
                            try {
                              document.execCommand("defaultParagraphSeparator", false, "p");
                            } catch (e) {}
                          }}
                          placeholder="Write your article paragraphs here... You can align text, color elements, insert bullet lists, and upload images inline."
                          className="block min-h-[300px] w-full rounded-b-md border border-input bg-white px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring overflow-y-auto prose dark:prose-invert max-w-none"
                          style={{ fontFamily: 'system-ui, sans-serif' }}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Thumbnail upload */}
                        <div className="space-y-2 border p-4 rounded-lg bg-slate-50/50">
                          <label className="text-xs font-bold text-slate-700 uppercase block">Thumbnail Image</label>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Input
                                value={blogForm.thumbnail}
                                onChange={(e) => setBlogForm({ ...blogForm, thumbnail: e.target.value })}
                                placeholder="Image URL or upload below..."
                                className="bg-white mb-2 text-xs"
                              />
                              <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-white hover:bg-slate-50 h-8 px-3 transition-colors gap-1.5">
                                <Upload className="h-3.5 w-3.5 text-slate-500" />
                                {uploadingBlogThumb ? "Uploading..." : "Upload File"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleBlogThumbUpload}
                                  disabled={uploadingBlogThumb}
                                />
                              </label>
                            </div>
                            {blogForm.thumbnail && (
                              <div className="h-12 w-20 rounded border overflow-hidden shrink-0 bg-slate-100">
                                <img src={blogForm.thumbnail} className="w-full h-full object-cover" alt="" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Blog Category selection */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 uppercase block">Category *</label>
                          {isCustomBlogCategorySelected ? (
                            <div className="flex gap-2">
                              <Input
                                value={customBlogCategory}
                                onChange={(e) => setCustomBlogCategory(e.target.value)}
                                placeholder="New category name..."
                                className="flex-1 bg-white"
                              />
                              <Button 
                                type="button" 
                                size="sm"
                                onClick={() => {
                                  if (!customBlogCategory.trim()) {
                                    toast.error("Please enter a category name");
                                    return;
                                  }
                                  const cleaned = customBlogCategory.trim();
                                  if (!blogCategories.includes(cleaned)) {
                                    setBlogCategories([...blogCategories, cleaned]);
                                  }
                                  setBlogForm((prev) => ({ ...prev, category: cleaned }));
                                  setIsCustomBlogCategorySelected(false);
                                  toast.success(`Category "${cleaned}" created and selected!`);
                                }}
                                className="bg-primary hover:opacity-95 font-semibold shrink-0"
                              >
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsCustomBlogCategorySelected(false);
                                  setCustomBlogCategory("");
                                }}
                                className="shrink-0"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <select
                              value={blogForm.category}
                              onChange={(e) => {
                                if (e.target.value === "new") {
                                  setIsCustomBlogCategorySelected(true);
                                  setCustomBlogCategory("");
                                } else {
                                  setBlogForm((prev) => ({ ...prev, category: e.target.value }));
                                }
                              }}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white"
                            >
                              <option value="">Select category...</option>
                              {blogCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="new">+ Create New Category</option>
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" className="border-slate-200" onClick={() => { setIsBlogModalOpen(false); resetBlogForm(); }}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                          {editingBlog ? "Save Changes" : "Publish Blog"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : activeTab === "users" ? (
          /* Users Tab content */
          (() => {
            // Compute projects sold stats
            const totalProjectsSold = sales.length;
            const salesByMonth: { [key: string]: any[] } = {};
            const salesByDate: { [key: string]: any[] } = {};

            sales.forEach(sale => {
              if (!sale || !sale.created_at) return;
              const dateObj = new Date(sale.created_at);
              if (isNaN(dateObj.getTime())) return;
              
              // Month grouping
              const monthKey = dateObj.toLocaleString("en-US", { month: "long", year: "numeric" });
              if (!salesByMonth[monthKey]) salesByMonth[monthKey] = [];
              salesByMonth[monthKey].push(sale);

              // Date grouping
              const dateKey = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              if (!salesByDate[dateKey]) salesByDate[dateKey] = [];
              salesByDate[dateKey].push(sale);
            });

            return (
              <div className="space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="border-b pb-5">
                  <h1 className="text-3xl font-extrabold tracking-tight">Registered Users Manager</h1>
                  <p className="text-muted-foreground text-sm mt-1">View student accounts, subscription plans, and AI token balances.</p>
                </div>

                {/* Error or Warning banner for Service Role Key */}
                {usersError && (
                  <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 space-y-4">
                    <div className="flex gap-3">
                      <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300">SUPABASE_SERVICE_ROLE_KEY Required</h3>
                        <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                          {usersError}
                        </p>
                        <div className="text-xs text-amber-700/90 dark:text-amber-400/90 pt-2 space-y-1">
                          <p><strong>To find your service role key:</strong></p>
                          <ol className="list-decimal pl-4 space-y-0.5">
                            <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-900">Supabase Project Console</a></li>
                            <li>Click on <strong>Project Settings</strong> (gear icon at bottom left)</li>
                            <li>Select <strong>API</strong> settings in the submenu</li>
                            <li>Scroll down to the <strong>Project API Keys</strong> section and copy the key labeled <code>service_role</code> / <code>secret</code> (starts with <code>eyJ...</code>)</li>
                            <li>Open your project's local <strong><code>.env</code></strong> file and paste it: <br />
                              <code>SUPABASE_SERVICE_ROLE_KEY="your-copied-service-role-key"</code>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {!usersError && (
                  <>
                    {/* Metric Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="bg-white border shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
                            <h3 className="text-2xl font-extrabold mt-1">{users.length}</h3>
                          </div>
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium Accounts</p>
                            <h3 className="text-2xl font-extrabold mt-1">
                              {users.filter((u) => u.plan === "premium").length}
                            </h3>
                          </div>
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg dark:bg-amber-900/20 dark:text-amber-400">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Tokens</p>
                            <h3 className="text-2xl font-extrabold mt-1">
                              {users.reduce((acc, u) => acc + (u.tokens || 0), 0)}
                            </h3>
                          </div>
                          <div className="p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                            <Check className="h-6 w-6" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className="bg-white border shadow-sm cursor-pointer hover:border-primary/50 transition-all group"
                        onClick={() => setIsSalesModalOpen(true)}
                      >
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-primary transition-colors flex items-center gap-1.5">
                              Projects Sold
                              <span className="text-[10px] text-slate-400 font-normal normal-case">(Click to view)</span>
                            </p>
                            <h3 className="text-2xl font-extrabold mt-1">
                              {loadingSales ? (
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                              ) : (
                                totalProjectsSold
                              )}
                            </h3>
                          </div>
                          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
                            <Tag className="h-6 w-6" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sales breakdown modal */}
                    {isSalesModalOpen && (
                      <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsSalesModalOpen(false)}
                      >
                        <div 
                          className="bg-white border rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Modal Header */}
                          <div className="p-6 border-b flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">Projects Sales Statistics</h3>
                              <p className="text-xs text-slate-500">Detailed breakdown of sales transactions by month and date.</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setIsSalesModalOpen(false)}
                              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="p-6 overflow-y-auto space-y-6">
                            {sales.length === 0 ? (
                              <div className="py-8 text-center text-slate-500">No project sales recorded yet.</div>
                            ) : (
                              <>
                                {/* Month-wise list */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    📅 Month-Wise Sales
                                  </h4>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {Object.entries(salesByMonth).map(([month, items]) => {
                                      const totalRevenue = items.reduce((acc, x) => acc + parseFloat(x.amount || 0), 0);
                                      return (
                                        <div key={month} className="p-3 bg-slate-50 border rounded-lg flex items-center justify-between">
                                          <div>
                                            <div className="text-sm font-semibold text-slate-800">{month}</div>
                                            <div className="text-xs text-slate-400">{items.length} projects sold</div>
                                          </div>
                                          <Badge className="bg-purple-100 hover:bg-purple-100 text-purple-700 border-0 font-bold">
                                            ₹{totalRevenue}
                                          </Badge>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Date-wise list */}
                                <div className="space-y-3 pt-2">
                                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    📈 Date-Wise Sales History
                                  </h4>
                                  <div className="border rounded-lg overflow-hidden bg-white max-h-64 overflow-y-auto shadow-sm">
                                    <table className="w-full text-left text-xs">
                                      <thead className="bg-slate-50 border-b text-slate-500 font-semibold uppercase tracking-wider">
                                        <tr>
                                          <th className="p-3">Date</th>
                                          <th className="p-3">Project Title / Invoice</th>
                                          <th className="p-3 text-right">Price Paid</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y text-slate-700">
                                        {sales.map((sale) => {
                                          if (!sale) return null;
                                          const cleanName = (sale.item_name || "").replace(/^Library:\s*/, "");
                                          let formattedDate = "Invalid Date";
                                          if (sale.created_at) {
                                            const dateObj = new Date(sale.created_at);
                                            if (!isNaN(dateObj.getTime())) {
                                              formattedDate = dateObj.toLocaleDateString("en-US", { 
                                                month: "short", 
                                                day: "numeric", 
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                              });
                                            }
                                          }
                                          return (
                                            <tr key={sale.id} className="hover:bg-slate-50/50">
                                              <td className="p-3 font-medium">{formattedDate}</td>
                                              <td className="p-3">
                                                <div className="font-semibold text-slate-800 truncate max-w-sm" title={cleanName}>
                                                  {cleanName}
                                                </div>
                                                <div className="text-[10px] text-slate-400">{sale.invoice_no || "N/A"}</div>
                                              </td>
                                              <td className="p-3 text-right font-bold text-slate-900">₹{sale.amount ?? 0}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Modal Footer */}
                          <div className="p-4 border-t bg-slate-50/50 flex justify-end">
                            <Button onClick={() => setIsSalesModalOpen(false)} className="border-slate-200 font-semibold text-xs" variant="outline">
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Filter and Table Card */}
                    <Card className="bg-white border shadow-sm overflow-hidden">
                      <CardHeader className="p-5 border-b bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <CardTitle className="text-base font-bold">User Registrations List</CardTitle>
                            <CardDescription className="text-xs">Select and view user stats and account levels.</CardDescription>
                          </div>
                          <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={usersSearch}
                            onChange={(e) => setUsersSearch(e.target.value)}
                            className="max-w-xs h-9 bg-white"
                          />
                        </div>
                      </CardHeader>

                  <CardContent className="p-0 overflow-x-auto">
                    {loadingUsers ? (
                      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        Fetching database profiles...
                      </div>
                    ) : users.length === 0 ? (
                      <div className="py-20 text-center text-muted-foreground">
                        No registered users found.
                      </div>
                    ) : (
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b bg-slate-50/30 text-slate-500 font-semibold text-left">
                            <th className="px-6 py-3">Student Name</th>
                            <th className="px-6 py-3">Email Address</th>
                            <th className="px-6 py-3">Pricing Plan</th>
                            <th className="px-6 py-3 text-center">Tokens Balance</th>
                            <th className="px-6 py-3 text-right">Joined Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users
                            .filter((u) => {
                              const search = usersSearch.toLowerCase();
                              return (
                                (u.full_name || "").toLowerCase().includes(search) ||
                                (u.email || "").toLowerCase().includes(search)
                              );
                            })
                            .map((u) => (
                              <tr key={u.id} className="border-b hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                                  {u.full_name || "Anonymous Student"}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                                  {u.email || "(no email)"}
                                </td>
                                <td className="px-6 py-4">
                                  {u.plan === "premium" ? (
                                    <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold text-[10px] uppercase dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900">
                                      premium
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="font-bold text-[10px] uppercase">
                                      free
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                                  {u.tokens ?? 50} tokens
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500">
                                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : "(none)"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
            );
          })()
        ) : activeTab === "coupons" ? (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="border-b pb-5 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Marketing Coupons Manager</h1>
                <p className="text-muted-foreground text-sm mt-1">Create, view, and disable discount codes for library projects and token packages.</p>
              </div>
              <Button onClick={loadCoupons} variant="outline" size="sm" className="border-slate-200">
                Refresh Coupons
              </Button>
            </div>

            {/* If coupons table doesn't exist, show database migration instructions */}
            {couponsTableMissing ? (
              <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 space-y-4">
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300">Supabase Table Migration Required</h3>
                    <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                      To start offering discounts, you must create a <code>coupons</code> table in your database. 
                      Copy and execute the SQL query below in your Supabase SQL Editor:
                    </p>

                    <pre className="bg-slate-900 text-slate-100 p-4 rounded text-[11px] overflow-x-auto font-mono max-w-full select-all">
{`CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'amount')),
  discount_value numeric NOT NULL,
  active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow select access for users to verify coupons
CREATE POLICY "Allow select for authenticated users" ON public.coupons
  FOR SELECT TO authenticated USING (true);

-- Allow write access to all authenticated users (to insert/delete coupons)
DROP POLICY IF EXISTS "Allow admin write access to coupons" ON public.coupons;
CREATE POLICY "Allow write access to authenticated users" ON public.coupons
  FOR ALL TO authenticated USING (true);`}
                    </pre>

                    <Button onClick={loadCoupons} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-8 mt-2">
                      I have executed this, click to retry loading
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 items-start">
                {/* Coupon Creator */}
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Create New Coupon</CardTitle>
                    <CardDescription className="text-xs">Create custom discount codes for checkouts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCoupon} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Coupon Code *</label>
                        <Input
                          type="text"
                          placeholder="e.g. WELCOME50, DIS200"
                          value={couponForm.code}
                          onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                          required
                          className="bg-white uppercase text-slate-900 border-slate-200"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Discount Type *</label>
                        <select
                          value={couponForm.discount_type}
                          onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value as any })}
                          className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white text-slate-900 border-slate-200"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="amount">Fixed Amount (₹)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Discount Value *</label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={couponForm.discount_type === "percentage" ? "e.g. 10 (for 10%)" : "e.g. 100 (for ₹100)"}
                          value={couponForm.discount_value}
                          onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                          required
                          className="bg-white text-slate-900 border-slate-200"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          id="coupon-active"
                          type="checkbox"
                          checked={couponForm.active}
                          onChange={(e) => setCouponForm({ ...couponForm, active: e.target.checked })}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="coupon-active" className="text-xs font-bold text-slate-700 select-none">
                          Mark as Active & Usable
                        </label>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-primary font-semibold mt-4">
                        <Plus className="h-4 w-4 mr-1.5" /> Create Coupon
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Coupon List */}
                <Card className="bg-white border shadow-sm md:col-span-2 overflow-hidden">
                  <CardHeader className="p-5 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Active Promo Codes</CardTitle>
                    <CardDescription className="text-xs">Manage active and inactive coupons.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    {loadingCoupons ? (
                      <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        Loading database coupons...
                      </div>
                    ) : coupons.length === 0 ? (
                      <div className="py-16 text-center text-muted-foreground text-xs">
                        No coupons created yet. Create one on the left!
                      </div>
                    ) : (
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b bg-slate-50/30 text-slate-500 font-semibold text-left">
                            <th className="px-5 py-3 text-xs">Promo Code</th>
                            <th className="px-5 py-3 text-xs">Discount Value</th>
                            <th className="px-5 py-3 text-xs">Status</th>
                            <th className="px-5 py-3 text-xs">Created At</th>
                            <th className="px-5 py-3 text-xs text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coupons.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-3 font-mono font-bold text-slate-800 text-xs uppercase">
                                {c.code}
                              </td>
                              <td className="px-5 py-3 font-semibold text-slate-700 text-xs">
                                {c.discount_type === "percentage" ? (
                                  <span className="text-blue-600 font-bold">{c.discount_value}% Off</span>
                                ) : (
                                  <span className="text-green-600 font-bold">₹{c.discount_value} Off</span>
                                )}
                              </td>
                              <td className="px-5 py-3">
                                {c.active ? (
                                  <Badge className="bg-green-100 text-green-800 border border-green-200 hover:bg-green-100 font-bold text-[9px] uppercase">
                                    active
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="font-bold text-[9px] uppercase">
                                    inactive
                                  </Badge>
                                )}
                              </td>
                              <td className="px-5 py-3 text-slate-500 text-xs">
                                {new Date(c.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCoupon(c.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete Coupon"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : activeTab === "queries" ? (
          <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="border-b pb-5 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Contact Queries</h1>
                <p className="text-muted-foreground text-sm mt-1">View queries submitted by students via the Contact Us form.</p>
              </div>
              <Button onClick={loadQueries} variant="outline" size="sm" className="border-slate-200">
                Refresh Queries
              </Button>
            </div>

            {/* If contact_queries table doesn't exist, show database migration instructions */}
            {queriesTableMissing ? (
              <Card className="p-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 space-y-4">
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300">Supabase Table Migration Required</h3>
                    <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                      To start managing client queries, you must create a <code>contact_queries</code> table in your database. 
                      Copy and execute the SQL query below in your Supabase SQL Editor:
                    </p>

                    <pre className="bg-slate-900 text-slate-100 p-4 rounded text-[11px] overflow-x-auto font-mono max-w-full select-all">
{`CREATE TABLE IF NOT EXISTS public.contact_queries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Grant permissions
GRANT ALL ON public.contact_queries TO anon, authenticated, service_role;

-- Enable Row Level Security
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- Allow insert access for everyone
CREATE POLICY "Allow insert for everyone" ON public.contact_queries
  FOR INSERT TO public WITH CHECK (true);

-- Allow full access for service_role and authenticated users
CREATE POLICY "Allow service_role full access" ON public.contact_queries
  FOR ALL TO service_role USING (true);

CREATE POLICY "Allow read access to authenticated users" ON public.contact_queries
  FOR SELECT TO authenticated USING (true);`}
                    </pre>

                    <Button onClick={loadQueries} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-8 mt-2">
                      I have executed this, click to retry loading
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="border bg-white shadow-sm overflow-hidden">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Queries Received ({queries.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingQueries ? (
                    <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" /> Loading queries...
                    </div>
                  ) : queries.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                      No customer queries found. Create queries using the public form!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-5 py-3">Student Name</th>
                            <th className="px-5 py-3">Email Address</th>
                            <th className="px-5 py-3">Phone Number</th>
                            <th className="px-5 py-3">Comment / Query</th>
                            <th className="px-5 py-3">Date Submitted</th>
                            <th className="px-5 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {queries.map((q) => (
                            <tr key={q.id} className="hover:bg-slate-50/50 transition-colors align-top">
                              <td className="px-5 py-3 font-semibold text-slate-800 text-xs">
                                {q.name}
                              </td>
                              <td className="px-5 py-3 text-xs">
                                <a href={`mailto:${q.email}`} className="text-primary hover:underline font-medium">{q.email}</a>
                              </td>
                              <td className="px-5 py-3 text-xs text-slate-700 font-mono">
                                {q.phone || "(none)"}
                              </td>
                              <td className="px-5 py-3 text-xs text-slate-700 max-w-sm whitespace-pre-wrap leading-relaxed">
                                {q.message}
                              </td>
                              <td className="px-5 py-3 text-slate-500 text-xs font-mono">
                                {new Date(q.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteQuery(q.id)}
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete Query"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
