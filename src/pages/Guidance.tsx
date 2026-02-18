import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const guidanceCards = [
  {
    title: "Welcome to your space",
    content: "Take a breath. This is your quiet corner of the internet.",
  },
  {
    title: "A supportive reflection",
    content:
      "I am an AI here to listen and mirror your thoughts, not to diagnose or treat. For professional medical support, please consult a specialist.",
  },
  {
    title: "Your privacy is held here",
    content:
      "Your conversations are encrypted and isolated. You are safe to share whatever feels comfortable, at your own pace.",
  },
  {
    title: "A natural rhythm",
    content: "Sessions last 25 or 45 minutes. This gentle boundary helps you stay grounded in the present moment.",
  },
  {
    title: "Space to breathe",
    content:
      "We meet once a day. This cooldown ensures your reflections have the room they need to take root in your life.",
  },
  {
    title: "No rush, no pressure",
    content: "Speak when you are ready. Silence is not an absence, but a part of the conversation.",
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

  useEffect(() => {
    if (!profileLoading && profile && !profile.has_completed_onboarding) {
      navigate("/onboarding");
    }
  }, [profile, profileLoading, navigate]);

  const handleNext = () => {
    if (currentCard < guidanceCards.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCard((prev) => prev + 1);
        setIsTransitioning(false);
      }, 600); // Slightly slower transition for a "misty" feel
    }
  };

  const handleContinue = () => {
    navigate("/mirror");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <div className="animate-pulse text-muted-foreground font-serif italic">Entering the quiet...</div>
      </div>
    );
  }

  const isLastCard = currentCard === guidanceCards.length - 1;
  const card = guidanceCards[currentCard];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f3] text-slate-800 transition-colors duration-1000">
      {/* Header */}
      <header className="p-6 md:px-12">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center space-y-16">
          {/* Subtle Progress Indicator */}
          <div className="flex justify-center items-center gap-3">
            {guidanceCards.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-700 rounded-full ${
                  index === currentCard
                    ? "w-2 h-2 bg-primary shadow-[0_0_8px_rgba(175,156,211,0.6)]"
                    : "w-1 h-1 bg-primary/20"
                }`}
              />
            ))}
          </div>

          {/* Card Content with "Misty" Fade */}
          <div
            className={`space-y-8 transition-all duration-1000 transform ${
              isTransitioning ? "opacity-0 blur-sm translate-y-1" : "opacity-100 blur-0 translate-y-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-slate-900">{card.title}</h2>
            <p className="text-lg md:text-xl text-slate-600/80 leading-relaxed max-w-md mx-auto font-light italic">
              {card.content}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-8 transition-opacity duration-1000 delay-300">
            {isLastCard ? (
              <Button
                onClick={handleContinue}
                className="bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in"
              >
                Begin your reflection
              </Button>
            ) : (
              <button onClick={handleNext} className="group flex flex-col items-center mx-auto space-y-2">
                <span className="text-sm uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors duration-300">
                  Continue
                </span>
                <div className="w-px h-8 bg-slate-300 group-hover:bg-primary transition-all duration-500" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="p-12 text-center flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
        >
          Return to Dashboard
        </Link>
        <div className="text-[10px] text-slate-300 uppercase tracking-tighter">
          If you are in immediate danger, please call 999 or 111.
        </div>
      </footer>
    </div>
  );
};

export default Guidance;
