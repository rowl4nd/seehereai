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

const Auth = () => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "forgot") {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Check your email for a reset link");
          setMode("login");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
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

  const buttonLabel = isSubmitting
    ? "Please wait..."
    : mode === "forgot"
    ? "Send reset link"
    : "Sign in";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8">
        <Logo />
      </header>

      {/* Beta Banner */}
      <div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-1.5 px-6 text-center">
        <p className="text-sm text-foreground">
          <span className="font-medium">Beta Testing Phase</span> — SeeHere is in beta. Your feedback helps us improve.
        </p>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center -mt-4 space-y-3">
            <h1 className="text-6xl font-serif font-light text-foreground">
              {mode === "forgot" ? "Reset your password" : "Welcome Back"}
            </h1>
            {mode === "forgot" && (
              <p className="text-sm text-muted-foreground">
                We'll send you a link to reset it
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
                  placeholder="you@example.com"
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-normal text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            <div className={cn("text-right -mt-2", mode !== "login" && "invisible")}>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white bg-primary hover:bg-primary/90"
            >
              {buttonLabel}
            </Button>

            {mode === "login" && (
              <>
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <span className="relative bg-background px-3 text-xs text-muted-foreground">or</span>
                </div>

                <Button
                  type="button"
                  onClick={async () => {
                    const { error } = await lovable.auth.signInWithOAuth("apple", {
                      redirect_uri: window.location.origin,
                    });
                    if (error) toast.error(error.message);
                  }}
                  variant="outline"
                  className="w-full gap-2 border-border/50"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Sign in with Apple
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/try/guidance")}
                  className="w-full text-white bg-[#b9a3e0] hover:bg-[#a48fd0]"
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
