import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Sparkles, Compass, Heart, Shield, Clock } from "lucide-react";
import Logo from "@/components/Logo";
const ScrollSection = ({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const {
    ref,
    isVisible
  } = useScrollAnimation();
  return <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{
    transitionDelay: `${delay}ms`
  }}>
      {children}
    </div>;
};
const steps = [{
  icon: MessageCircle,
  title: "Share what's on your mind",
  description: "A safe space with no judgment. Say as much or as little as you like."
}, {
  icon: Sparkles,
  title: "Receive thoughtful reflections",
  description: "Responses informed by psychology, designed to help you feel heard."
}, {
  icon: Compass,
  title: "Build self-awareness",
  description: "Gently explore your emotions, patterns, and beliefs — at your own pace."
}];
const features = [{
  icon: Heart,
  title: "Person-centred listening",
  description: "Grounded in unconditional positive regard and empathic understanding. You are accepted fully, without judgment."
}, {
  icon: Shield,
  title: "Gentle, practical support",
  description: "CBT-informed techniques offered as invitations, never prescriptions. Take what resonates, leave what doesn't."
}, {
  icon: Clock,
  title: "Your pace, your space",
  description: "Sessions that respect your time. No pressure, no rush. You decide when and how to engage."
}];
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  return <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex justify-between items-center px-6 py-5 md:px-10 bg-background/80 backdrop-blur-md border-b border-border/20">
        <Logo />
        {!loading && (user ? <Link to="/dashboard">
              <Button variant="ghost" className="text-sm hover:bg-accent/50">
                Dashboard
              </Button>
            </Link> : <Link to="/auth">
              <Button variant="ghost" className="text-sm hover:bg-accent/50">
                Log in
              </Button>
            </Link>)}
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-background" />

        {/* Large warm orb - top right */}
        <div className="absolute -top-20 -right-32 w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-sage-soft/50 blur-[120px] animate-pulse pointer-events-none" />

        {/* Secondary orb - bottom left */}
        <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-accent/30 blur-[100px] pointer-events-none" style={{
        animationDuration: "4s",
        animationName: "pulse"
      }} />

        {/* Subtle warm orb - centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-warm-cream/40 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight text-foreground">
            A psychologically informed listening ear
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            A calm, private space to think out loud — supported by gentle reflections grounded in psychology.
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">scroll</span>
          <div className="w-px h-6 bg-muted-foreground/40" />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative py-24 px-6 md:px-10">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-soft/40 via-accent/15 to-background" />

        {/* Subtle floating orb */}
        <div className="absolute top-10 right-10 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-4">
              How it works
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-md mx-auto">
              Three simple steps to a calmer mind
            </p>
          </ScrollSection>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => <ScrollSection key={step.title} delay={i * 120}>
                <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-primary/60 mb-3 tracking-wider">0{i + 1}</span>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </ScrollSection>)}
          </div>

          <ScrollSection delay={360}>
            <p className="text-center text-sm text-muted-foreground mt-10">
              Your first two sessions are free. No commitment.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-24 px-6 md:px-10 overflow-hidden">
        {/* Warm ambient background */}
        <div className="absolute inset-0 bg-gradient-to-tl from-warm-cream/30 via-background to-accent/10" />

        {/* Decorative orb */}
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-sage-soft/30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-4">
              What this space offers
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-md mx-auto">
              Warmth, understanding, and room to breathe
            </p>
          </ScrollSection>

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {features.map((feature, i) => <ScrollSection key={feature.title} delay={i * 120}>
                <div className="group p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/15 hover:bg-card/90 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-sage-soft/60 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </ScrollSection>)}
          </div>
        </div>
      </section>

      {/* ── Reassurance ── */}
      <section className="relative py-24 px-6 md:px-10 overflow-hidden">
        {/* Full warm gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-sage-soft/30 via-accent/20 to-sage-soft/30" />

        {/* Soft centred glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-primary/8 blur-[80px] pointer-events-none" />

        <ScrollSection>
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            <blockquote className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed px-4">
              "This is not therapy. It's a companion for reflection — a space to think out loud, at your own pace."
            </blockquote>
            
            <div className="flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
          </div>
        </ScrollSection>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-28 px-6 md:px-10 overflow-hidden">
        {/* Warm gradient that draws the eye */}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/25 via-background to-background" />

        {/* Gentle glow behind button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-primary/10 blur-[60px] pointer-events-none" />

        <ScrollSection>
          <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-serif shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                When you're ready, let's proceed
              </Button>
            </Link>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-8 px-6 text-center border-t border-border/10">
        <div className="absolute inset-0 bg-gradient-to-t from-sage-soft/20 to-transparent" />
        <p className="relative z-10 text-xs text-muted-foreground">A space for reflection</p>
      </footer>
    </div>;
};
export default Index;