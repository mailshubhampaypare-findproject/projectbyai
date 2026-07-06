"use client";

import { useState } from "react";
import ProjectCard, { Project } from "@/components/ProjectCard";
import styles from "./store.module.css";

// Export mock projects so details page can import them
export const MOCK_PROJECTS: Project[] = [
  {
    id: "ecommerce-react",
    title: "E-Commerce React Platform",
    description: "A complete online shopping storefront with shopping cart, Stripe payment simulator, product catalog, search filtering, and clean responsive layout.",
    category: "Web Development",
    tags: ["React", "Vite", "CSS Modules", "Stripe"],
    price: "2.99",
    emoji: "🛒",
  },
  {
    id: "ai-image-generator",
    title: "AI Image Generator Script",
    description: "A Python/Flask backend and HTML5 frontend that connects to OpenAI's DALL-E/Gemini APIs to generate stunning images from user prompts.",
    category: "AI / ML",
    tags: ["Python", "Flask", "Gemini API", "HTML/JS"],
    price: "1.99",
    emoji: "🎨",
  },
  {
    id: "chat-app-android",
    title: "Android Realtime Chat App",
    description: "A Kotlin-based Android App utilizing Firebase Realtime Database and Firebase Authentication for private and group user chat messages.",
    category: "Mobile Apps",
    tags: ["Kotlin", "Android Studio", "Firebase", "Auth"],
    price: "4.99",
    emoji: "💬",
  },
  {
    id: "personal-portfolio",
    title: "Developer Portfolio Template",
    description: "A sleek, highly professional resume website with animated text transitions, interactive experience timeline, projects grid, and contact form.",
    category: "Web Development",
    tags: ["Next.js", "Vanilla CSS", "TypeScript", "Responsive"],
    price: "1.00",
    emoji: "📂",
  },
];

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Web Development", "AI / ML", "Mobile Apps"];

  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === "All" || project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Prebuilt Project Store</h1>
        <p className={styles.subtitle}>
          Browse high-quality, pre-written project files. Pay once to download full source code, docs, and configurations.
        </p>
      </div>

      <div className={styles.searchAndFilter}>
        <input
          type="text"
          placeholder="Search projects or tech..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.filters}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
          <p>No projects found matching your search.</p>
        </div>
      )}
    </div>
  );
}
