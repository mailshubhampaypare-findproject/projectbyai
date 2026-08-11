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
  const { data: currentProj, error: fetchErr } = await supabase
    .from("library_projects")
    .select("long_description")
    .eq("slug", "library-management-system")
    .single();

  if (fetchErr) {
    console.error("Error fetching project:", fetchErr);
    process.exit(1);
  }

  let longDesc = currentProj.long_description;
  const targetStr = "using MySQL as the backend database.</p>";
  
  if (longDesc.includes(targetStr)) {
    const insertStr = '</p><p style="font-weight: inherit; font-style: inherit; text-transform: inherit; line-height: inherit; letter-spacing: inherit; font-size: inherit;"><br></p><p style="font-weight: inherit; font-style: inherit; text-transform: inherit; line-height: inherit; letter-spacing: inherit; font-size: inherit;">If you are using this library management system project for your college submission, the clean code structure makes it easy to create standard documentation. Based on the provided database and Java classes, you can easily map out a use case diagram for library management system, design a comprehensive class diagram for library management system, or plot a dfd for library management system to complete your project reports.</p>';
    longDesc = longDesc.replace("using MySQL as the backend database.</p>", "using MySQL as the backend database." + insertStr);
    
    const { data: updateRes, error: updateErr } = await supabase
      .from("library_projects")
      .update({ long_description: longDesc })
      .eq("slug", "library-management-system")
      .select();

    if (updateErr) {
      console.error("Error updating long_description:", updateErr);
    } else {
      console.log("Successfully updated long_description in DB!");
    }
  } else {
    console.log("Target string not found in long_description!");
  }
}
run();
