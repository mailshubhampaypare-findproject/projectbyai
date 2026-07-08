"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard workspace and admin pages
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/portal-secret-admin");

  if (isDashboard || isAdmin) {
    return null;
  }

  return (
    <footer className={styles.footerContainer}>
      <div className={`${styles.footer} container`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            Project<span className={styles.logoBlue}>ByAI</span>
          </div>
          <p className={styles.tagline}>
            AI-driven workspace for college students to build, understand, and deliver final-year and resume-boosting projects effortlessly.
          </p>
        </div>

        <div className={styles.linksGroup}>
          <div className={styles.column}>
            <span className={styles.title}>Services</span>
            <Link href="/dashboard" className={styles.link}>AI Generator</Link>
            <Link href="/store" className={styles.link}>Prebuilt Store</Link>
          </div>
          
          <div className={styles.column}>
            <span className={styles.title}>Resources</span>
            <Link href="/blog" className={styles.link}>Blog Articles</Link>
            <Link href="/faq" className={styles.link}>FAQ</Link>
          </div>

          <div className={styles.column}>
            <span className={styles.title}>Legal</span>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms-and-condition" className={styles.link}>Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className={`${styles.bottom} container`}>
        <p>&copy; {new Date().getFullYear()} ProjectByAI. All rights reserved.</p>
        <p>Built for students, by AI.</p>
      </div>
    </footer>
  );
}
