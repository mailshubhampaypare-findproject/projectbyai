"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_PROJECTS } from "../page";
import styles from "../store.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetails({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const project = MOCK_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="container" style={{ padding: "64px 24px", textAlign: "center" }}>
        <h2>Project Not Found</h2>
        <p style={{ margin: "16px 0 24px 0", color: "var(--text-secondary)" }}>
          The project you are looking for does not exist in our store.
        </p>
        <Link href="/store" className="btn btn-primary">
          Back to Store
        </Link>
      </div>
    );
  }

  const handlePurchase = () => {
    setLoading(true);
    // Simulate payment loading
    setTimeout(() => {
      setLoading(false);
      setDownloadSuccess(true);
    }, 2000);
  };

  return (
    <div className={`${styles.container} container`}>
      <Link href="/store" className={styles.backLink}>
        &larr; Back to Store
      </Link>

      <div className={styles.detailsGrid}>
        <div>
          <div className={styles.previewArea}>
            <span>{project.emoji}</span>
          </div>

          <div className={styles.mainInfo}>
            <h1>{project.title}</h1>
            <p className={styles.tagline}>{project.description}</p>
          </div>

          <h3 className={styles.sectionTitle}>What's Included in the ZIP</h3>
          <div className={styles.richText}>
            <ul>
              <li><strong>Complete Source Code:</strong> Well-structured code files, configured dependencies, clean variable declarations, and responsive CSS styling.</li>
              <li><strong>Detailed Readme / User Guide:</strong> Complete guide on setting up the environment, installing node packages or Python libraries, config variables layout, running build commands, and local hosting.</li>
              <li><strong>Project Synopsis File:</strong> Clean overview of features, database structure diagrams, system requirements list, and target users definitions suitable for college submission.</li>
              <li><strong>Interview & Viva Q&A Guide:</strong> 15 critical questions explaining the project's logic, framework choices, state managers, API handling, database schemes, and optimization secrets.</li>
            </ul>

            <h3 className={styles.sectionTitle} style={{ marginTop: "32px" }}>Technological Details</h3>
            <p>
              This project is built using professional-grade, modern standards. Ideal for college submissions, resume showcases, and learning best-practice setups. Code contains inline documentation/comments explaining key workflows.
            </p>
          </div>
        </div>

        <div>
          <div className={styles.sidebarCard}>
            <span className={styles.priceLabel}>Instant Download Price</span>
            <div className={styles.sidebarPrice}>${project.price}</div>

            {!downloadSuccess ? (
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? "Processing Secure Payment..." : "Pay & Download Project"}
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "var(--color-success)", fontWeight: 500, marginBottom: "16px" }}>
                  🎉 Payment Successful!
                </div>
                <a
                  href={`/assets/mock-projects/${project.id}-source.zip`}
                  download
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "1rem", backgroundColor: "var(--color-success)" }}
                >
                  📥 Download Source Code (.ZIP)
                </a>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "12px" }}>
                  A backup download link has also been sent to your email.
                </p>
              </div>
            )}

            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>{project.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Difficulty Level</span>
                <span className={styles.metaValue}>Intermediate</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Format</span>
                <span className={styles.metaValue}>Source ZIP (.zip)</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>License</span>
                <span className={styles.metaValue}>Personal Use Only</span>
              </div>
            </div>

            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.4 }}>
              🔒 Secured checkout. Fully refund guaranteed if the code doesn't build within 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
