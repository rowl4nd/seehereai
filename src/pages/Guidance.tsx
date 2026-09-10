import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const guidanceCards = [
  {
    title: "Welcome to your space",
    content: "Take a breath.",
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
    content: "Sessions are time limited - up to 45 minutes. This helps you stay grounded in the moment.",
  },
  {
    title: "Space to breathe",
    content: "We meet once a day. This cooldown ensures your reflections have the time to be processed.",
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
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleNext = () => {
    if (currentCard < guidanceCards.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCard((prev) => prev + 1);
        setIsTransitioning(false);
      }, 900);
    }
  };

  const handleContinue = () => navigate("/mirror");

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <div className="animate-pulse text-[#857f77] font-serif italic tracking-wide" role="status" aria-live="polite">Entering the quiet...</div>
      </div>
    );
  }

  const isLastCard = currentCard === guidanceCards.length - 1;
  const card = guidanceCards[currentCard];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f3] relative overflow-hidden selection:bg-[#af9cd3]/20">
      {/* Decorative misty background blobs - Fixed positioning */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 md:px-12 opacity-40 hover:opacity-100 transition-opacity z-20">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-xl text-center space-y-12">
          {/* Accessible page heading */}
          <h1 className="sr-only">Session Guidance</h1>

          {/* Progress dots with ARIA progressbar */}
          <div
            className="flex justify-center items-center gap-4 mb-4"
            role="progressbar"
            aria-valuenow={currentCard + 1}
            aria-valuemin={1}
            aria-valuemax={guidanceCards.length}
            aria-label={`Step ${currentCard + 1} of ${guidanceCards.length}`}
          >
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

          {/* THE MISTY SECTION */}
          <div
            className={`relative p-10 md:p-16 rounded-[60px] min-h-[280px] flex items-center justify-center transition-all duration-1000 transform ${
              isTransitioning ? "opacity-0 blur-xl scale-[0.98]" : "opacity-100 blur-0 scale-100"
            }`}
          >
            {/* The Glass Background */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[60px] shadow-[0_4px_24px_-1px_rgba(0,0,0,0.02)] border border-white/60" />

            {/* The Text Content */}
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-[#3d3a35]">{card.title}</h2>
              <p className="text-lg md:text-xl text-[#5f5a53] leading-relaxed font-light italic opacity-90">
                {card.content}
              </p>
            </div>
          </div>

          {/* Interaction Area */}
          <div className="pt-8 min-h-[140px] flex flex-col items-center justify-center">
            {isLastCard ? (
              <Button
                onClick={handleContinue}
                className="bg-[#6f5c99] hover:bg-[#5f4d85] text-white px-12 py-8 rounded-full text-lg font-light shadow-xl shadow-[#6f5c99]/10 transition-all duration-700 animate-fade-in border-none"
              >
                Enter the Mirror
              </Button>
            ) : (
              <button
                onClick={handleNext}
                className="group flex flex-col items-center space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-md transition-all"
                aria-label="Next guidance card"
              >
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#857f77] group-hover:text-[#6f5c99] transition-colors duration-500">
                  Continue
                </span>
                <div className="w-[0.5px] h-12 bg-[#e0ddd7] group-hover:bg-[#af9cd3] group-hover:h-16 transition-all duration-700" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-10 text-center flex flex-col gap-4 z-10">
        <Link
          to="/dashboard"
          className="text-xs uppercase tracking-[0.25em] text-[#857f77] hover:text-[#3d3a35] transition-colors px-4 py-2 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-md"
        >
          Return to Dashboard
        </Link>
        <div className="text-xs text-[#857f77] uppercase tracking-[0.1em] max-w-xs mx-auto leading-loose">
          Not a crisis service. In danger? Call 999 or 111.
        </div>
      </footer>
    </div>
  );
};

export default Guidance;
