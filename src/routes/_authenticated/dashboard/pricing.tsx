import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { PRICING_PLANS } from "@/lib/prebuilt-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Scholarly" }] }),
  component: Pricing,
});

function Pricing() {
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

  const handleBuyPlan = async (plan: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email || "student@example.com";
    const fullName = session?.user?.user_metadata?.full_name || "Student";

    if (!(window as any).Razorpay) {
      toast.error("Razorpay SDK is loading. Please wait a second and try again.");
      return;
    }

    const finalPrice = getDiscountedPrice(Number(plan.price));

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T9aKebvfGIfoPs",
      amount: Math.round(finalPrice * 100), // Convert INR to Paisa cents
      currency: "INR",
      name: "ScholarBuild",
      description: `Purchase ${plan.name} Token Pack`,
      image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6ce9b27c-0d24-44a6-9792-659971ff637e/id-preview-763aa04d--76a070a1-12d6-4684-a608-6b50d760aa47.lovable.app-1783062772600.png",
      handler: function (response: any) {
        toast.success(`Plan ${plan.name} activated successfully! Transaction ID: ${response.razorpay_payment_id}`);
        
        if (session?.user) {
          (async () => {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("tokens")
                .eq("id", session.user.id)
                .single();
              
              const currentTokens = profile?.tokens || 0;
              const newTokens = currentTokens + plan.tokens;
              
              await supabase
                .from("profiles")
                .update({ tokens: newTokens, plan: plan.id })
                .eq("id", session.user.id);

              // Add billing invoice entry
              await supabase
                .from("billing_transactions")
                .insert({
                  user_id: session.user.id,
                  invoice_no: `INV-${Date.now().toString().slice(-6)}`,
                  item_name: appliedCoupon 
                    ? `${plan.name} Token Pack (Coupon: ${appliedCoupon.code})`
                    : `${plan.name} Token Pack`,
                  amount: finalPrice,
                  payment_id: response.razorpay_payment_id,
                  status: "Paid"
                });
              
              toast.success(`Successfully added ${plan.tokens.toLocaleString()} tokens to your account!`);
            } catch (dbErr) {
              console.error("Error updating profile tokens:", dbErr);
            }
          })();
        }
      },
      prefill: {
        name: fullName,
        email: email,
      },
      notes: {
        plan_id: plan.id,
        plan_name: plan.name,
        tokens_added: plan.tokens,
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
      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
            <Zap className="h-3 w-3" /> Buy AI tokens
          </span>
          <h1 className="text-4xl font-bold">Simple, student-friendly pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI tokens power your project chats, reports, viva questions, and slide decks. Buy once, use across every project.
          </p>
        </div>

        {/* Coupon Code Input Container */}
        <Card className="max-w-md mx-auto p-4 border bg-white flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter coupon code (e.g. SAVE50)..."
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full text-sm border-0 focus:ring-0 px-2 py-1 uppercase font-semibold text-slate-900 placeholder-slate-400 bg-white"
              disabled={validatingCoupon}
            />
          </div>
          <Button 
            onClick={handleApplyCoupon} 
            disabled={validatingCoupon}
            size="sm"
            className="bg-primary text-white text-xs font-semibold h-8"
          >
            {validatingCoupon ? "Checking..." : appliedCoupon ? "Applied" : "Apply Code"}
          </Button>
          {appliedCoupon && (
            <Button
              onClick={() => {
                setAppliedCoupon(null);
                setCouponCode("");
              }}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 h-8 p-1 px-2 text-xs"
            >
              Clear
            </Button>
          )}
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-8 space-y-6 relative ${plan.highlight ? "border-primary shadow-elegant border-2" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-elegant">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
              </div>
              <div>
                {appliedCoupon ? (
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-600">₹{getDiscountedPrice(Number(plan.price))}</span>
                      <span className="text-sm text-slate-400 line-through">₹{plan.price}</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200 w-max mt-1 uppercase">
                      Code {appliedCoupon.code} Applied!
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                )}
                <div className="text-sm text-primary font-semibold mt-2">{plan.tokens.toLocaleString()} AI tokens</div>
              </div>
              <Button
                onClick={() => handleBuyPlan(plan)}
                className={`w-full ${plan.highlight ? "bg-gradient-primary shadow-elegant" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
              >
                <Sparkles className="h-4 w-4 mr-2" /> Choose {plan.name}
              </Button>
              <ul className="space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-subtle border-dashed">
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-1">How tokens work</h4>
              <p className="text-muted-foreground">Each AI message uses ~1 token. Reports use 3, decks use 5.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Rollover</h4>
              <p className="text-muted-foreground">Unused tokens roll over up to 2× your monthly allowance.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Cancel anytime</h4>
              <p className="text-muted-foreground">No lock-in. Downgrade or cancel any time from your profile.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
