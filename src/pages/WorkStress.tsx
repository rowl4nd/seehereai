import { useEffect, useState } from "react";
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

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Private Support for Work Stress & Burnout | SeeHere.ai";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Process workplace stress and burnout in a completely private, therapist-led AI environment. No tracking, no judgment.";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      <DisclosureModal open={showDisclosure} onAccept={handleDisclosureAccept} onClose={() => setShowDisclosure(false)} />
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
                Work & Stress
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                3 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              When Work Feels Like a Burden You Can't Share
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              A private, secure space to process professional burnout without it ever leaving the room.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              Why Privacy Matters for Professionals
            </h2>

            <p>
              Workplace stress is often complicated by the people involved. You might feel you can't speak to colleagues,
              HR, or even friends about the specifics of your burnout. SeeHere provides a{" "}
              <strong>zero-cookie, encrypted environment</strong> where you can vent, reflect, and strategize without a
              digital paper trail.
            </p>

            <div className="space-y-5 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Identify the "Heaviness"
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Move past the generic "I'm stressed" and use our reflective mirror to find exactly which tasks or
                  dynamics are draining your energy.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Decompress in Real-Time
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Don't wait for a weekend or a therapist appointment. Process a difficult meeting five minutes after it
                  ends while the details are fresh.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "Your employer can't see it. Google can't track it. It's just you and your thoughts."
            </blockquote>

            <p style={{ color: "#5f5a53" }}>
              Professional stress doesn't always fit neatly into a therapy conversation. Sometimes you need to think out
              loud about a toxic dynamic, a decision you can't discuss, or the weight of responsibility that no one sees.
              SeeHere gives you that space — private, structured, and always available.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              Start your decompression.
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
              Open Your Private Space
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

export default WorkStress;
