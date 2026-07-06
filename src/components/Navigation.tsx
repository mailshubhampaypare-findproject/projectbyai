"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  // If we are on dashboard or admin portal, we might want a different or hidden nav.
  // For dashboard, we will render a tailored workspace navigation inside that page.
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/portal-secret-admin");

  if (isDashboard || isAdmin) {
    return null; // The workspace pages will manage their own navigation/headers
  }

  return (
    <header className={styles.navContainer}>
      <div className={`${styles.nav} container`}>
        <Link href="/" className={styles.logo}>
          <span>Project<span className={styles.logoBlue}>ByAI</span></span>
        </Link>

        <nav className={styles.links}>
          <Link
            href="/"
            className={`${styles.link} ${pathname === "/" ? styles.linkActive : ""}`}
          >
            Home
          </Link>
          <Link
            href="/store"
            className={`${styles.link} ${pathname.startsWith("/store") ? styles.linkActive : ""}`}
          >
            Prebuilt Store
          </Link>
          <Link
            href="/blog"
            className={`${styles.link} ${pathname.startsWith("/blog") ? styles.linkActive : ""}`}
          >
            Blog
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/portal-secret-admin" className={styles.adminLink}>
            Admin Panel
          </Link>
          <Link href="/dashboard" className="btn btn-secondary" style={{ padding: "8px 16px" }}>
            Login
          </Link>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: "8px 16px" }}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
