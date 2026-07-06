"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_BLOG_POSTS } from "../page";
import styles from "../blog.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostReader({ params }: PageProps) {
  const { slug } = use(params);

  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container" style={{ padding: "64px 24px", textAlign: "center" }}>
        <h2>Article Not Found</h2>
        <p style={{ margin: "16px 0 24px 0", color: "var(--text-secondary)" }}>
          The article you are looking for does not exist.
        </p>
        <Link href="/blog" className="btn btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.container} container`}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
        &larr; Back to Blog
      </Link>

      <article>
        <header className={styles.postHeader}>
          <div className={styles.postMeta}>
            <span>{post.category}</span>
            <span>&bull;</span>
            <span>By {post.author}</span>
            <span>&bull;</span>
            <span>{post.date}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
        </header>

        <div className={styles.coverImage}>
          <span>{post.emoji}</span>
        </div>

        <div className={styles.postBody}>
          <p>
            When it comes to presenting a college project, especially in engineering, computer science, or information technology courses, many students focus solely on the code. While having a functional app is critical, it accounts for only a fraction of the final grade.
          </p>

          <blockquote>
            "An examiner doesn't just want to see that your code runs. They want to prove that YOU wrote it and that you understand the underlying concepts."
          </blockquote>

          <h2>1. Understand the Setup and Architecture First</h2>
          <p>
            Before walking into your evaluation, make sure you can spin up the project locally in less than 2 minutes. Know exactly which commands download dependencies (like <code>npm install</code> or <code>pip install</code>), which files hold configuration parameters (like <code>.env</code>), and how to connect to the database.
          </p>
          <p>
            If your application fails to compile or run during the demo, it leaves a very poor impression. Practice running your project on a clean directory or a friend's laptop to ensure there are no cached local variables making it run.
          </p>

          <h2>2. Master the Core Concept & Tech Choice</h2>
          <p>
            Examiners will almost always ask: <strong>"Why did you choose React/Node/Python for this instead of PHP/Java?"</strong>
          </p>
          <p>
            Be ready with structural justifications:
          </p>
          <ul>
            <li>Choose <strong>React</strong> for component reusability, quick DOM updates, and rich state management.</li>
            <li>Choose <strong>Next.js</strong> for server-side rendering, SEO readiness, and API routes encapsulation.</li>
            <li>Choose <strong>Supabase</strong> for quick relational table design, automated row-level security, and out-of-the-box user auth.</li>
          </ul>

          <h2>3. Document Everything Accurately</h2>
          <p>
            A high-quality documentation PDF containing UML diagrams, data models, entity-relationship structures, and screenshots will make your project stand out. Ensure your documentation is well-organized, readable, and matches the implemented features of your app exactly.
          </p>
        </div>
      </article>
    </div>
  );
}
