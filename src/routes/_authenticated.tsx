import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-card/50 backdrop-blur flex items-center gap-3 px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-gradient">Scholarly</span>
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <Breadcrumb pathname={pathname} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-hidden flex flex-col h-[calc(100vh-3.5rem)]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  return (
    <span className="text-sm text-muted-foreground hidden sm:inline">
      {parts.slice(0, 2).join(" / ") || "dashboard"}
    </span>
  );
}
