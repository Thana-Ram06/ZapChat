import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { LayoutDashboard, Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-2xl tracking-tight">ZapChat</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-foreground transition-colors ${location === link.href ? "text-foreground" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && (
            user ? (
              <Button asChild className="rounded-xl hidden sm:inline-flex gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-xl hidden sm:inline-flex">
                <Link href="/login">Get Started</Link>
              </Button>
            )
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </div>
            </Link>
          ))}

          <div className="pt-2 border-t border-border mt-2">
            {!loading && (
              user ? (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground">
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </div>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <div className="px-4 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground text-center">
                    Get Started Free
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
