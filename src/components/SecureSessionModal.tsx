import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SecureSessionModalProps {
  open: boolean;
  onSuccess: () => void;
}

const SecureSessionModal = ({ open, onSuccess }: SecureSessionModalProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
      // Check allowlist
      const { data: isAllowed } = await supabase.rpc("is_email_allowed", { _email: email });
      if (!isAllowed) {
        toast.error("Registration is currently invite-only. Please request early access first.");
        setIsSubmitting(false);
        return;
      }

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
      <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
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

        <button
          type="button"
          onClick={handleDiscard}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Not Now (Discard Session)
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SecureSessionModal;
