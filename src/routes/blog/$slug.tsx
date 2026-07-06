import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_BLOG_POSTS } from "@/lib/blog-data";
import { GraduationCap, ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    return { meta: [{ title: `Blog Article — ScholarBuild` }] };
  },
  loader: async ({ params }) => {
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", params.slug)
        .maybeSingle();

      const fallback = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
      if (!data && !fallback) throw notFound();

      return { post: data || fallback };
    } catch (err) {
      const fallback = MOCK_BLOG_POSTS.find((p) => p.slug === params.slug);
      if (!fallback) throw notFound();
      return { post: fallback };
    }
  },
  component: BlogDetail,
});

function BlogDetail() {
  const { post } = Route.useLoaderData() as { post: any };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-4xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <Link to="/blog" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-primary" /> <span className="text-gradient">ScholarBuild</span>
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {post.category || "General"}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By ScholarBuild Team</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="aspect-[21/9] rounded-xl overflow-hidden shadow-elegant border my-8">
          <img
            src={post.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article 
          className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 leading-relaxed space-y-4 blog-html-content"
          dangerouslySetInnerHTML={{ 
            __html: post.content.startsWith("<") || post.content.includes("</") || post.content.includes("<p>") 
              ? post.content 
              : post.content.split("\n\n").map((para: string) => {
                  if (!para.trim()) return "";
                  if (para.startsWith("- ") || para.startsWith("* ")) {
                    const items = para.split("\n").map(i => `<li>${i.replace(/^(-\s*|\*\s*)/, "")}</li>`).join("");
                    return `<ul class="list-disc pl-5 my-3">${items}</ul>`;
                  }
                  return `<p class="my-3">${para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
                }).join("")
          }}
        />
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </footer>
    </div>
  );
}
