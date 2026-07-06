import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/prebuilt/")({
  head: () => ({ meta: [{ title: "Project Library — ScholarBuild" }] }),
  component: PrebuiltGrid,
});

function PrebuiltGrid() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("library_projects").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(PREBUILT_PROJECTS);
      }
    }
    load();
  }, []);

  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const filtered = projects.filter(
    (p) => (!cat || p.category === cat) && p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" /> Library
            </div>
            <h1 className="text-3xl font-bold mt-1">Project Library</h1>
            <p className="text-muted-foreground mt-1">Skip the setup — download working final-year projects with source code and report.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className="pl-9" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCat(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link key={p.slug} to="/dashboard/prebuilt/$slug" params={{ slug: p.slug }}>
              <Card className="overflow-hidden hover:shadow-elegant transition-all group cursor-pointer h-full flex flex-col">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{p.category}</Badge>
                    <span className="font-bold text-primary">₹{p.price}</span>
                  </div>
                  <h3 className="font-semibold text-base leading-snug line-clamp-2">{p.title}</h3>
                  <div className="text-sm text-muted-foreground line-clamp-2 flex-1 prose dark:prose-invert max-w-none text-xs" dangerouslySetInnerHTML={{ __html: p.description || "" }} />
                </div>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center py-16 text-muted-foreground">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
