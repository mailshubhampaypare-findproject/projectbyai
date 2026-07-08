import { Link } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";

interface BrandLogoProps {
  className?: string;
  to?: string;
}

export function BrandLogo({ className, to = "/" }: BrandLogoProps) {
  const { theme } = useTheme();

  // Use the new light theme logo if theme is light, otherwise use the dark theme logo
  const logoSrc = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <Link to={to as any} className={`flex items-center gap-3 select-none ${className || ""}`}>
      <img 
        src={logoSrc} 
        alt="projectbyAI" 
        className="h-12 md:h-16 w-auto object-contain max-w-[240px]" 
      />
    </Link>
  );
}
