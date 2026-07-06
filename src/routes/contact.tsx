import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — ScholarBuild" }] }),
  component: ContactUs,
});

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <header className="max-w-4xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-primary" /> <span className="text-gradient">ScholarBuild</span>
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 grid md:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground leading-relaxed">
            Have questions about ScholarBuild, custom final-year student project templates, subscriptions, or partnership opportunities? Send us a message and we'll reply as soon as possible.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email us</p>
                <p className="text-sm font-semibold">support@eduprojects.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Call us</p>
                <p className="text-sm font-semibold">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">HQ Office</p>
                <p className="text-sm font-semibold">Eduprojects Solution Inc., San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="min-h-32"
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full bg-gradient-primary">
                {sending ? "Sending..." : <>Send message <Send className="h-4 w-4 ml-2" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </footer>
    </div>
  );
}
