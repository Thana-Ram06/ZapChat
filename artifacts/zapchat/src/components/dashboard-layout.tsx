import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import {
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { useEffect } from "react";

const navItems = [
  { icon: BarChart3, label: "Overview", href: "/dashboard" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: Zap, label: "Automations", href: "/dashboard/automations" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({ children, title, description, actions }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isSubPage = location !== "/dashboard";

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar hidden md:flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
              <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-xl tracking-tight">ZapChat</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? location === "/dashboard"
                  : location.startsWith(item.href);
              return (
                <Link key={item.label} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-8 h-8 rounded-md shrink-0">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} className="rounded-md" />}
              <AvatarFallback className="rounded-md bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">{user.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* ── Topbar ── */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          {/* Mobile: back button or logo */}
          <div className="flex items-center gap-2 md:hidden">
            {isSubPage ? (
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors -ml-1 px-2 py-1.5 rounded-lg hover:bg-muted active:bg-muted"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 rounded-md overflow-hidden shrink-0">
                  <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-full h-full object-contain" />
                </div>
                <span className="font-serif text-lg tracking-tight">ZapChat</span>
              </Link>
            )}
          </div>

          {/* Desktop: search */}
          <div className="relative w-64 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background h-9 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            <Avatar
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => navigate("/dashboard/settings")}
            >
              {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
          </div>
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? location === "/dashboard"
                : location.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
