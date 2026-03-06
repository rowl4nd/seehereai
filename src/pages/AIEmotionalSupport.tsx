import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const AIEmotionalSupport = () => {
  const [showDisclosure, setShowDisclosure] = useState(false);
  const navigate = useNavigate();

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  useEffect(() => {
    document.title = "What is AI Emotional Support — and Can It Actually Help? | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "AI for mental health is everywhere right now. Here's what it can and can't do — and what makes some approaches more grounded than others.";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      <DisclosureModal open={showDisclosure} onAccept={handleDisclosureAccept} />
      <header
        className="sticky top-0 z-50 border-b px-4 py-2 md:px-8 flex items-center justify-between"
        style={{ backgroundColor: "#f8f6f3", borderColor: "#e8e1d9" }}
      >
        <Logo />
        <Link
          to="/blog"
          className="text-sm transition-colors"
          style={{ color: "#8a8278" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
        >
          ← All articles
        </Link>
      </header>

      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}
              >
                Understanding AI
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                5 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              What is AI Emotional Support — and Can It Actually Help?
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              AI for mental health is everywhere right now. Here's an honest look at what it can and can't do — and what
              makes some approaches more grounded than others.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>
              If you've typed how you're feeling into ChatGPT at 2am, you're not alone. Millions of people are quietly
              using general-purpose AI tools for emotional support — not because they planned to, but because it was
              there, it was private, and it didn't judge them.
            </p>

            <p style={{ color: "#5f5a53" }}>
              The question is: does it actually help? And is all AI emotional support the same?
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What AI can genuinely offer
            </h2>

            <p>
              There are a few things AI does surprisingly well in the context of emotional support. It's available
              immediately, at any hour. It doesn't get tired, distracted, or uncomfortable with difficult topics. It
              doesn't make you feel like a burden. And for many people, the absence of a human on the other end actually
              makes it easier to say things they've never said out loud before.
            </p>

            <p style={{ color: "#5f5a53" }}>
              That last point matters more than it might seem. The act of articulating a feeling — putting it into
              words, even to a machine — has genuine psychological value. It externalises what's been circling inside
              your head. It can bring a kind of clarity that's hard to get any other way.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What AI cannot do
            </h2>

            <p>
              It's important to be clear about the limits. AI cannot assess clinical risk. It cannot diagnose. It cannot
              provide therapy in any meaningful clinical sense. It cannot pick up on tone of voice, body language, or
              the subtle signals a trained therapist would notice in a session.
            </p>

            <p style={{ color: "#5f5a53" }}>
              And general-purpose AI — tools like ChatGPT or Gemini used for emotional conversations — wasn't designed
              for this context. It's optimised for helpfulness and engagement, not for the kind of careful, boundaried
              support that someone in a vulnerable moment actually needs.
            </p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "Not all AI emotional support is the same. The difference between a general chatbot and a purpose-built
              wellbeing companion matters — especially when you're struggling."
            </blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What makes a grounded approach different
            </h2>

            <p>
              Purpose-built AI wellbeing tools — designed specifically for emotional support rather than adapted from
              general AI — approach the conversation differently. The best ones are:
            </p>

            <div className="space-y-4 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Honest about what they are
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  They don't pretend to be human or encourage dependency. They're clear that they're AI, and they know
                  when to direct someone toward real-world support.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Grounded in therapeutic principles
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Built on person-centred or CBT frameworks rather than general conversational AI. The difference shows
                  in how they respond — less "here are five tips" and more "tell me more about that".
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Designed for wellbeing, not engagement
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Good AI emotional support isn't trying to keep you on the platform as long as possible. It's trying to
                  help you feel better and, where appropriate, move toward human support.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              Where SeeHere fits
            </h2>

            <p>
              SeeHere was built by therapists specifically for the "missing middle" — people who are struggling but not
              in crisis, and who need somewhere to think out loud between, before, or instead of formal therapy. It's
              grounded in person-centred principles, honest about being AI, and designed for your wellbeing rather than
              your engagement.
            </p>

            <p style={{ color: "#5f5a53" }}>
              It won't replace a good therapist. But for the moments when you just need to be heard — and there's nobody
              available to listen — it's something real.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              See what grounded AI support feels like.
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Two free sessions. No account needed.
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Try SeeHere free
            </Link>
            <p className="text-xs" style={{ color: "#8a8278" }}>
              Fully private · Built by therapists · No subscription
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/blog"
              className="text-sm transition-colors"
              style={{ color: "#8a8278" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: "#e8e1d9" }}>
        <p className="text-xs" style={{ color: "#8a8278" }}>
          © {new Date().getFullYear()} See Here Ltd. SeeHere is a reflective AI, not a clinical or emergency service.{" "}
          <a href="tel:116123" className="underline" style={{ color: "#8a8278" }}>
            Samaritans: 116 123
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default AIEmotionalSupport;
