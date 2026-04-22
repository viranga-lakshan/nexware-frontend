"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Warehouse
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { authToken } from "@/lib/auth-token";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { useSessionStore } from "@/store/session-store";
import { useUiStore } from "@/store/ui-store";
import { useAuth } from "@/providers/auth-provider";

function NavLinks({
  pathname,
  collapsed,
  onNavigate
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { user } = useSessionStore();
  const { hasRole } = useAuth();
  const roles = user?.roles ?? [];
  const items = NAV_ITEMS.filter(
    (item) => !user || item.roles.some((role) => roles.includes(role) || hasRole([role]))
  );

  return (
    <nav className="space-y-1 p-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
            pathname.startsWith(item.href) && "bg-primary/10 text-primary"
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && item.title}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, clearUser } = useSessionStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUiStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const roles = user?.roles ?? [];

  useRealtimeSync();

  const logout = () => {
    authToken.clear();
    clearUser();
    router.push("/login");
  };

  const pageTitle = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.title ?? "NexWare";

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-card/95 backdrop-blur lg:block",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Warehouse className="h-5 w-5" />
            </span>
            {!sidebarCollapsed && <span>NexWare</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        <NavLinks pathname={pathname} collapsed={sidebarCollapsed} />
      </aside>

      <main className={cn("transition-all", sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader>
                  <SheetTitle>NexWare</SheetTitle>
                </SheetHeader>
                <NavLinks pathname={pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Distribution Command Center
              </p>
              <h1 className="text-lg font-semibold">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Operator"}</p>
              <p className="text-xs text-muted-foreground">{roles.join(", ") || "Loading role"}</p>
            </div>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
