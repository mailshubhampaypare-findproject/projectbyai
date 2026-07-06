"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/dashboard?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
    router.push(`/dashboard?prompt=${encodeURIComponent(text)}`);
  };

  const suggestions = [
    "E-commerce React web app",
    "AI Image Generator Python script",
    "Android Task Manager App",
    "Personal Portfolio with blog section",
  ];

  return (
    <div className={`${styles.heroSection} container`}>
      <h1 className={styles.googleTitle}>
        Project<span className={styles.blueText}>ByAI</span>
      </h1>
      <p className={styles.subtitle}>
        Enter a prompt describing your dream college or resume project. AI will generate the code, documentation, PPT slides, and interview questions instantly.
      </p>

      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What type of project do you want to create?"
          className={styles.searchInput}
          required
        />
        <div className={styles.searchActions}>
          <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px" }}>
            Generate
          </button>
        </div>
      </form>

      <div className={styles.suggestions}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className={styles.suggestionTag}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💻</span>
          <h3 className={styles.featureTitle}>Full Source Code</h3>
          <p className={styles.featureDesc}>
            Fully functional code structure with standard components. View in editor and download as ZIP.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📄</span>
          <h3 className={styles.featureTitle}>Step-by-Step Docs</h3>
          <p className={styles.featureDesc}>
            Clear installation steps, technology explanation, and code guide. Ready to copy-paste.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>📊</span>
          <h3 className={styles.featureTitle}>Presentation Slides</h3>
          <p className={styles.featureDesc}>
            Formatted slides explaining project architecture, flowcharts, and deliverables for your submission.
          </p>
        </div>

        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>❓</span>
          <h3 className={styles.featureTitle}>Viva & Interview Prep</h3>
          <p className={styles.featureDesc}>
            Expected questions from examiners, conceptual answers, and tech stacks details prepared for you.
          </p>
        </div>
      </div>
    </div>
  );
}
