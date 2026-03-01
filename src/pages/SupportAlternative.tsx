import { useEffect } from "react";
import { X, Shield, Clock, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

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
    seehere: "Free to try · from £5",
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
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/70 mr-2 flex-shrink-0 mt-[6px]" />;
  if (sentiment === "negative")
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400/40 mr-2 flex-shrink-0 mt-[6px]" />;
  return <span className="inline-block w-1.5 h-1.5 rounded-full bg-border mr-2 flex-shrink-0 mt-[6px]" />;
};

const SupportAlternative = () => {
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
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8 flex items-center justify-between">
        <Logo />
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Go back">
          <X className="h-6 w-6" />
        </Link>
      </header>

      <main className="relative z-10 flex-1 px-6 py-12 md:py-20">
        <div className="w-full max-w-4xl mx-auto space-y-16 animate-fade-in">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
              When you're not in crisis, <br />
              <span className="italic">but you're not okay.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Bridging the gap between noticing a struggle and finding a space to talk. SeeHere is the "Missing Middle"
              for those who don't need a doctor, but can't keep it all inside.
            </p>
          </div>

          {/* Three pillars */}
          <section className="grid md:grid-cols-3 gap-8 py-8 border-y border-border/40">
            <div className="space-y-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">No Waitlists</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The average wait for counselling is 6 months. SeeHere is available the second you need to speak — at 3am
                or 3pm.
              </p>
            </div>
            <div className="space-y-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">Zero Records</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike traditional therapy, there are no clinical notes, no medical records, and no patient files. Total
                digital privacy.
              </p>
            </div>
            <div className="space-y-3">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">No Performance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You don't have to "show up" or "look okay" for a human. A judgment-free space to put your thoughts.
              </p>
            </div>
          </section>

          {/* Deep content */}
          <div className="space-y-10 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground italic">Why we built a "Reflective Sanctuary"</h2>
              <p>
                The modern mental health landscape is binary: you are either "fine" or you are "in crisis." But most of
                us live in the space between. We call this the <strong>Validation Deficit</strong> — a chronic shortage
                of places where you can express yourself without the pressure to be "fixed" or the high cost of private
                therapy.
              </p>
              <p>
                SeeHere isn't a replacement for therapy; it is a <strong>holding space</strong>. It is for the thoughts
                that feel too heavy for friends, but not "medical" enough for a clinical setting.
              </p>
            </section>

            {/* ── COMPARISON TABLE ── */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground italic text-center">How we compare</h2>
              <p className="text-center text-sm text-muted-foreground mb-8">
                SeeHere sits between traditional therapy and general AI — designed specifically for the middle ground.
              </p>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1.35fr_1fr] gap-0">
                {/* Traditional Therapy header */}
                <div className="flex flex-col items-center text-center px-4 pt-5 pb-4 rounded-tl-2xl bg-muted/20 border border-border/40 border-r-0">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Option A</span>
                  <span className="font-serif text-base text-foreground">Traditional Therapy</span>
                </div>

                {/* SeeHere header — elevated and foregrounded */}
                <div
                  className="flex flex-col items-center text-center px-6 pt-7 pb-5 -mt-3 rounded-t-2xl relative z-10 border border-primary/30"
                  style={{
                    background:
                      "linear-gradient(160deg, hsl(var(--primary) / 0.10) 0%, hsl(var(--primary) / 0.04) 100%)",
                    boxShadow: "0 -4px 32px 0 hsl(var(--primary) / 0.10), 0 2px 16px 0 hsl(var(--primary) / 0.08)",
                  }}
                >
                  <span className="text-xs uppercase tracking-widest text-primary/70 mb-1 font-medium">
                    Why SeeHere
                  </span>
                  <span className="font-serif text-xl text-foreground font-medium">SeeHere</span>
                  <span className="text-xs text-primary mt-1 font-medium">The middle ground</span>
                </div>

                {/* General AI header */}
                <div className="flex flex-col items-center text-center px-4 pt-5 pb-4 rounded-tr-2xl bg-muted/20 border border-border/40 border-l-0">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Option B</span>
                  <span className="font-serif text-base text-foreground">General AI</span>
                </div>
              </div>

              {/* Rows */}
              <div className="grid grid-cols-[1fr_1.35fr_1fr] gap-0 rounded-b-2xl overflow-hidden border border-border/40 border-t-0">
                {rows.map((row, i) => {
                  const isLast = i === rows.length - 1;
                  return (
                    <div key={row.label} className="contents">
                      {/* Therapy cell */}
                      <div
                        className={`px-4 py-4 bg-muted/10 border-r border-border/30 flex flex-col gap-1 ${
                          !isLast ? "border-b border-border/20" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <SentimentDot sentiment={therapySentiment[i]} />
                          <span className="text-sm text-muted-foreground leading-snug">{row.therapy}</span>
                        </div>
                      </div>

                      {/* SeeHere cell — foregrounded */}
                      <div
                        className={`px-5 py-4 relative z-10 flex flex-col gap-1 border-x border-primary/20 ${
                          !isLast ? "border-b border-primary/10" : ""
                        }`}
                        style={{
                          background:
                            "linear-gradient(160deg, hsl(var(--primary) / 0.07) 0%, hsl(var(--primary) / 0.02) 100%)",
                        }}
                      >
                        <span className="text-xs font-medium text-primary/60 uppercase tracking-wide">{row.label}</span>
                        <span className="text-sm font-medium text-foreground leading-snug">{row.seehere}</span>
                      </div>

                      {/* AI cell */}
                      <div
                        className={`px-4 py-4 bg-muted/10 flex flex-col gap-1 ${
                          !isLast ? "border-b border-border/20" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <SentimentDot sentiment={aiSentiment[i]} />
                          <span className="text-sm text-muted-foreground leading-snug">{row.ai}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table footnote */}
              <p className="text-xs text-center text-muted-foreground/50 pt-2">
                SeeHere is not a clinical service and does not replace professional therapy. If you're in crisis, please
                contact Samaritans on 116 123.
              </p>
            </div>
          </div>

          {/* Quote */}
          <section className="text-center py-8">
            <p className="text-muted-foreground italic text-lg">
              "No one should have to carry their heaviest thoughts alone simply because they are not in enough pain to
              'count'."
            </p>
          </section>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-border/40 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground">A space to think out loud.</h3>
              <p className="text-muted-foreground">
                Try your first two sessions for free. No credit card, no pressure.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Start 2 Free Sessions
            </Link>
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Completely Private · Person-Centred AI · No Subscription
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center border-t border-border/10">
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} See Here Ltd. <br className="md:hidden" />
          SeeHere is a reflective AI, not a clinical or emergency service.
        </p>
      </footer>
    </div>
  );
};

export default SupportAlternative;
