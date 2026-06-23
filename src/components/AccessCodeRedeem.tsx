import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AccessCodeRedeemProps {
  onRedeemed?: () => void;
}

const AccessCodeRedeem = ({ onRedeemed }: AccessCodeRedeemProps) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("redeem_access_code", {
        _code: code.trim(),
      });

      const result = data?.[0];
      if (error || !result) {
        toast.error("Could not redeem code. Please try again.");
        return;
      }

      if (result.success) {
        toast.success(result.message || "Organisation access unlocked");
        setCode("");
        setOpen(false);
        onRedeemed?.();
      } else {
        toast.error(result.message || "Invalid access code");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        Have an access code?
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 animate-fade-in">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter access code"
        autoFocus
        className="bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30 text-center"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setCode("");
          }}
          className="flex-1 text-xs text-muted-foreground"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || !code.trim()}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
        >
          {submitting ? "Checking..." : "Redeem"}
        </Button>
      </div>
    </form>
  );
};

export default AccessCodeRedeem;
