import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { user, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  usePageMeta("Sign in | SeeHere", "Sign in to your SeeHere account.");

  // SEO - noindex
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) {
          setFormError(error.message);
          toast.error(error.message);
        } else {
          toast.success("Check your email for a reset link");
          setMode("login");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setFormError(error.message);
          toast.error(error.message);
        } else {
          toast.success("Welcome back");
          navigate("/dashboard");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const buttonLabel = isSubmitting ? "Please wait..." : mode === "forgot" ? "Send reset link" : "Sign in";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-3 py-1.5 md:px-6">
        <Logo />
      </header>

      {/* Beta Banner */}
      <div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-1 px-4 text-center">
        <p className="text-xs text-foreground">
          <span className="font-medium">Beta Testing Phase</span> — Your feedback helps us improve.
        </p>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xs space-y-6 animate-fade-in">
          {/* Title */}
          <div className="text-center -mt-3 space-y-2">
            <h1 className="text-5xl font-serif font-light text-foreground">
              {mode === "forgot" ? "Reset your password" : "Welcome Back"}
            </h1>
            {mode === "forgot" && <p className="text-xs text-muted-foreground">We'll send you a link to reset it</p>}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-normal text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={!!formError}
                  aria-describedby={formError ? "auth-form-error" : undefined}
                  className="h-8 text-sm bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
                  placeholder="you@example.com"
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-normal text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    aria-invalid={!!formError}
                    aria-describedby={formError ? "auth-form-error" : undefined}
                    className="h-8 text-sm bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {formError && (
                <p id="auth-form-error" role="alert" className="text-xs text-destructive">
                  {formError}
                </p>
              )}
            </div>


            <div className={cn("text-right -mt-1", mode !== "login" && "invisible")}>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-8 text-xs text-white bg-primary hover:bg-primary/90"
            >
              {buttonLabel}
            </Button>

            {mode === "login" && (
              <>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <span className="relative bg-background px-3 text-[10px] text-muted-foreground">or</span>
                </div>

                <Button
                  type="button"
                  onClick={async () => {
                    const { error } = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin,
                    });
                    if (error) toast.error(error.message);
                  }}
                  variant="outline"
                  className="w-full h-8 text-xs gap-2 border-border/50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                <Button
                  type="button"
                  onClick={async () => {
                    const { error } = await lovable.auth.signInWithOAuth("apple", {
                      redirect_uri: window.location.origin,
                    });
                    if (error) toast.error(error.message);
                  }}
                  variant="outline"
                  className="w-full h-8 text-xs gap-2 border-border/50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Sign in with Apple
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/try")}
                  className="w-full h-8 text-xs text-white bg-[#6f5c99] hover:bg-[#5f4d85]"
                >
                  New here? Try for free
                </Button>
              </>
            )}
          </form>

          {/* Back link for forgot mode */}
          {mode === "forgot" && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
