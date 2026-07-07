import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { listRegisteredUsers } from "@/lib/projects.functions";
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
  Tag
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
  
  const [activeTab, setActiveTab] = useState<"library" | "blogs" | "users" | "coupons">("library");

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState("");
  const fetchUsers = useServerFn(listRegisteredUsers);

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
      loadCoupons();
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
      thumbnail: projectForm.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
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
    setProjectForm({
      slug: p.slug,
      title: p.title,
      description: p.description,
      long_description: p.long_description || "",
      price: p.price.toString(),
      category: p.category,
      thumbnail: p.thumbnail,
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
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
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
                          </div>
                          {projectForm.thumbnail && (
                            <div className="h-16 w-24 rounded border overflow-hidden shrink-0 bg-slate-100">
                              <img src={projectForm.thumbnail} className="w-full h-full object-cover" alt="" />
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
                          className="bg-white mb-2"
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
                          
                          {/* Screenshots preview */}
                          {projectForm.screenshots && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {projectForm.screenshots.split(",").map((s, i) => (
                                <div key={i} className="h-10 w-16 border rounded overflow-hidden shrink-0 relative group">
                                  <img src={s.trim()} className="w-full h-full object-cover" alt="" />
                                </div>
                              ))}
                            </div>
                          )}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                </div>

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
        ) : null}
      </main>
    </div>
  );
}
