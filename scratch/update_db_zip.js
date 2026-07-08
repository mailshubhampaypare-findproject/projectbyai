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
  const zipUrl = `https://${process.env.VITE_SUPABASE_PROJECT_ID || 'icfzsirmxzgltzjvsdis'}.supabase.co/storage/v1/object/public/uploads/zips/bngk0mzz8em_1783197442330.zip`;
  
  console.log("Updating zip_url for Cursor Control with Hand Gestures to:", zipUrl);
  
  const { data, error } = await supabase
    .from("library_projects")
    .update({ zip_url: zipUrl })
    .eq("slug", "Cursor-Control-with-Hand-Gestures")
    .select();
    
  if (error) {
    console.error("Error updating DB:", error);
  } else {
    console.log("SUCCESSFULLY UPDATED DB ROW:");
    console.log(data);
  }
}
run();
