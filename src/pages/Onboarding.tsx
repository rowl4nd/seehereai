import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [aiDisclosureAccepted, setAiDisclosureAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile?.has_completed_onboarding) {
      navigate("/guidance");
    }
  }, [profile, navigate]);

  const handleComplete = async () => {
    if (!termsAccepted || !aiDisclosureAccepted) {
      toast.error("Please acknowledge all items to continue");
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateProfile({
      has_acknowledged_terms: true,
      has_acknowledged_ai_disclosure: true,
      has_completed_onboarding: true,
      onboarding_completed_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      navigate("/guidance");
    }
    setIsSubmitting(false);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          see here
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-light text-foreground">
              Before we begin
            </h1>
            <p className="text-sm text-muted-foreground">
              A few important acknowledgements
            </p>
          </div>

          {/* Acknowledgements */}
          <div className="space-y-6 bg-card/50 p-6 rounded-xl border border-border/50">
            {/* Terms */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-1"
              />
              <div className="space-y-1">
                 <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
                   I understand and accept the{" "}
                   <a
                     href="/terms"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-primary underline hover:text-primary/80 transition-colors"
                   >
                     terms and conditions
                   </a>
                 </Label>
                <p className="text-xs text-muted-foreground">
                  This service is not a replacement for professional mental health care
                </p>
              </div>
            </div>

            {/* AI Disclosure */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="ai-disclosure"
                checked={aiDisclosureAccepted}
                onCheckedChange={(checked) => setAiDisclosureAccepted(checked === true)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="ai-disclosure" className="text-sm font-normal leading-relaxed cursor-pointer">
                  I understand I am speaking with an AI
                </Label>
                <p className="text-xs text-muted-foreground">
                  See Here is an AI companion, not a human therapist or counsellor
                </p>
              </div>
            </div>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleComplete}
            disabled={!termsAccepted || !aiDisclosureAccepted || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            {isSubmitting ? "Please wait..." : "Continue"}
          </Button>

          {/* Back link */}
          <div className="text-center">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return to dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
