import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const tabValue = mode === "forgot" ? "login" : mode;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signUp, signIn, resetPassword } = useAuth();
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
      } else if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back");
          navigate("/dashboard");
        }
      } else {
        // Check allowlist before sign-up
        const { data: isAllowed } = await supabase.rpc('is_email_allowed', { _email: email });
        if (!isAllowed) {
          toast.error("Registration is currently invite-only. Please contact us for access.");
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome to See Here");
          // Fire-and-forget welcome email
          supabase.functions.invoke('send-welcome-email', {
            body: { email }
          }).catch(() => {});
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === "forgot" ?
  "Reset your password" :
  mode === "login" ?
  "Welcome back" :
  "Begin your journey";

  const subtitle = mode === "forgot" ?
  "We'll send you a link to reset it" :
  mode === "login" ?
  "Take your time" :
  "Create a space for yourself";

  const buttonLabel = isSubmitting ?
  "Please wait..." :
  mode === "forgot" ?
  "Send reset link" :
  mode === "login" ?
  "Sign in" :
  "Create account";

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8">
        <Logo />
      </header>

      {/* Beta Access Banner */}
      <div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-1.5 px-6 text-center">
        <p className="text-sm text-foreground">
          <span className="font-medium">Beta Testing Phase</span> — We're limiting early access to ensure quality.{" "}
          <a href="/#beta-signup" className="underline underline-offset-2 hover:text-[#4a7a4f] transition-colors font-medium">
            Join our first 50 testers
          </a>.
        </p>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center -mt-4 space-y-3">
            <h1 className="text-6xl font-serif font-light text-foreground">
              {mode === "forgot" ? "Reset your password" : "Welcome"}
            </h1>
            {mode !== "forgot" &&
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                To make your experience private but also personal, we require you to have an account.  
              </p>
            }
          </div>

          {/* Tabs */}
          {mode !== "forgot" ?
          <div className="relative w-full overflow-hidden rounded-lg bg-popover p-1">
              {/* Sliding pill */}
              <div
                className={cn(
                  "absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-md bg-background shadow-sm transition-all duration-300 ease-in-out",
                  tabValue === "signup" && "translate-x-[calc(100%+4px)]"
                )}
              />
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setPassword(""); }}
                  className={cn(
                    "flex-1 text-sm flex flex-col items-center py-2 rounded-md transition-colors duration-200 z-10",
                    tabValue === "login" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="font-bold">Nice to <span style={{ color: '#709474' }}>See</span> you again</span>
                  <span className="text-xs text-muted-foreground">Sign in</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setPassword(""); }}
                  className={cn(
                    "flex-1 text-sm flex flex-col items-center py-2 rounded-md transition-colors duration-200 z-10",
                    tabValue === "signup" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="font-bold">New <span style={{ color: '#8775aa' }}>Here</span>?</span>
                  <span className="text-xs text-muted-foreground">Create account</span>
                </button>
              </div>
            </div> :

          <div className="text-center">
              <p className="text-sm text-muted-foreground">
                We'll send you a link to reset it
              </p>
            </div>
          }

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
                  placeholder="you@example.com" />

              </div>

              {mode !== "forgot" &&
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
                  placeholder="••••••••" />

                </div>
              }
            </div>

            <div className={cn("text-right -mt-2", mode !== "login" && "invisible")}>
                <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Forgot your password?
                </button>
              </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn("w-full text-white", mode === "signup" ? "bg-[#b9a3e0] hover:bg-[#a48fd0]" : "bg-primary hover:bg-primary/90")}>

              {buttonLabel}
            </Button>
          </form>

          {/* Back link for forgot mode */}
          {mode === "forgot" &&
          <div className="text-center">
              <button
              type="button"
              onClick={() => setMode("login")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">

                Back to sign in
              </button>
            </div>
          }
        </div>
      </main>
    </div>);

};

export default Auth;