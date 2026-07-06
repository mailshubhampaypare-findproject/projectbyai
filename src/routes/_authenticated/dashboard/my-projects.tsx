import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listProjects, deleteProject } from "@/lib/projects.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Sparkles, Trash2, ArrowRight, Download, Laptop, FileDown } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard/my-projects")({
  head: () => ({ meta: [{ title: "My Projects — ScholarBuild" }] }),
  component: MyProjects,
});

function MyProjects() {
  const load = useServerFn(listProjects);
  const del = useServerFn(deleteProject);
  const { data: projects = [], refetch, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => load(),
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted successfully");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const createdProjects = projects.filter((p) => p.source !== "purchased");
  const purchasedProjects = projects.filter((p) => p.source === "purchased");

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <FolderKanban className="h-4 w-4 text-primary" /> Workspace
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">My Projects</h1>
            <p className="text-muted-foreground mt-1">Access projects you built with AI or purchased from our library.</p>
          </div>
          <Button asChild className="bg-gradient-primary shadow-elegant">
            <Link to="/dashboard">
              <Sparkles className="h-4 w-4 mr-2" /> Create with AI
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading workspace projects...</div>
        ) : (
          <div className="space-y-12">
            {/* Section 1: Created with AI */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Laptop className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Created with AI</h2>
                <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-0">
                  {createdProjects.length}
                </Badge>
              </div>
              
              {createdProjects.length === 0 ? (
                <Card className="p-8 text-center border-dashed bg-card/50">
                  <FolderKanban className="h-8 w-8 mx-auto mb-3 opacity-40 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">No AI projects created yet.</p>
                  <Button asChild size="sm" className="mt-4 bg-gradient-primary">
                    <Link to="/dashboard">
                      <Sparkles className="h-3.5 w-3.5 mr-2" /> Start building
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdProjects.map((p) => (
                    <Card key={p.id} className="p-5 space-y-4 hover:shadow-elegant transition-all duration-300 group flex flex-col justify-between animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900 border-slate-200">
                            AI Workspace
                          </Badge>
                          <button
                            onClick={() => remove(p.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-md"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-lg leading-snug line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.description ?? "No description provided."}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-slate-100/50">
                        <span>Updated {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}</span>
                        <Link
                          to="/dashboard/project/$id"
                          params={{ id: p.id }}
                          className="text-primary font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Purchased Projects */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <FileDown className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-bold">Purchased Projects</h2>
                <Badge variant="secondary" className="ml-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                  {purchasedProjects.length}
                </Badge>
              </div>

              {purchasedProjects.length === 0 ? (
                <Card className="p-8 text-center border-dashed bg-card/50">
                  <Download className="h-8 w-8 mx-auto mb-3 opacity-40 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">No purchased projects yet.</p>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link to="/dashboard/prebuilt">
                      <FolderKanban className="h-3.5 w-3.5 mr-2" /> Browse Library
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedProjects.map((p) => (
                    <Card key={p.id} className="p-5 space-y-4 hover:shadow-elegant transition-all duration-300 group flex flex-col justify-between animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-xs">
                            Purchased Library
                          </Badge>
                          <button
                            onClick={() => remove(p.id)}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-md"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="font-bold text-lg leading-snug line-clamp-1">{p.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.description ?? "No description provided."}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100/50">
                        {p.code ? (
                          <Button asChild className="w-full bg-gradient-primary shadow-elegant" size="sm">
                            <a href={p.code} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" /> Download Source Code (.ZIP)
                            </a>
                          </Button>
                        ) : (
                          <Button disabled className="w-full" size="sm" variant="secondary">
                            No ZIP file uploaded
                          </Button>
                        )}
                        <div className="text-[10px] text-center text-muted-foreground">
                          Purchased {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
