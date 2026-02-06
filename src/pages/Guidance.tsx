import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const guidanceCards = [
  {
    title: "Some important notes before we begin",
    content: "Take a moment. This is your space.",
  },
  {
    title: "You are speaking with an AI",
    content:
      "I'm here to listen and reflect, not to diagnose or treat. For professional support, please consult a qualified mental health professional.",
  },
  {
    title: "Your privacy matters",
    content: "Your conversations are private. Take your time to share what feels comfortable.",
  },
  {
    title: "Sessions have a gentle time limit",
    content: "Free sessions last 25 minutes. Paid sessions give you 45 minutes. This helps you to stay grounded.",
  },
  {
    title: "Rest between sessions",
    content: "After each session, there is a 12-hour rest period. This gives you time to reflect on our conversation.",
  },
  {
    title: "Go at your own pace",
    content: "There is  no rush. Speak when you are ready. Silence is okay too.",
  },
];

const Guidance = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Guard: redirect to onboarding if not completed
  useEffect(() => {
    if (!profileLoading && profile && !profile.has_completed_onboarding) {
      navigate("/onboarding");
    }
  }, [profile, profileLoading, navigate]);

  // Auto-advance cards every 10 seconds
  useEffect(() => {
    if (currentCard >= guidanceCards.length) return;

    const timer = setTimeout(() => {
      if (currentCard < guidanceCards.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentCard((prev) => prev + 1);
          setIsTransitioning(false);
        }, 500);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentCard]);

  const handleSkip = () => {
    if (currentCard < guidanceCards.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCard((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleContinue = () => {
    navigate("/mirror");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isLastCard = currentCard >= guidanceCards.length - 1;
  const card = guidanceCards[currentCard];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <Logo />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center space-y-12">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {guidanceCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentCard ? "bg-primary w-6" : index < currentCard ? "bg-primary/40" : "bg-border"
                }`}
              />
            ))}
          </div>

          {/* Card */}
          <div className={`space-y-6 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
            <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">{card.title}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">{card.content}</p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {isLastCard ? (
              <Button onClick={handleContinue} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Continue to the Reflective Mirror
              </Button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Back link */}
      <footer className="relative z-10 p-6 text-center">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Return to dashboard
        </Link>
      </footer>
    </div>
  );
};

export default Guidance;
