import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";


interface SecureSessionModalProps {
  open: boolean;
  onSuccess: () => void;
}

const SecureSessionModal = ({ open, onSuccess }: SecureSessionModalProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => sessionStorage.getItem("guest_email") || "");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDiscard = () => {
    sessionStorage.removeItem("guest_messages");
    sessionStorage.removeItem("guest_onboarding_complete");
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) {
        toast.error(error.message);
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome to See Here");

      // Fire-and-forget welcome email
      supabase.functions.invoke("send-welcome-email", { body: { email } }).catch(() => {});

      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-hidden [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="overflow-y-auto max-h-[75vh] pr-1 space-y-4">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-serif font-light text-center">Secure Your Session</DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            You've started a meaningful reflection. To protect your privacy and continue this session with your 2 free
            credits, please create your secure vault.
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Your 2 free credits will only begin after account creation. If you choose not to create an account, this guest
          data will be permanently discarded for your privacy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="modal-email" className="text-sm font-normal text-muted-foreground">
              Email
            </Label>
            <Input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-password" className="text-sm font-normal text-muted-foreground">
              Password
            </Label>
            <Input
              id="modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#b9a3e0] hover:bg-[#a48fd0] text-white"
          >
            {isSubmitting ? "Creating your vault..." : "Create Account"}
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40" />
          </div>
          <span className="relative bg-background px-3 text-xs text-muted-foreground">or</span>
        </div>

        <Button
          type="button"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
            });
            if (error) toast.error(error.message);
            else onSuccess();
          }}
          variant="outline"
          className="w-full gap-2 border-border/50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </Button>

        <Button
          type="button"
          onClick={async () => {
            const { error } = await lovable.auth.signInWithOAuth("apple", {
              redirect_uri: window.location.origin,
            });
            if (error) toast.error(error.message);
            else onSuccess();
          }}
          variant="outline"
          className="w-full gap-2 border-border/50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Sign up with Apple
        </Button>

        <button
          type="button"
          onClick={handleDiscard}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Not Now (Discard Session)
        </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecureSessionModal;
