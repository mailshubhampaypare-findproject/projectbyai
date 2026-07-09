import { Link, useLocation } from "@tanstack/react-router";
import { BrandLogo } from "@/components/BrandLogo";
import { Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide footer on dashboard workspace and admin pages
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/portal-secret-admin");

  if (isDashboard || isAdmin) {
    return null;
  }

  return (
    <footer className="border-t py-16 bg-card w-full mt-auto">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-4">
          <BrandLogo />
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
            An AI-powered workspace mapping and generating source code, slideshows, reports, and viva answers for engineering student projects.
          </p>
          <div className="flex gap-2.5 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="h-8 w-8 rounded-full bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        <div className="flex md:justify-end">
          <div className="flex flex-col gap-2.5 text-muted-foreground font-medium md:text-right">
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link to="/projects" className="hover:text-primary transition-colors">Project Library</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-condition" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 border-t mt-12 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Eduprojects Solution. All rights reserved.
      </div>
    </footer>
  );
}
