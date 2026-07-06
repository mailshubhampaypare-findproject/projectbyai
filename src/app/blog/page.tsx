"use client";

import Link from "next/link";
import styles from "./blog.module.css";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  emoji: string;
  readTime: string;
}

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "crack-viva",
    title: "How to Crack Your College Viva Examination",
    excerpt: "Preparing for a project viva can be stressful. Learn the 5 most common questions examiners ask and how to answer them confidently without stuttering.",
    date: "July 02, 2026",
    author: "ProjectByAI Team",
    category: "Viva Preparation",
    emoji: "🎓",
    readTime: "5 min read",
  },
  {
    slug: "resume-projects",
    title: "Top 5 Resume Projects Recruiters Love in 2026",
    excerpt: "Standard calculators and generic to-do lists don't get you hired. Here are the 5 unique, real-world project concepts that stand out to modern engineering managers.",
    date: "June 28, 2026",
    author: "Career Coach",
    category: "Career Advice",
    emoji: "📈",
    readTime: "7 min read",
  },
  {
    slug: "nextjs-vs-vite",
    title: "Next.js vs. Vite React: Choosing for College Submissions",
    excerpt: "Should you build your frontend project with Vite or Next.js? We break down the build speed, setup complexity, and evaluation criteria that college professors look for.",
    date: "June 20, 2026",
    author: "Fullstack Dev",
    category: "Tech Comparisons",
    emoji: "⚡",
    readTime: "4 min read",
  },
];

export default function BlogList() {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <h1 className={styles.title}>ProjectByAI Blog</h1>
        <p className={styles.subtitle}>
          Guides, tips, and strategies for coding, documenting, and presenting your academic engineering projects successfully.
        </p>
      </div>

      <div className={styles.grid}>
        {MOCK_BLOG_POSTS.map((post) => (
          <article key={post.slug} className={styles.articleCard}>
            <div className={styles.imageArea}>
              <span>{post.emoji}</span>
            </div>

            <div className={styles.content}>
              <div className={styles.meta}>
                <span>{post.category}</span> &bull; <span>{post.date}</span> &bull; <span>{post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className={styles.articleTitle}>{post.title}</h2>
              </Link>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                Read Article &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
