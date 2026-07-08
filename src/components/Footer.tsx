"use client";

import { Link, useLocation } from "@tanstack/react-router";
import styles from "./Footer.module.css";

export default function Footer() {
  const location = useLocation();
  const pathname = location.pathname;

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
            <Link to="/dashboard" className={styles.link}>AI Generator</Link>
            <Link to="/projects" className={styles.link}>Prebuilt Store</Link>
          </div>
          
          <div className={styles.column}>
            <span className={styles.title}>Resources</span>
            <Link to="/blog" className={styles.link}>Blog Articles</Link>
            <Link to="/faq" className={styles.link}>FAQ</Link>
          </div>

          <div className={styles.column}>
            <span className={styles.title}>Legal</span>
            <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link to="/terms-and-condition" className={styles.link}>Terms of Service</Link>
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
