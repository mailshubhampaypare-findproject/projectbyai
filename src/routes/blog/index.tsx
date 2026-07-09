import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_BLOG_POSTS } from "@/lib/blog-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowLeft, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: [{ title: "Blog — ScholarBuild" }] }),
  component: BlogGrid,
});

function BlogGrid() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(MOCK_BLOG_POSTS);
        }
      } catch (err) {
        setPosts(MOCK_BLOG_POSTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category || "General")));
  const filtered = posts.filter(
    (p) =>
      (!cat || (p.category || "General") === cat) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase())),
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-primary" /> <span className="text-gradient">ScholarBuild</span>
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 space-y-8 w-full">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Academic Blog</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Insights, guides, and tips for college engineering final-year presentations, report formats, and viva preparation.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="pl-9 bg-card"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCat(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
              cat === null
                ? "bg-primary text-primary-foreground shadow"
                : "bg-card text-muted-foreground hover:bg-accent border"
            }`}
          >
            All Posts
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                cat === c
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-card text-muted-foreground hover:bg-accent border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading posts...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}>
                <Card className="overflow-hidden hover:shadow-elegant transition-all group cursor-pointer h-full flex flex-col border bg-card">
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={p.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 text-white border-0 hover:bg-slate-900">
                      {p.category || "General"}
                    </Badge>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(p.created_at)}</span>
                      </div>
                      <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {p.content.replace(/[#*`]/g, "")}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center py-16 text-muted-foreground">No articles found matching your query.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
