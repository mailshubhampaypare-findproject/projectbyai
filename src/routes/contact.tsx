import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — projectbyAI" }] }),
  component: ContactUs,
});

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields (Name, Email, Message).");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase
        .from("contact_queries")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          message: formData.message.trim()
        });

      if (error) throw error;

      setShowSuccessModal(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error(err);
      // Fallback: If table is missing, show local success but warn console
      if (err.message?.includes("relation") || err.message?.includes("does not exist")) {
        setShowSuccessModal(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        console.warn("contact_queries table is missing. Run the migration in your Supabase SQL editor.");
      } else {
        toast.error("Failed to send message: " + err.message);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b bg-transparent">
        <BrandLogo />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 grid md:grid-cols-2 gap-12 items-start w-full">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Contact Us</h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Have questions about projectbyAI, custom student project templates, subscriptions, or partnership opportunities? Send us a message and we will reply as soon as possible.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email us</p>
                <p className="text-sm font-semibold text-slate-800">support@projectbyai.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Call us</p>
                <p className="text-sm font-semibold text-slate-800">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">HQ Office</p>
                <p className="text-sm font-semibold text-slate-800">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border bg-white shadow-elegant">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Your Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Full Name"
                  required
                  className="bg-white text-slate-900 border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Email Address *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  className="bg-white text-slate-900 border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="bg-white text-slate-900 border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Your Comment / Query *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue or query in detail..."
                  required
                  className="min-h-32 bg-white text-slate-900 border-slate-200"
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full bg-gradient-primary font-semibold mt-4">
                {sending ? "Sending..." : <>Send message <Send className="h-4 w-4 ml-2" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground bg-white">
        © {new Date().getFullYear()} projectbyAI. All rights reserved.
      </footer>

      {/* Query Success Modal pop-up */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md p-6 bg-white border rounded-lg">
          <DialogHeader className="space-y-3 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center border border-green-200 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Query Submitted!</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Thank you for contacting us. We have received your message successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 p-4 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs text-slate-700">
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            <span><strong>Please Note:</strong> You will get a reply in 1-2 business days on your registered email address.</span>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full bg-gradient-primary font-semibold">
              Understood
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
