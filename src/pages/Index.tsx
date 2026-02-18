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
      }, 800); // Slower, more rhythmic transition
    }
  };

  const handleContinue = () => {
    navigate("/mirror");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <div className="animate-pulse text-[#a39e96] font-serif italic tracking-wide">Preparing the space...</div>
      </div>
    );
  }

  const isLastCard = currentCard === guidanceCards.length - 1;
  const card = guidanceCards[currentCard];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f3] selection:bg-[#af9cd3]/20 transition-colors duration-1000">
      {/* Header - Subtle Branding */}
      <header className="p-6 md:px-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center space-y-16">
          {/* Progress Indicator - Muted Lavender dots */}
          <div className="flex justify-center items-center gap-4">
            {guidanceCards.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 rounded-full ${
                  index === currentCard
                    ? "w-1.5 h-1.5 bg-[#af9cd3] shadow-[0_0_12px_rgba(175,156,211,0.4)]"
                    : "w-1 h-1 bg-[#d1cdc7]"
                }`}
              />
            ))}
          </div>

          {/* Card Content - The "Soothed" Typography */}
          <div
            className={`space-y-8 transition-all duration-1000 transform ${
              isTransitioning ? "opacity-0 blur-md translate-y-1" : "opacity-100 blur-0 translate-y-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-[#3d3a35]">{card.title}</h2>
            <p className="text-lg md:text-xl text-[#6b665f] leading-relaxed max-w-md mx-auto font-light italic opacity-90">
              {card.content}
            </p>
          </div>

          {/* Interaction Area */}
          <div className="pt-8 min-h-[120px] flex flex-col items-center justify-center transition-opacity duration-1000">
            {isLastCard ? (
              <Button
                onClick={handleContinue}
                className="bg-[#af9cd3] hover:bg-[#9d8bbd] text-white px-12 py-7 rounded-full text-lg font-light shadow-sm hover:shadow-md transition-all duration-700 animate-fade-in border-none"
              >
                Begin your reflection
              </Button>
            ) : (
              <button onClick={handleNext} className="group flex flex-col items-center space-y-4 outline-none">
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#a39e96] group-hover:text-[#af9cd3] transition-colors duration-500">
                  Continue
                </span>
                {/* Visual anchor - elegant vertical divider */}
                <div className="w-[0.5px] h-12 bg-[#e0ddd7] group-hover:bg-[#af9cd3] group-hover:h-16 transition-all duration-700" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Minimalist Safety and Navigation */}
      <footer className="p-10 text-center flex flex-col gap-6">
        <Link
          to="/dashboard"
          className="text-[10px] uppercase tracking-[0.25em] text-[#a39e96] hover:text-[#3d3a35] transition-colors duration-300"
        >
          Return to Dashboard
        </Link>
        <div className="text-[9px] text-[#c2beb8] uppercase tracking-[0.1em] max-w-xs mx-auto leading-loose font-light">
          If you are in immediate danger or need urgent support, please contact 999 (UK) or your local emergency
          services.
        </div>
      </footer>
    </div>
  );
};

export default Guidance;
