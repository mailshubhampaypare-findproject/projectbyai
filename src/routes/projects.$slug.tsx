import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PREBUILT_PROJECTS } from "@/lib/prebuilt-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Download, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/projects/$slug")({
  head: () => {
    return { meta: [{ title: `Project Details — projectbyAI` }] };
  },
  loader: async ({ params }) => {
    const { data: project } = await supabase
      .from("library_projects")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();

    const fallback = PREBUILT_PROJECTS.find((p) => p.slug === params.slug);
    if (!project && !fallback) throw notFound();
    
    const p = project || fallback;
    const normalized = {
      slug: p.slug,
      title: p.title,
      description: p.description,
      longDescription: p.long_description || (p as any).longDescription || p.description,
      price: p.price,
      category: p.category,
      thumbnail: p.thumbnail,
      screenshots: p.screenshots || [],
      youtubeId: p.youtube_id || (p as any).youtubeId || "",
      tech: p.tech || [],
      buyUrl: p.buy_url || (p as any).buyUrl || "#",
      faqs: p.faqs || [],
      zipUrl: p.zip_url || "/assets/mock-projects/chat-app-source.zip",
    };
    return { project: normalized };
  },
  component: PublicProjectDetail,
});

function PublicProjectDetail() {
  const { project } = Route.useLoaderData() as { project: any };
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleBuyClick = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // User is logged in, redirect directly to dashboard prebuilt details page to purchase
      navigate({ to: `/dashboard/prebuilt/${project.slug}` });
    } else {
      toast.info("Please sign in or sign up to purchase this project.");
      navigate({
        to: "/auth",
        search: { redirect_to: `/dashboard/prebuilt/${project.slug}` },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <BrandLogo />
        <Button variant="ghost" size="sm" asChild>
          <Link to="/projects" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Library
          </Link>
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-elegant bg-muted">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary">{project.category}</Badge>
                {project.tech.slice(0, 3).map((t: string) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
              <div 
                className="text-sm text-muted-foreground mt-3 leading-relaxed prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: project.longDescription || "" }} 
              />
            </div>

            {project.screenshots && project.screenshots.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3 text-slate-900">Screenshots</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {project.screenshots.map((s: string, i: number) => (
                    <div 
                      key={i} 
                      className="aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-95 hover:scale-[1.01] transition-all"
                      onClick={() => setActiveScreenshot(s)}
                    >
                      <img src={s} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.youtubeId && (
              <section>
                <h2 className="text-xl font-semibold mb-3 text-slate-900">Demo video</h2>
                <div className="aspect-video rounded-xl overflow-hidden border shadow-elegant">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${project.youtubeId}`}
                    title="Project demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-3 text-slate-900">Tech stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <Badge key={t} variant="outline" className="text-sm">{t}</Badge>
                ))}
              </div>
            </section>

            {project.faqs && project.faqs.length > 0 && (
              <section className="border-t pt-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {project.faqs.map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="bg-card p-4 rounded-lg border border-slate-200 transition-all">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="font-semibold text-slate-900 text-sm md:text-base flex items-center justify-between w-full text-left focus:outline-none"
                        >
                          <span>Q: {faq.question}</span>
                          <span className="text-muted-foreground text-xs font-normal ml-2 shrink-0">
                            {isOpen ? "Collapse ▲" : "Expand ▼"}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-slate-100">
                            A: {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 self-start space-y-4 w-full">
            <Card className="p-6 shadow-elegant space-y-5">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">One-time purchase</div>
                <div className="text-4xl font-extrabold text-slate-900 mt-1">₹{project.price}</div>
              </div>

              <Button size="lg" className="w-full bg-gradient-primary shadow-elegant font-semibold" onClick={handleBuyClick}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Buy now
              </Button>
            </Card>
            <Card className="p-4 flex items-center gap-3 text-sm bg-slate-50/50">
              <Download className="h-5 w-5 text-primary" />
              <span>Instant download after purchase</span>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Screenshot Lightbox Modal */}
      {activeScreenshot && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200"
          onClick={() => setActiveScreenshot(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="absolute -top-12 right-0 text-white hover:text-slate-300 bg-black/40 hover:bg-black/60 p-2 rounded-full flex items-center justify-center focus:outline-none" 
              onClick={() => setActiveScreenshot(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <img src={activeScreenshot} alt="Screenshot preview" className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border border-slate-800 bg-slate-950" />
          </div>
        </div>
      )}
    </div>
  );
}
