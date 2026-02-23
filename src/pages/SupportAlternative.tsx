import { useEffect } from "react";
import { X, Shield, Clock, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

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
        <div className="w-full max-w-3xl mx-auto space-y-16 animate-fade-in">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
              When you’re not in crisis, <br />
              <span className="italic">but you’re not okay.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Bridging the gap between noticing a struggle and finding a space to talk. SeeHere is the "Missing Middle"
              for those who don't need a doctor, but can't keep it all inside.
            </p>
          </div>

          {/* The Problem: The Missing Middle */}
          <section className="grid md:grid-cols-3 gap-8 py-8 border-y border-border/40">
            <div className="space-y-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">No Waitlists</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The average wait for counseling is 6 months. SeeHere is available the second you need to speak—at 3 AM
                or 3 PM.
              </p>
            </div>
            <div className="space-y-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">Zero Record</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlike traditional therapy, there are no clinical notes, no medical records, and no "patient files."
                Total digital privacy.
              </p>
            </div>
            <div className="space-y-3">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg">No Performance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You don't have to "show up" or "look okay" for a human. Our AI provides a judgment-free mirror for your
                thoughts.
              </p>
            </div>
          </section>

          {/* Deep Content Section for SEO */}
          <div className="space-y-10 text-foreground/90 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-serif text-foreground italic">Why we built a "Reflective Sanctuary"</h2>
              <p>
                The modern mental health landscape is binary: you are either "fine" or you are "in crisis." But most of
                us live in the space between. We call this the <strong>Validation Deficit</strong>—a chronic shortage of
                places where you can express yourself without the pressure to be "fixed" or the high cost of private
                therapy.
              </p>
              <p>
                SeeHere.ai isn't a replacement for therapy; it is a <strong>holding space</strong>. It is for the
                thoughts that feel too heavy for friends, but not "medical" enough for a clinical setting.
              </p>
            </section>

            {/* Comparison Table */}
            <div className="rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 font-serif text-base text-foreground">The Experience</th>
                    <th className="p-4 font-serif text-base text-foreground">Traditional Support</th>
                    <th className="p-4 font-serif text-base text-primary">SeeHere.ai</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-semibold">Accessibility</td>
                    <td className="p-4 text-muted-foreground italic">Weeks of waiting</td>
                    <td className="p-4 text-primary font-medium">Instant & 24/7</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-semibold">Privacy</td>
                    <td className="p-4 text-muted-foreground italic">Clinical history</td>
                    <td className="p-4 text-primary font-medium">Anonymous & No Cookies</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="p-4 font-semibold">Psychology</td>
                    <td className="p-4 text-muted-foreground italic">Diagnostic/Fixing</td>
                    <td className="p-4 text-primary font-medium">Reflective/Presence</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold">Cost</td>
                    <td className="p-4 text-muted-foreground italic">£60 - £150 per hour</td>
                    <td className="p-4 text-primary font-medium">Free to try / £5 packs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <section className="space-y-4 text-center py-8">
              <p className="text-muted-foreground italic">
                "No one should have to carry their heaviest thoughts alone simply because they are not in enough pain to
                'count'."
              </p>
            </section>
          </div>

          {/* Final Call to Action */}
          <div className="text-center pt-8 border-t border-border/40 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground">A space to think out loud.</h3>
              <p className="text-muted-foreground">
                Try your first two sessions for free. No account, no credit card, no pressure.
              </p>
            </div>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              Start 2 Free Sessions
            </Link>
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
              Completely Private • Person-Centred AI • No Subscription
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
