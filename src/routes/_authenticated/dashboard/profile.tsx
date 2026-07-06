import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/projects.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Sun, Moon, CreditCard, Zap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — Scholarly" }] }),
  component: Profile,
});

function Profile() {
  const load = useServerFn(getProfile);
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => load() });
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");

  const { data: billingHistory, isLoading: loadingBilling } = useQuery({
    queryKey: ["billing_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billing_transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const changePassword = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  };

  const usedTokens = profile?.used_tokens ?? 0;
  const leftTokens = profile?.tokens ?? 0;
  const totalTokens = Math.max(50, usedTokens + leftTokens);
  const usagePercentage = Math.round((usedTokens / totalTokens) * 100);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" /> Account
          </div>
          <h1 className="text-3xl font-bold mt-1">Profile & Settings</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 lg:col-span-2">
            <h2 className="font-semibold text-lg">Account details</h2>
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input value={profile?.full_name ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} readOnly />
            </div>
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input value={profile?.id ?? ""} readOnly className="font-mono text-xs" />
            </div>
            <Button variant="outline" onClick={changePassword}>Send password reset email</Button>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-amber-500" /> Token usage summary
                </div>
                <Badge variant="secondary" className="capitalize">{profile?.plan ?? "free"}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Used: <strong>{usedTokens}</strong></span>
                  <span>Left: <strong>{leftTokens}</strong></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  You have consumed {usedTokens} of your {totalTokens} active AI tokens.
                </p>
              </div>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">Appearance</div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  size="sm"
                  className="flex-1"
                >
                  <Sun className="h-4 w-4 mr-1" /> Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  size="sm"
                  className="flex-1"
                >
                  <Moon className="h-4 w-4 mr-1" /> Dark
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Billing history</h2>
          </div>
          <div className="overflow-x-auto">
            {loadingBilling ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Loading billing history...
              </div>
            ) : !billingHistory || billingHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                No transactions found. Purchase a token pack or library project to get started!
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="pb-2 font-medium">Invoice</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Plan/Product</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{r.invoice_no}</td>
                      <td className="py-3 text-xs text-slate-600">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="py-3 text-xs font-medium">{r.item_name}</td>
                      <td className="py-3 text-sm font-bold text-slate-700 dark:text-slate-300">₹{r.amount}</td>
                      <td className="py-3">
                        <Badge className="bg-green-100 text-green-800 border border-green-200 font-bold text-[9px] uppercase hover:bg-green-100">
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
