import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const WorkStress = () => {
  const navigate = useNavigate();
  const [showDisclosure, setShowDisclosure] = useState(false);

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  const navigate = useNavigate();
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Private Support for Work Stress & Burnout | SeeHere.ai";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Process workplace stress and burnout in a completely private, therapist-led AI environment. No tracking, no judgment.";
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
            <span className="text-primary font-medium tracking-widest uppercase text-sm">Professional Reflection</span>
            <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground">
              When Work Feels Like a Burden You Can't Share
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              A private, secure space to process professional burnout without it ever leaving the room.
            </p>
          </div>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">

            {/* Why Privacy Matters */}
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">Why Privacy Matters for Professionals</h2>
              <p>
                Workplace stress is often complicated by the people involved. You might feel you can't speak to colleagues, HR, or even friends about the specifics of your burnout. SeeHere.ai provides a <strong>zero-cookie, encrypted environment</strong> where you can vent, reflect, and strategize without a digital paper trail.
              </p>
            </section>

            {/* Two-column cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Identify the "Heaviness"</h3>
                <p className="text-muted-foreground">Move past the generic "I'm stressed" and use our reflective mirror to find exactly which tasks or dynamics are draining your energy.</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="font-semibold text-foreground mb-2">Decompress in Real-Time</h3>
                <p className="text-muted-foreground">Don't wait for a weekend or a therapist appointment. Process a difficult meeting five minutes after it ends while the details are fresh.</p>
              </div>
            </div>

            {/* Dark CTA Box */}
            <div className="bg-foreground text-background rounded-2xl p-10 text-center mt-8">
              <h3 className="text-2xl font-serif mb-4">Start your decompression.</h3>
              <p className="text-background/60 mb-8 max-w-md mx-auto">Your employer can't see it. Google can't track it. It's just you and your thoughts.</p>
              <Link
                to="/"
                className="inline-block bg-background text-foreground px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Open Your Private Space
              </Link>
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

export default WorkStress;
