import { Link } from "@tanstack/react-router";

interface BrandLogoProps {
  className?: string;
  to?: string;
}

export function BrandLogo({ className, to = "/" }: BrandLogoProps) {
  return (
    <Link to={to as any} className={`flex items-center gap-3 select-none ${className || ""}`}>
      <img 
        src="/logo.png" 
        alt="projectbyAI" 
        className="h-8 md:h-9 w-auto object-contain max-w-[160px] dark:brightness-110" 
      />
    </Link>
  );
}
