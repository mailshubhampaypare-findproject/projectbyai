import { createClient } from "@supabase/supabase-js";
import fs from "fs";

if (fs.existsSync(".env")) {
  const content = fs.readFileSync(".env", "utf8");
  for (const line of content.split("\n")) {
    if (line.includes("=") && !line.trim().startsWith("#")) {
      const parts = line.split("=");
      const k = parts[0].trim();
      const v = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, '');
      process.env[k] = v;
    }
  }
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  // 1. Fetch current description
  const { data: currentProj, error: fetchErr } = await supabase
    .from("library_projects")
    .select("description")
    .eq("slug", "library-management-system")
    .single();

  if (fetchErr) {
    console.error("Error fetching project:", fetchErr);
    process.exit(1);
  }

  // 2. Prepare description update
  const newParagraph = "\n\nIf you are using this library management system project for your college submission, the clean code structure makes it easy to create standard documentation. Based on the provided database and Java classes, you can easily map out a use case diagram for library management system, design a comprehensive class diagram for library management system, or plot a dfd for library management system to complete your project reports.";
  
  let updatedDescription = currentProj.description;
  if (updatedDescription.endsWith("</span>")) {
    // If it has HTML wrapping, inject before the closing tag to match styling
    updatedDescription = updatedDescription.replace("</span>", `${newParagraph.replace(/\n\n/, "<br/><br/>")}</span>`);
  } else {
    updatedDescription += newParagraph;
  }

  // 3. New FAQs list
  const newFaqs = [
    {
      question: "What is library management system?",
      answer: "A library management system is a software application designed to manage the core functions of a library. It helps administrators track book inventories, manage student or staff records, and handle the issuing and returning of books efficiently through a digital interface."
    },
    {
      question: "How does a library management system work?",
      answer: "It works by connecting a user-friendly frontend interface (like Java) to a backend database (like MySQL). When an admin adds a new book or registers a staff member, the system sends that data to the database for secure storage. When a user searches for a book, the system retrieves and displays that real-time data from the database."
    },
    {
      question: "How do I run this Java project in NetBeans?",
      answer: "After downloading, extract the zip file, open NetBeans IDE, go to File > Open Project, and select the extracted folder. Detailed setup instructions are included in the download."
    },
    {
      question: "Is the MySQL database export file included?",
      answer: "Yes, the download includes the complete MySQL database structure and tables required to run the library management system locally."
    },
    {
      question: "Can I use this for my final year college project?",
      answer: "Absolutely. This project includes all essential CRUD operations, an admin login, and a clean UI, making it perfect for engineering student mini-projects or final year submissions."
    }
  ];

  // 4. Update library_projects table
  const { data: updateRes, error: updateErr } = await supabase
    .from("library_projects")
    .update({
      description: updatedDescription,
      faqs: newFaqs
    })
    .eq("slug", "library-management-system")
    .select();

  if (updateErr) {
    console.error("Error updating library_projects:", updateErr);
  } else {
    console.log("Successfully updated description and FAQs in database:");
    console.log(updateRes);
  }
}
run();
