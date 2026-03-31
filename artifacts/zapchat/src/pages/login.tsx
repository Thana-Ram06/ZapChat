import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Link } from "wouter";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <header className="relative z-10 h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
            <img src="/zapchat-logo.jpeg" alt="ZapChat" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif text-xl tracking-tight">ZapChat</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5">
              <Zap className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-3xl tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your ZapChat dashboard</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <Button
              onClick={signInWithGoogle}
              variant="outline"
              className="w-full h-12 rounded-xl gap-3 font-medium"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              onClick={signInWithGoogle}
              className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
            >
              Sign up free
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
