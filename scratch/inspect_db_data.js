import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Manually parse .env file
if (fs.existsSync(".env")) {
  const content = fs.readFileSync(".env", "utf8");
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.includes("=") && !line.trim().startsWith("#")) {
      const parts = line.split("=");
      const k = parts[0].trim();
      const v = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, '');
      process.env[k] = v;
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Query library_projects
  const { data: libData, error: libErr } = await supabase
    .from("library_projects")
    .select("id, slug, title, zip_url");
  if (libErr) console.error("Error reading library_projects:", libErr);
  else {
    console.log("--- LIBRARY PROJECTS IN DB ---");
    console.log(JSON.stringify(libData, null, 2));
  }

  // Query projects
  const { data: projData, error: projErr } = await supabase
    .from("projects")
    .select("id, title, source, code, created_at");
  if (projErr) console.error("Error reading projects:", projErr);
  else {
    console.log("\n--- USER PROJECTS IN DB ---");
    console.log(JSON.stringify(projData, null, 2));
  }
}

run();
