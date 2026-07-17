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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
  const baseUrl = "https://www.projectbyai.com";
  const staticPages = [
    "",
    "/projects",
    "/blog",
    "/privacy",
    "/terms-and-condition",
    "/refund",
    "/contact"
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const today = new Date().toISOString().split("T")[0];

  // 1. Add static pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>\n`;
    xml += `    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Only query DB if credentials are present
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 2. Query library projects
      try {
        const { data: libraryProjects } = await supabase
          .from("library_projects")
          .select("slug, updated_at");

        if (libraryProjects) {
          for (const proj of libraryProjects) {
            const slugEncoded = encodeURIComponent(proj.slug);
            const lastmod = proj.updated_at ? proj.updated_at.split("T")[0] : today;
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/projects/${slugEncoded}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += `  </url>\n`;
          }
        }
      } catch (err) {
        console.error("Error fetching library projects for sitemap:", err);
      }

      // 3. Query blog posts
      try {
        const { data: blogPosts } = await supabase
          .from("blog_posts")
          .select("slug, updated_at");

        if (blogPosts) {
          for (const post of blogPosts) {
            const slugEncoded = encodeURIComponent(post.slug);
            const lastmod = post.updated_at ? post.updated_at.split("T")[0] : today;
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/blog/${slugEncoded}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
          }
        }
      } catch (err) {
        console.error("Error fetching blog posts for sitemap:", err);
      }
    } catch (dbInitErr) {
      console.error("Failed to initialize Supabase client for sitemap:", dbInitErr);
    }
  } else {
    console.warn("Supabase credentials missing. Generated static sitemap only.");
  }

  xml += "</urlset>\n";

  fs.writeFileSync("public/sitemap.xml", xml, "utf8");
  console.log("Successfully generated public/sitemap.xml!");
}

run();
