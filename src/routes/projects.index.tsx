import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { GraduationCap, ArrowLeft, Search, ShoppingBag, Instagram, Youtube, Linkedin } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/projects/")({
  head: () => ({ meta: [{ title: "Project Library — ScholarBuild" }] }),
  component: PublicProjectsPage,
});

function PublicProjectsPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("library_projects")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(PREBUILT_PROJECTS);
        }
      } catch (err) {
        setProjects(PREBUILT_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
  const filtered = projects.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()))
  );

  const handleProjectClick = (slug: string) => {
    navigate({ to: `/projects/${slug}` });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <BrandLogo />
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 space-y-8 w-full">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <ShoppingBag className="h-4 w-4 text-primary" /> Project Library
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mt-1">Explore Project Library</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Skip the setup — download fully functional engineering student projects with complete source code, reports, slide decks, and run instructions.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
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
            All Projects
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
          <div className="text-center py-20 text-muted-foreground">Loading projects...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div
                key={p.slug}
                onClick={() => handleProjectClick(p.slug)}
                className="overflow-hidden hover:shadow-elegant hover:-translate-y-1 border bg-card rounded-xl transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 text-white border-0 hover:bg-slate-900">
                      {p.category}
                    </Badge>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed prose dark:prose-invert max-w-none text-xs" dangerouslySetInnerHTML={{ __html: p.description || "" }} />
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100/50 mt-auto bg-slate-50/50 dark:bg-slate-950/20">
                  <span className="text-xs font-bold text-slate-500 uppercase">One-time purchase</span>
                  <span className="font-extrabold text-primary text-lg">₹{p.price}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center py-16 text-muted-foreground">No projects found matching your query.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
