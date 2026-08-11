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
  const combinedFaqs = [
    {
      question: "What is library management system?",
      answer: "A library management system is a software application designed to manage the core functions of a library. It helps administrators track book inventories, manage student or staff records, and handle the issuing and returning of books efficiently through a digital interface."
    },
    {
      question: "What is this Library Management System project about?",
      answer: "This is a Java-based Library Management System developed using NetBeans IDE with MySQL as the backend database. It allows an admin to manage books and staff through a secure login system."
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
    },
    {
      question: "Can I use this as my college mini or final year project?",
      answer: "Absolutely. This project is suitable for: -BCA / MCA students -B.Tech / BE students -Diploma students -It can be submitted as a mini project or academic project."
    },
    {
      question: "Is the project suitable for beginners?",
      answer: "Yes. This project is beginner-friendly and ideal for students who are learning Java, MySQL, and database connectivity (JDBC)."
    },
    {
      question: "Does the project include a login system?",
      answer: "Yes. It includes a secure Admin Login Page that verifies credentials using the MySQL Admin table."
    },
    {
      question: "Does this project support CRUD operations?",
      answer: "Yes. The project performs complete CRUD operations (Create, Read, Update, Delete) using JDBC and MySQL."
    },
    {
      question: "Do I need prior experience in MySQL?",
      answer: "Basic knowledge of MySQL is helpful, but even beginners can understand and run the project with the provided structure."
    },
    {
      question: "Can I modify and customize the project?",
      answer: "Yes. You can modify the UI, add new features, update database fields, or expand the system based on your requirements."
    }
  ];

  const { data, error } = await supabase
    .from("library_projects")
    .update({ faqs: combinedFaqs })
    .eq("slug", "library-management-system")
    .select();

  if (error) {
    console.error("Error updating combined FAQs:", error);
  } else {
    console.log("Successfully combined and updated FAQs in the database!");
    console.log(data);
  }
}
run();
