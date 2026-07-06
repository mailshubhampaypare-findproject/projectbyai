"use client";

import Link from "next/link";
import styles from "./ProjectCard.module.css";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: string;
  emoji: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <span>{project.emoji}</span>
        <span className={styles.badge}>{project.category}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>

        <div className={styles.tags}>
          {project.tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>${project.price}</span>
          <Link href={`/store/${project.id}`} className="btn btn-secondary styles.viewBtn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
