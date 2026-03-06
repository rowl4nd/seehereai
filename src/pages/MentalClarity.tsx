import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const MentalClarity = () => {
  const navigate = useNavigate();
  const [showDisclosure, setShowDisclosure] = useState(false);

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "How to Use AI for Mental Clarity | SeeHere.ai";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Discover how therapist-led AI reflection helps clear your mind and reduce stress in a private, cookie-free space.";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DisclosureModal open={showDisclosure} onAccept={handleDisclosureAccept} />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">

          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground">
              Beyond Journaling: A Space to Find Your Own Answers
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Most AI wants to give you answers. SeeHere.ai is designed to help you hear your own.
            </p>
          </div>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">

            {/* Blockquote */}
            <blockquote className="italic border-l-4 border-primary/20 pl-6 text-muted-foreground">
              "Grounded in person-centered principles, reflective dialogue isn't about productivity hacks—it's about having a cognitive mirror."
            </blockquote>

            {/* What is Reflective Dialogue */}
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">What is Reflective Dialogue?</h2>
              <p>
                When we are overwhelmed, our thoughts become a tangled web. Standard journaling is a "dump," but <strong>Reflective Dialogue</strong> is a structured echo. By reflecting your feelings back to you with empathy and clarity, SeeHere helps your brain organize thoughts naturally, allowing the path forward to become visible.
              </p>
            </section>

            {/* Steps */}
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">How to get the most out of your session</h2>
              <ul className="space-y-5 mt-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <p className="font-semibold text-foreground">Start with a "Brain Dump"</p>
                    <p className="text-muted-foreground">Don't worry about logic. Type exactly how you feel. "I feel overwhelmed and don't know where to start."</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <p className="font-semibold text-foreground">Notice the Reflection</p>
                    <p className="text-muted-foreground">SeeHere won't give you a to-do list. It might say: "It sounds like the volume of tasks is heavy today. Which one feels the most pressing?"</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <p className="font-semibold text-foreground">Find Your Integration</p>
                    <p className="text-muted-foreground">Before finishing, review the flow of your thoughts. This is your mental clarity in real-time.</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* CTA Box */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center mt-8">
              <h3 className="text-xl font-serif font-light text-foreground mb-4">Ready for a moment of clarity?</h3>
              <p className="text-muted-foreground mb-6">No accounts, no tracking, and total privacy.</p>
              <button
                onClick={() => setShowDisclosure(true)}
                className="inline-block bg-foreground text-background px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Start a Reflective Session
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} See Here Ltd
        </p>
      </footer>
    </div>
  );
};

export default MentalClarity;
