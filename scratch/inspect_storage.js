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
  const { data, error } = await supabase.storage.from("uploads").list("zips");
  if (error) {
    console.error("Error listing zips:", error);
  } else {
    console.log("FILES IN UPLOADS/ZIPS BUCKET:");
    console.log(data);
  }
}
run();
