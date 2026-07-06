import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  "https://icfzsirmxzgltzjvsdis.supabase.co", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZnpzaXJteHpnbHR6anZzZGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNjI5NzQsImV4cCI6MjA5ODczODk3NH0.iubPlrzoxm6Sd7HAt17KapQlvL27sEzY6mxLf4tWTh8"
);

async function testUpload() {
  try {
    const fileData = fs.readFileSync("scratch/test.png");
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload("test-folder/test.png", fileData, {
        contentType: "image/png",
        upsert: true
      });
    
    if (error) {
      console.log("Error object details:");
      console.dir(error, { depth: null });
    } else {
      console.log("Upload success:", data);
    }
  } catch (err) {
    console.error("Crash:", err);
  }
}

testUpload();
