import { useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const SupportAlternative = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Confidential AI Support & Counselling Reflection | SeeHere.ai";

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Looking for confidential mental health support? SeeHere offers a private, therapist-informed space for reflection without waitlists.";
    document.head.appendChild(meta);

    return () => {
      document.title = prevTitle;
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => window.close()}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">

          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground">
              Confidential Space When You Can't Wait for a Session
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Bridging the gap between silence and professional support with therapist-led AI reflection.
            </p>
          </div>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">The "Middle Space" of Mental Health</h2>
              <p>
                Traditional therapy is invaluable, but it often comes with barriers: high costs, weeks of waiting, or the pressure of "performing" for another person. SeeHere.ai provides the <strong>missing middle</strong>—a place to process stress the moment it happens, in total confidence.
              </p>
            </section>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-4 font-serif text-base text-foreground">Feature</th>
                    <th className="py-4 font-serif text-base text-foreground">Traditional Support</th>
                    <th className="py-4 font-serif text-base text-primary">SeeHere.ai</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border/50">
                    <td className="py-4 font-semibold text-foreground">Accessibility</td>
                    <td className="py-4 text-muted-foreground">Scheduled/Waitlists</td>
                    <td className="py-4 text-primary font-medium">Instant, 24/7</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 font-semibold text-foreground">Privacy</td>
                    <td className="py-4 text-muted-foreground">Professional Record</td>
                    <td className="py-4 text-primary font-medium">Zero-Cookie, Anonymous</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-4 font-semibold text-foreground">Cost</td>
                    <td className="py-4 text-muted-foreground">£50–£150+ / hr</td>
                    <td className="py-4 text-primary font-medium">Free Early Access</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA */}
            <div className="text-center mt-8 space-y-6">
              <h3 className="text-xl font-serif font-light text-foreground">Experience confidential support today.</h3>
              <Link
                to="/"
                className="inline-block bg-foreground text-background px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Start Your First Session
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} See Here Ltd
        </p>
      </footer>
    </div>
  );
};

export default SupportAlternative;
