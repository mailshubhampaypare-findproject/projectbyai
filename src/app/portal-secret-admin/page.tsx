"use client";

import { useState } from "react";
import styles from "./admin.module.css";

// Interface definitions
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  price: string;
  tags: string;
  description: string;
  emoji: string;
}

interface BlogItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  emoji: string;
}

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation state
  const [activeTab, setActiveTab] = useState<"projects" | "blog">("projects");
  const [viewMode, setViewMode] = useState<"list" | "new" | "edit">("list");
  
  // Selected item ID for editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Database mock state
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "ecommerce-react",
      title: "E-Commerce React Platform",
      category: "Web Development",
      price: "2.99",
      tags: "React, Vite, CSS Modules, Stripe",
      description: "A complete online shopping storefront with shopping cart, Stripe payment simulator, product catalog, search filtering, and clean responsive layout.",
      emoji: "🛒",
    },
    {
      id: "ai-image-generator",
      title: "AI Image Generator Script",
      category: "AI / ML",
      price: "1.99",
      tags: "Python, Flask, Gemini API, HTML/JS",
      description: "A Python/Flask backend and HTML5 frontend that connects to OpenAI's DALL-E/Gemini APIs to generate stunning images from user prompts.",
      emoji: "🎨",
    },
    {
      id: "chat-app-android",
      title: "Android Realtime Chat App",
      category: "Mobile Apps",
      price: "4.99",
      tags: "Kotlin, Android Studio, Firebase, Auth",
      description: "A Kotlin-based Android App utilizing Firebase Realtime Database and Firebase Authentication for private and group user chat messages.",
      emoji: "💬",
    },
    {
      id: "personal-portfolio",
      title: "Developer Portfolio Template",
      category: "Web Development",
      price: "1.00",
      tags: "Next.js, Vanilla CSS, TypeScript, Responsive",
      description: "A sleek, highly professional resume website with animated text transitions, interactive experience timeline, projects grid, and contact form.",
      emoji: "📂",
    },
  ]);

  const [blogs, setBlogs] = useState<BlogItem[]>([
    {
      slug: "crack-viva",
      title: "How to Crack Your College Viva Examination",
      category: "Viva Preparation",
      excerpt: "Preparing for a project viva can be stressful. Learn the 5 most common questions examiners ask and how to answer them confidently without stuttering.",
      content: "When it comes to presenting a college project, especially in engineering, computer science, or information technology courses, many students focus solely on the code. While having a functional app is critical, it accounts for only a fraction of the final grade...",
      emoji: "🎓",
    },
    {
      slug: "resume-projects",
      title: "Top 5 Resume Projects Recruiters Love in 2026",
      category: "Career Advice",
      excerpt: "Standard calculators and generic to-do lists don't get you hired. Here are the 5 unique, real-world project concepts that stand out to modern engineering managers.",
      content: "Standard calculators and generic to-do lists don't get you hired. Here are the 5 unique, real-world project concepts that stand out to modern engineering managers...",
      emoji: "📈",
    },
    {
      slug: "nextjs-vs-vite",
      title: "Next.js vs. Vite React: Choosing for College Submissions",
      category: "Tech Comparisons",
      excerpt: "Should you build your frontend project with Vite or Next.js? We break down the build speed, setup complexity, and evaluation criteria that college professors look for.",
      content: "Should you build your frontend project with Vite or Next.js? We break down the build speed, setup complexity, and evaluation criteria that college professors look for...",
      emoji: "⚡",
    },
  ]);

  // Form input variables
  const [successMessage, setSuccessMessage] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pCategory, setPCategory] = useState("Web Development");
  const [pPrice, setPPrice] = useState("");
  const [pTags, setPTags] = useState("");
  const [pDesc, setPDesc] = useState("");

  const [bTitle, setBTitle] = useState("");
  const [bCategory, setBCategory] = useState("Viva Preparation");
  const [bExcerpt, setBExcerpt] = useState("");
  const [bContent, setBContent] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@projectbyai.com" && password === "adminpassword123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Admin Email or Password.");
    }
  };

  // Switch to New Form
  const handleOpenNewForm = () => {
    setViewMode("new");
    setEditingId(null);
    setSuccessMessage("");
    
    // Clear forms
    setPTitle("");
    setPCategory("Web Development");
    setPPrice("");
    setPTags("");
    setPDesc("");

    setBTitle("");
    setBCategory("Viva Preparation");
    setBExcerpt("");
    setBContent("");
  };

  // Switch to Edit Form
  const handleOpenEditForm = (item: any) => {
    setViewMode("edit");
    setSuccessMessage("");

    if (activeTab === "projects") {
      setEditingId(item.id);
      setPTitle(item.title);
      setPCategory(item.category);
      setPPrice(item.price);
      setPTags(item.tags);
      setPDesc(item.description);
    } else {
      setEditingId(item.slug);
      setBTitle(item.title);
      setBCategory(item.category);
      setBExcerpt(item.excerpt);
      setBContent(item.content);
    }
  };

  // Submit Save Actions
  const handleProjectSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (viewMode === "new") {
      const newProj: ProjectItem = {
        id: pTitle.toLowerCase().replace(/\s+/g, "-"),
        title: pTitle,
        category: pCategory,
        price: pPrice,
        tags: pTags,
        description: pDesc,
        emoji: "📦",
      };
      setProjects([newProj, ...projects]);
      setSuccessMessage("🎉 Project uploaded successfully!");
    } else if (viewMode === "edit" && editingId) {
      setProjects(projects.map(p => p.id === editingId ? {
        ...p,
        title: pTitle,
        category: pCategory,
        price: pPrice,
        tags: pTags,
        description: pDesc,
      } : p));
      setSuccessMessage("🎉 Project changes saved!");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setViewMode("list");
    }, 1500);
  };

  const handleBlogSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (viewMode === "new") {
      const newBlog: BlogItem = {
        slug: bTitle.toLowerCase().replace(/\s+/g, "-"),
        title: bTitle,
        category: bCategory,
        excerpt: bExcerpt,
        content: bContent,
        emoji: "📝",
      };
      setBlogs([newBlog, ...blogs]);
      setSuccessMessage("🎉 Blog article published successfully!");
    } else if (viewMode === "edit" && editingId) {
      setBlogs(blogs.map(b => b.slug === editingId ? {
        ...b,
        title: bTitle,
        category: bCategory,
        excerpt: bExcerpt,
        content: bContent,
      } : b));
      setSuccessMessage("🎉 Blog post changes saved!");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setViewMode("list");
    }, 1500);
  };

  // Delete Actions
  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleDeleteBlog = (slug: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(blogs.filter(b => b.slug !== slug));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.cardTitle}>Secret Admin Login</h1>
          <p className={styles.cardSubtitle}>
            Authorized access only. Enter your credentials to manage ProjectByAI marketplace and articles.
          </p>

          {loginError && (
            <div style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginBottom: "16px", textAlign: "center" }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Admin Email</label>
              <input
                type="email"
                placeholder="admin@projectbyai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }}>
              Sign In to Portal
            </button>
          </form>
          
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textAlign: "center", marginTop: "24px" }}>
            🔑 Mock credentials: <code>admin@projectbyai.com</code> / <code>adminpassword123</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminWorkspace}>
      {/* Sidebar navigation */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Console</h2>
        <button
          className={`${styles.sidebarBtn} ${activeTab === "projects" ? styles.sidebarBtnActive : ""}`}
          onClick={() => {
            setActiveTab("projects");
            setViewMode("list");
          }}
        >
          🛒 Projects Marketplace
        </button>
        <button
          className={`${styles.sidebarBtn} ${activeTab === "blog" ? styles.sidebarBtnActive : ""}`}
          onClick={() => {
            setActiveTab("blog");
            setViewMode("list");
          }}
        >
          ✍️ Blog Posts
        </button>
        
        <button className={`${styles.sidebarBtn} ${styles.logoutBtn}`} onClick={() => setIsLoggedIn(false)}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Tab 1: Projects Management */}
        {activeTab === "projects" && (
          <div>
            {viewMode === "list" ? (
              <>
                <div className={styles.listHeader}>
                  <div>
                    <h1 className={styles.adminTitle}>Prebuilt Projects</h1>
                    <p className={styles.adminSubtitle}>Manage all template files uploaded to the live store.</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleOpenNewForm}>
                    ➕ New Project
                  </button>
                </div>

                <div className={styles.listContainer}>
                  {projects.map((proj) => (
                    <div key={proj.id} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemTitle}>
                          <span>{proj.emoji}</span>
                          <strong>{proj.title}</strong>
                          <span className={styles.itemBadge}>{proj.category}</span>
                        </div>
                        <div className={styles.itemMeta}>
                          Price: <strong>${proj.price}</strong> &bull; Tags: {proj.tags}
                        </div>
                      </div>

                      <div className={styles.itemActions}>
                        <button className="btn btn-secondary" onClick={() => handleOpenEditForm(proj)}>
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
                          onClick={() => handleDeleteProject(proj.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Create / Edit Project Form
              <div className={styles.formCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {viewMode === "new" ? "➕ Create Prebuilt Project" : "✏️ Edit Prebuilt Project"}
                  </h2>
                  <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => setViewMode("list")}>
                    &larr; Back to List
                  </button>
                </div>

                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <form onSubmit={handleProjectSaveSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Chat App with React & Supabase"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value)}
                        className={styles.inputField}
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="AI / ML">AI / ML</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="2.99"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className={styles.inputField}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tech Stack Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Next.js, Node.js, Stripe"
                      value={pTags}
                      onChange={(e) => setPTags(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      rows={4}
                      placeholder="A detailed description explaining what is included in the project..."
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Source ZIP (.zip)</label>
                      <input type="file" accept=".zip" className={styles.inputField} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Preview Image</label>
                      <input type="file" accept="image/*" className={styles.inputField} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>
                    {viewMode === "new" ? "Publish to Store" : "Save Changes"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Blog Management */}
        {activeTab === "blog" && (
          <div>
            {viewMode === "list" ? (
              <>
                <div className={styles.listHeader}>
                  <div>
                    <h1 className={styles.adminTitle}>Blog Posts</h1>
                    <p className={styles.adminSubtitle}>Manage articles displayed on the public blog page.</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleOpenNewForm}>
                    ➕ New Article
                  </button>
                </div>

                <div className={styles.listContainer}>
                  {blogs.map((blog) => (
                    <div key={blog.slug} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemTitle}>
                          <span>{blog.emoji}</span>
                          <strong>{blog.title}</strong>
                          <span className={styles.itemBadge}>{blog.category}</span>
                        </div>
                        <div className={styles.itemMeta}>
                          Excerpt: {blog.excerpt.slice(0, 100)}...
                        </div>
                      </div>

                      <div className={styles.itemActions}>
                        <button className="btn btn-secondary" onClick={() => handleOpenEditForm(blog)}>
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
                          onClick={() => handleDeleteBlog(blog.slug)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Create / Edit Blog Form
              <div className={styles.formCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {viewMode === "new" ? "➕ Write Blog Post" : "✏️ Edit Blog Post"}
                  </h2>
                  <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => setViewMode("list")}>
                    &larr; Back to List
                  </button>
                </div>

                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                <form onSubmit={handleBlogSaveSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. How to prepare for viva presentation"
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Category</label>
                    <select
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      className={styles.inputField}
                    >
                      <option value="Viva Preparation">Viva Preparation</option>
                      <option value="Career Advice">Career Advice</option>
                      <option value="Tech Comparisons">Tech Comparisons</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Brief Excerpt</label>
                    <textarea
                      rows={2}
                      placeholder="A short summary of the article..."
                      value={bExcerpt}
                      onChange={(e) => setBExcerpt(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Article Body (Markdown)</label>
                    <textarea
                      rows={10}
                      placeholder="Write your full markdown content here..."
                      value={bContent}
                      onChange={(e) => setBContent(e.target.value)}
                      className={styles.inputField}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>
                    {viewMode === "new" ? "Publish Post" : "Save Changes"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
