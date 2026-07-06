import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  to?: string;
}

export function BrandLogo({ className, to = "/" }: BrandLogoProps) {
  return (
    <Link href={to} className={`flex items-center gap-3 select-none ${className || ""}`}>
      <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-base font-bold text-white shadow-sm">
        S
      </div>
      <span className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
        ScholarBuild
      </span>
    </Link>
  );
}
