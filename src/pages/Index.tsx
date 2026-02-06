import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Sparkles, Compass, Heart, Shield, Clock } from "lucide-react";

const ScrollSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const steps = [
  {
    icon: MessageCircle,
    title: "Share what's on your mind",
    description: "A safe space with no judgment. Say as much or as little as you like.",
  },
  {
    icon: Sparkles,
    title: "Receive thoughtful reflections",
    description: "Responses informed by psychology, designed to help you feel heard.",
  },
  {
    icon: Compass,
    title: "Build self-awareness",
    description: "Gently explore your emotions, patterns, and beliefs — at your own pace.",
  },
];

const features = [
  {
    icon: Heart,
    title: "Person-centred listening",
    description:
      "Grounded in unconditional positive regard and empathic understanding. You are accepted fully, without judgment.",
  },
  {
    icon: Shield,
    title: "Gentle, practical support",
    description:
      "CBT-informed techniques offered as invitations, never prescriptions. Take what resonates, leave what doesn't.",
  },
  {
    icon: Clock,
    title: "Your pace, your space",
    description:
      "Sessions that respect your time. No pressure, no rush. You decide when and how to engage.",
  },
];

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex justify-between items-center px-6 py-5 md:px-10 bg-background/80 backdrop-blur-md border-b border-border/20">
        <Link
          to="/"
          className="font-serif text-xl text-foreground hover:text-primary transition-colors"
        >
          see here
        </Link>
        {!loading &&
          (user ? (
            <Link to="/dashboard">
              <Button variant="ghost" className="text-sm hover:bg-accent/50">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" className="text-sm hover:bg-accent/50">
                Log in
              </Button>
            </Link>
          ))}
      </header>

      {/* ── Hero ── */}
      <section className="relative flex-1 min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Decorative orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full bg-accent/40 blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight text-foreground">
            a psychologically informed listening ear
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            A calm, private space to think out loud — supported by gentle reflections grounded in psychology.
          </p>
          <div className="pt-4">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-serif transition-transform hover:scale-[1.02]"
              >
                when you're ready, let's proceed
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            scroll
          </span>
          <div className="w-px h-6 bg-muted-foreground/40" />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 md:px-10 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-16">
              How it works
            </h2>
          </ScrollSection>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <ScrollSection key={step.title} delay={i * 120}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background/60 border border-border/30 hover:border-primary/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-5">
                    <step.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-16">
              What this space offers
            </h2>
          </ScrollSection>

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-10">
            {features.map((feature, i) => (
              <ScrollSection key={feature.title} delay={i * 120}>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/60 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reassurance ── */}
      <section className="py-20 px-6 md:px-10 bg-card/50">
        <ScrollSection>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <blockquote className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed">
              "This is not therapy. It's a companion for reflection — a space to think out loud, at your own pace."
            </blockquote>
            <div className="flex justify-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
          </div>
        </ScrollSection>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 md:px-10">
        <ScrollSection>
          <div className="max-w-md mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif font-light text-foreground">
              Ready to begin?
            </h2>
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-serif transition-transform hover:scale-[1.02]"
              >
                when you're ready, let's proceed
              </Button>
            </Link>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center border-t border-border/20">
        <p className="text-xs text-muted-foreground">A space for reflection</p>
      </footer>
    </div>
  );
};

export default Index;
