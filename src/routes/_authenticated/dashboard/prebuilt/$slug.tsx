import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PREBUILT_PROJECTS, type PrebuiltProject } from "@/lib/prebuilt-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, ShoppingCart, Download, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard/prebuilt/$slug")({
  head: ({ params }) => {
    return { meta: [{ title: `Project Detail — ScholarBuild` }] };
  },
  loader: async ({ params }) => {
    const { data: project } = await supabase
      .from("library_projects")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();

    const fallback = PREBUILT_PROJECTS.find((p) => p.slug === params.slug);
    if (!project && !fallback) throw notFound();
    
    // Normalize DB snake_case fields to React camelCase if needed
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
  component: PrebuiltDetail,
});

function PrebuiltDetail() {
  const { project } = Route.useLoaderData() as { project: any };
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Invalid, inactive, or expired coupon code");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(data);
      toast.success(`Promo code applied: ${data.discount_type === "percentage" ? `${data.discount_value}% off` : `₹${data.discount_value} off`}`);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to check coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const getDiscountedPrice = (originalPrice: number) => {
    if (!appliedCoupon) return originalPrice;
    if (appliedCoupon.discount_type === "percentage") {
      const discount = originalPrice * (parseFloat(appliedCoupon.discount_value) / 100);
      return Math.max(0, Math.round(originalPrice - discount));
    } else {
      const discount = parseFloat(appliedCoupon.discount_value);
      return Math.max(0, Math.round(originalPrice - discount));
    }
  };

  const handleBuy = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email || "student@example.com";
    const fullName = session?.user?.user_metadata?.full_name || "Student";
    
    if (!(window as any).Razorpay) {
      toast.error("Razorpay SDK is loading. Please wait a second and click buy again.");
      return;
    }

    const finalPrice = getDiscountedPrice(Number(project.price));

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T9aKebvfGIfoPs",
      amount: Math.round(finalPrice * 100), // Convert INR to Paisa cents
      currency: "INR",
      name: "ScholarBuild",
      description: `Purchase ${project.title}`,
      image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6ce9b27c-0d24-44a6-9792-659971ff637e/id-preview-763aa04d--76a070a1-12d6-4684-a608-6b50d760aa47.lovable.app-1783062772600.png",
      handler: function (response: any) {
        toast.success("Payment Successful! Transaction ID: " + response.razorpay_payment_id);
        (async () => {
          try {
             const { error } = await supabase.from("projects").insert({
              user_id: session.user.id,
              title: project.title,
              description: project.description,
              source: "purchased",
              code: project.zipUrl,
              status: "completed",
            });
            if (error) throw error;

            // Add invoice transaction entry
            await supabase
              .from("billing_transactions")
              .insert({
                user_id: session.user.id,
                invoice_no: `INV-${Date.now().toString().slice(-6)}`,
                item_name: appliedCoupon
                  ? `Library: ${project.title} (Coupon: ${appliedCoupon.code})`
                  : `Library: ${project.title}`,
                amount: finalPrice,
                payment_id: response.razorpay_payment_id,
                status: "Paid"
              });

             toast.success("Project added to your workspace!");
             setShowPurchaseSuccess(true);
           } catch (dbErr) {
             console.error("Error adding project to workspace:", dbErr);
             toast.error("Failed to add project to workspace.");
           }
         })();
      },
      prefill: {
        name: fullName,
        email: email,
      },
      notes: {
        project_slug: project.slug,
        project_title: project.title,
      },
      theme: {
        color: "#3B82F6",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        <Link to="/dashboard/prebuilt" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-xl overflow-hidden shadow-elegant">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{project.category}</Badge>
                {project.tech.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="text-sm text-muted-foreground mt-3 leading-relaxed prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.longDescription || "" }} />
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">Screenshots</h2>
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

            <section>
              <h2 className="text-xl font-semibold mb-3">Demo video</h2>
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

            <section>
              <h2 className="text-xl font-semibold mb-3">Tech stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t: string) => (
                  <Badge key={t} variant="outline" className="text-sm">{t}</Badge>
                ))}
              </div>
            </section>

            {project.faqs && project.faqs.length > 0 && (
              <section className="border-t pt-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {project.faqs.map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="bg-card p-4 rounded-lg border border-slate-200 dark:border-slate-800 transition-all">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="font-semibold text-slate-900 dark:text-white text-sm md:text-base flex items-center justify-between w-full text-left focus:outline-none"
                        >
                          <span>Q: {faq.question}</span>
                          <span className="text-muted-foreground text-xs font-normal ml-2 shrink-0">
                            {isOpen ? "Collapse ▲" : "Expand ▼"}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-slate-100 dark:border-slate-850">
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

          <aside className="md:sticky md:top-6 self-start space-y-4 w-full md:w-80">
            <Card className="p-6 shadow-elegant space-y-5">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">One-time purchase</div>
                {appliedCoupon ? (
                  <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-green-600">₹{getDiscountedPrice(Number(project.price))}</span>
                      <span className="text-sm text-slate-400 line-through">₹{project.price}</span>
                    </div>
                    <div className="text-[10px] text-green-600 font-extrabold bg-green-50 px-2 py-0.5 rounded border border-green-200 w-max mt-1 uppercase">
                      Code {appliedCoupon.code} Applied!
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl font-extrabold text-slate-900 mt-1">₹{project.price}</div>
                )}
              </div>

              {/* Coupon Form inside card */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs border rounded px-2.5 py-1.5 uppercase font-semibold text-slate-900 bg-white focus:bg-white"
                    disabled={validatingCoupon}
                  />
                  <Button 
                    onClick={handleApplyCoupon} 
                    disabled={validatingCoupon}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-semibold px-3 border-slate-200"
                  >
                    {validatingCoupon ? "..." : appliedCoupon ? "Applied" : "Apply"}
                  </Button>
                </div>
                {appliedCoupon && (
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                    }}
                    className="text-[10px] text-red-500 hover:underline mt-1 font-semibold block text-left"
                  >
                    Remove coupon code
                  </button>
                )}
              </div>

              <Button size="lg" className="w-full bg-gradient-primary shadow-elegant font-semibold" onClick={handleBuy}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Buy now
              </Button>
            </Card>
            <Card className="p-4 flex items-center gap-3 text-sm bg-slate-50/50">
              <Download className="h-5 w-5 text-primary" />
              <span>Instant download after purchase</span>
            </Card>
          </aside>
        </div>
      </div>

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

      {/* Purchase Success Modal */}
      <Dialog open={showPurchaseSuccess} onOpenChange={(open) => {
        setShowPurchaseSuccess(open);
        if (!open) {
          navigate({ to: "/dashboard/my-projects" });
        }
      }}>
        <DialogContent className="max-w-md p-6 bg-white border rounded-lg">
          <DialogHeader className="space-y-3 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-250 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Payment Successful!</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Your purchase is complete. You can download the code package directly or manage it in your student workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Project Purchased</div>
            <div className="text-sm font-bold text-slate-800 leading-snug">{project.title}</div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2.5">
            <Button asChild className="w-full bg-gradient-primary font-bold shadow-elegant">
              <a href={project.zipUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2 animate-bounce" /> Download ZIP Package
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPurchaseSuccess(false);
                navigate({ to: "/dashboard/my-projects" });
              }} 
              className="w-full border-slate-200 text-slate-700 font-semibold"
            >
              Go to Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
