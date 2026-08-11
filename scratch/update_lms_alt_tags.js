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
  const thumbUrl = "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/thumbnails/95cwlyk0s4u_1783197346186.avif";
  const thumbnailWithAlt = `${thumbUrl}||Library Management System Project in Java and MySQL`;

  const screenshots = [
    "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/screenshots/c0loqjn20ij_1783366263052.png||Library Management System Admin Login Screen",
    "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/screenshots/vawdwzl02bo_1783366263761.png||Library Management System Dashboard and Overview",
    "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/screenshots/ud1dm35zl2_1783366264121.png||Manage Books Panel in Library Management System",
    "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/screenshots/vvo4l54p02_1783366264580.png||Add Books Form in Library Management System",
    "https://icfzsirmxzgltzjvsdis.supabase.co/storage/v1/object/public/uploads/screenshots/pkk333fr2er_1783366264906.png||Staff Details Management in Library Management System"
  ];

  const { data, error } = await supabase
    .from("library_projects")
    .update({
      thumbnail: thumbnailWithAlt,
      screenshots: screenshots
    })
    .eq("slug", "library-management-system")
    .select();

  if (error) {
    console.error("Error updating alt tags:", error);
  } else {
    console.log("Successfully updated thumbnail and screenshot alt tags in database!");
    console.log(data);
  }
}
run();
