import { useEffect, useState } from "react";
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
    meta.content =
      "Discover how therapist-led AI reflection helps clear your mind and reduce stress in a private, cookie-free space.";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
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
                Reflection
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                3 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Beyond Journaling: A Space to Find Your Own Answers
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              Most AI wants to give you answers. SeeHere is designed to help you hear your own.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "Grounded in person-centered principles, reflective dialogue isn't about productivity hacks — it's about
              having a cognitive mirror."
            </blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What is Reflective Dialogue?
            </h2>

            <p>
              When we are overwhelmed, our thoughts become a tangled web. Standard journaling is a "dump," but{" "}
              <strong>Reflective Dialogue</strong> is a structured echo. By reflecting your feelings back to you with
              empathy and clarity, SeeHere helps your brain organize thoughts naturally, allowing the path forward to
              become visible.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              How to get the most out of your session
            </h2>

            <div className="space-y-5 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  1. Start with a "Brain Dump"
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Don't worry about logic. Type exactly how you feel. "I feel overwhelmed and don't know where to start."
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  2. Notice the Reflection
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  SeeHere won't give you a to-do list. It might say: "It sounds like the volume of tasks is heavy today.
                  Which one feels the most pressing?"
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  3. Find Your Integration
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Before finishing, review the flow of your thoughts. This is your mental clarity in real-time.
                </p>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              Ready for a moment of clarity?
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Two free sessions. No account needed.
            </p>
            <button
              onClick={() => setShowDisclosure(true)}
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Start a Reflective Session
            </button>
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

export default MentalClarity;
