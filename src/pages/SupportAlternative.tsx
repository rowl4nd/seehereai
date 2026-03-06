import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const rows = [
  {
    label: "When can I talk?",
    therapy: "Scheduled appointments only",
    seehere: "24/7, instantly",
    ai: "Anytime, but no structure",
  },
  {
    label: "Trained for emotional support?",
    therapy: "Yes — by a human professional",
    seehere: "Yes — person-centred principles",
    ai: "No — general purpose AI",
  },
  {
    label: "Remembers your journey?",
    therapy: "Yes — clinical notes",
    seehere: "Yes — across sessions",
    ai: "No — starts fresh each time",
  },
  {
    label: "Clinical records created?",
    therapy: "Yes — part of your medical history",
    seehere: "No records, fully private",
    ai: "No records",
  },
  {
    label: "Cost",
    therapy: "£60–£150 per session",
    seehere: "Free to try · from £2",
    ai: "~£20/month unlimited",
  },
  {
    label: "Waiting period?",
    therapy: "Weeks to months",
    seehere: "None",
    ai: "None",
  },
  {
    label: "Safe for crisis moments?",
    therapy: "Yes — trained to respond",
    seehere: "Guided to real support",
    ai: "No clinical guardrails",
  },
];

type Sentiment = "positive" | "neutral" | "negative";

const therapySentiment: Sentiment[] = [
  "neutral",
  "positive",
  "positive",
  "negative",
  "negative",
  "negative",
  "positive",
];

const aiSentiment: Sentiment[] = ["neutral", "negative", "negative", "neutral", "neutral", "positive", "negative"];

const SentimentDot = ({ sentiment }: { sentiment: Sentiment }) => {
  if (sentiment === "positive")
    return <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 mt-[6px]" style={{ backgroundColor: "rgba(74, 122, 79, 0.5)" }} />;
  if (sentiment === "negative")
    return <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 mt-[6px]" style={{ backgroundColor: "rgba(192, 57, 43, 0.4)" }} />;
  return <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 mt-[6px]" style={{ backgroundColor: "#e8e1d9" }} />;
};

const SupportAlternative = () => {
  const [showDisclosure, setShowDisclosure] = useState(false);
  const navigate = useNavigate();

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Not in Crisis but Struggling? Therapy Alternatives | SeeHere.ai";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Stuck on a therapy waiting list? SeeHere offers a private, AI-powered reflective space for those in the 'missing middle' of mental health support. No clinical forms, just presence.";
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
                Therapy Alternatives
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                5 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Not in Crisis but Struggling? Therapy Alternatives
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              Bridging the gap between noticing a struggle and finding a space to talk. SeeHere is the missing middle.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>
              The modern mental health landscape is binary: you are either "fine" or you are "in crisis." But most of
              us live in the space between. We call this the <strong>Validation Deficit</strong> — a chronic shortage
              of places where you can express yourself without the pressure to be "fixed" or the high cost of private
              therapy.
            </p>

            <p style={{ color: "#5f5a53" }}>
              SeeHere isn't a replacement for therapy; it is a <strong>holding space</strong>. It is for the thoughts
              that feel too heavy for friends, but not "medical" enough for a clinical setting.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What makes SeeHere different
            </h2>

            <div className="space-y-5 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  No Waitlists
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  The average wait for counselling is 6 months. SeeHere is available the second you need to speak — at
                  3am or 3pm.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Zero Records
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Unlike traditional therapy, there are no clinical notes, no medical records, and no patient files.
                  Total digital privacy.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  No Performance
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  You don't have to "show up" or "look okay" for a human. A judgment-free space to put your thoughts.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              How we compare
            </h2>

            <p className="text-sm" style={{ color: "#5f5a53" }}>
              SeeHere sits between traditional therapy and general AI — designed specifically for the middle ground.
            </p>

            {/* Comparison table */}
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm" style={{ borderColor: "#e8e1d9" }}>
                <thead>
                  <tr>
                    <th className="text-left py-3 px-3 font-serif font-light text-xs uppercase tracking-wider" style={{ color: "#8a8278" }}></th>
                    <th className="text-left py-3 px-3 font-serif font-light text-xs uppercase tracking-wider" style={{ color: "#8a8278" }}>Therapy</th>
                    <th className="text-left py-3 px-3 font-serif font-light text-xs uppercase tracking-wider font-medium" style={{ color: "#4a7a4f" }}>SeeHere</th>
                    <th className="text-left py-3 px-3 font-serif font-light text-xs uppercase tracking-wider" style={{ color: "#8a8278" }}>General AI</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.label} className="border-t" style={{ borderColor: "#e8e1d9" }}>
                      <td className="py-3 px-3 font-medium text-sm" style={{ color: "#3d3a35" }}>{row.label}</td>
                      <td className="py-3 px-3" style={{ color: "#5f5a53" }}>
                        <div className="flex items-start">
                          <SentimentDot sentiment={therapySentiment[i]} />
                          <span>{row.therapy}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium" style={{ color: "#3d3a35" }}>{row.seehere}</td>
                      <td className="py-3 px-3" style={{ color: "#5f5a53" }}>
                        <div className="flex items-start">
                          <SentimentDot sentiment={aiSentiment[i]} />
                          <span>{row.ai}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-center" style={{ color: "#8a8278" }}>
              SeeHere is not a clinical service and does not replace professional therapy. If you're in crisis, please
              contact Samaritans on 116 123.
            </p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "No one should have to carry their heaviest thoughts alone simply because they are not in enough pain to
              'count'."
            </blockquote>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              A space to think out loud.
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Two free sessions. No credit card, no pressure.
            </p>
            <button
              onClick={() => setShowDisclosure(true)}
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Start 2 Free Sessions
            </button>
            <p className="text-xs" style={{ color: "#8a8278" }}>
              Fully private · Person-Centred AI · No subscription
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

export default SupportAlternative;
