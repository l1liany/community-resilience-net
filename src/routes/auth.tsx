import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { RouteError, RouteNotFound } from "@/components/route-boundaries";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — HopeBridge" },
      {
        name: "description",
        content:
          "Sign in or create an account to report disaster damage, track recovery, and connect with aid and community support.",
      },
    ],
  }),
  component: AuthPage,
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Developer bypass: Mock auth flow
    localStorage.setItem('sb-auth-token', JSON.stringify({ user: { email: email || 'testuser@hopebridge.com' } }));
    toast.success(mode === "signin" ? "Welcome back (Mock Mode)" : "Account created (Mock Mode)");
    navigate({ to: "/dashboard" });
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    
    // Developer bypass: Mock auth flow
    localStorage.setItem('sb-auth-token', JSON.stringify({ user: { email: 'googleuser@hopebridge.com' } }));
    toast.success("Signed in with Google (Mock Mode)");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center justify-center px-4 pt-8">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to continue your recovery journey."
              : "Get matched with aid and connect with your community."}
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full rounded-full"
            onClick={handleGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Rivera"
                  className="mt-1.5"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="mt-1.5"
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-accent"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
