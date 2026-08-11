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
  const thumbUrl = "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/thumbnails/a9kek7gbqde_1783366753324.avif";
  const thumbnailWithAlt = `${thumbUrl}||Cursor Control with Hand Gestures Project in Python`;

  const combinedFaqs = [
    {
      question: "Is the source code included?",
      answer: "Yes. You will receive the complete source code, which you can modify, customize, and extend based on your requirements."
    },
    {
      question: "Does this project require special hardware?",
      answer: "No. You only need: A computer/laptop A working webcam Python installed."
    },
    {
      question: "Can I add this project to my resume?",
      answer: "Yes. This project demonstrates practical skills in AI, Computer Vision, automation, and real-time system development, which makes your resume stronger for internships and job roles."
    },
    {
      question: "Can I submit this as a college project?",
      answer: "Absolutely. This project is suitable for: Mini Projects Final Year Projects AI / Machine Learning Subjects Computer Vision Coursework Technical Exhibitions."
    },
    {
      question: "Is this project suitable for beginners?",
      answer: "Yes. While it includes advanced concepts like Computer Vision and gesture recognition, the code is structured and beginner-friendly for students learning Python and AI fundamentals."
    },
    {
      question: "Does this project work in real-time?",
      answer: "Yes. The project processes live webcam video frames in real-time and performs instant gesture detection with smooth cursor movement."
    },
    {
      question: "How does the system detect hand gestures?",
      answer: "The system uses MediaPipe to detect 21 hand landmarks. It tracks specific points like the index finger tip and thumb tip, calculates their distance using mathematical formulas, and triggers cursor movement or click actions based on predefined gesture logic."
    },
    {
      question: "What is a cursor control using hand gestures project?",
      answer: "It is an AI-based virtual mouse system that uses a web camera and computer vision to track hand movements. Instead of using a physical mouse, users can move the cursor, click, or scroll using specific finger gestures."
    },
    {
      question: "Which libraries are used for this Python virtual mouse?",
      answer: "This project utilizes popular Python libraries, primarily OpenCV for computer vision, MediaPipe for hand landmark detection, and PyAutoGUI or Autopy for mapping coordinates to screen controls."
    },
    {
      question: "Can I use this hand gesture recognition project for my college submission?",
      answer: "Yes! This is an excellent machine learning and computer vision mini-project for engineering students. The download includes clean source code that is easy to understand and document for your final year viva."
    },
    {
      question: "How do I run the Python source code for this project?",
      answer: "Once downloaded, extract the files, open the folder in an IDE like VS Code or PyCharm, install the required libraries via the requirements.txt file (like pip install opencv-python mediapipe), and run the main Python script."
    }
  ];

  const { data, error } = await supabase
    .from("library_projects")
    .update({
      thumbnail: thumbnailWithAlt,
      faqs: combinedFaqs
    })
    .eq("slug", "Cursor-Control-with-Hand-Gestures")
    .select();

  if (error) {
    console.error("Error updating database records:", error);
  } else {
    console.log("Successfully updated Cursor Control FAQs and thumbnail in the database!");
    console.log(data);
  }
}
run();
