import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Sparkles, Compass, Heart, Shield, Clock } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Logo from "@/components/Logo";

import heroLogo from "@/assets/see-here-logo.png";

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
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const cards = [
  {
    icon: MessageCircle,
    title: "To talk",
    description: "A space to say what's on your mind — openly, freely, and without limits.",
  },
  {
    icon: Sparkles,
    title: "To be heard",
    description: "Every word matters here. You'll be met with presence and genuine attention.",
  },
  {
    icon: Compass,
    title: "To be understood",
    description: "Empathic reflections that help you make sense of what you're feeling.",
  },
  {
    icon: Heart,
    title: "Not to be judged",
    description: "Complete acceptance. No criticism, no agenda — just warmth and safety.",
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
      "Psychologically informed techniques offered as invitations, never prescriptions. Take what resonates, leave what doesn't.",
  },
  {
    icon: Clock,
    title: "Your pace, your space",
    description: "Sessions that respect your time. No pressure, no rush. You decide when and how to engage.",
  },
];

const Index = () => {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-[hsl(var(--sage-soft)/0.15)] via-60% to-[hsl(var(--peach-soft))] overflow-x-hidden">
      {/* Flowing background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-32 w-[500px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#cbb7ef]/15 blur-[100px] animate-[gentleFloat_20s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-20 w-[450px] h-[350px] rounded-[40%_60%_70%_30%/40%_70%_30%_60%] bg-[#b1cfac]/15 blur-[90px]" />
        <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-[#fae5da]/20 blur-[100px]" />
        <div className="absolute top-[55%] right-[15%] w-[350px] h-[300px] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-[#cbb7ef]/12 blur-[110px] animate-[gentleFloat_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[75%] -left-10 w-[500px] h-[350px] rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-[#b1cfac]/12 blur-[100px]" />
        <div className="absolute top-[90%] right-[5%] w-[400px] h-[400px] rounded-[50%_40%_60%_50%/40%_60%_50%_40%] bg-[#fae5da]/18 blur-[90px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex justify-between items-center px-6 py-5 md:px-10 bg-background/60 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-2">
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2">
            FAQs
          </a>
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
        </div>
      </header>

      {/* Safety notice */}
      <div className="relative z-10 bg-muted/50 border-b border-border/20">
        <p className="text-center text-xs text-muted-foreground py-2 px-4">
          If you're in crisis, please contact the Samaritans on{" "}
          <a href="tel:116123" className="underline font-medium">
            116 123
          </a>{" "}
          or text SHOUT to 85258
        </p>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pb-16">
        <div className="relative z-10 max-w-2xl mx-auto space-y-10 animate-fade-in flex flex-col items-center">
          <img src={heroLogo} alt="see here" className="h-32 md:h-40 w-auto mb-2" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight text-foreground">
            A quiet space to talk
          </h1>

          {/* Step cards */}
          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-xl">
            {["Share what's on your mind", "Receive gentle reflection", "Gain clarity at your own pace"].map((text, i) => (
              <div key={text} className="contents">
                <div className="w-36 h-28 flex items-center justify-center px-4 rounded-xl bg-[#b9a3e0] border border-[#b9a3e0]/40 shadow-sm text-center">
                  <p className="text-base font-bold text-background leading-snug">{text}</p>
                </div>
                {i < 2 && (
                  <>
                    <span className="hidden md:block text-muted-foreground/40 text-lg">→</span>
                    <span className="block md:hidden text-muted-foreground/40 text-lg">↓</span>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm max-w-md">
            Text-based conversations available 24/7. Empathic reflections, privately and without judgement.
          </p>

          <Link to="/auth">
            <Button
              size="lg"
              className="bg-background hover:bg-background/90 text-[#4a7a4f] border-[3px] border-[#b1cfac] px-12 py-5 text-base font-sans font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Start your first session (free)
            </Button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">scroll</span>
          <div className="w-px h-6 bg-muted-foreground/40" />
        </div>
      </section>

      {/* ── Combined Middle Section ── */}
      <section className="relative py-24 px-6 md:px-10 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* SeeHere cards */}
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-4">
              A space designed for you
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Whether you're processing a difficult conversation, feeling stuck in a decision, navigating a transition, or simply need to think out loud
            </p>
          </ScrollSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
              <ScrollSection key={card.title} delay={i * 120}>
                <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </ScrollSection>
            ))}
          </div>

          {/* What you will get */}
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-4 mt-24">
              What you will get
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              Warmth, understanding, and room to breathe
            </p>
          </ScrollSection>

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {features.map((feature, i) => (
              <ScrollSection key={feature.title} delay={i * 120}>
                <div className="group p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/15 hover:bg-card/90 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-sage-soft/60 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </ScrollSection>
            ))}
          </div>

          {/* Who this is for */}
          <ScrollSection>
            <div className="max-w-2xl mx-auto mt-24">
              <h3 className="text-2xl font-serif font-light text-center text-foreground mb-8">
                You might find SeeHere helpful if you...
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Need to process a difficult conversation or decision</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Feel overwhelmed by stress and want to untangle your thoughts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Are navigating a life transition and need space to reflect</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">Want to understand your emotions and reactions better</span>
                </li>
              </ul>
            </div>
          </ScrollSection>

          {/* CTA Button */}
          <ScrollSection>
            <div className="mt-12 text-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-background hover:bg-background/90 text-[#4a7a4f] border-[3px] border-[#b1cfac] px-12 py-5 text-base font-sans font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Begin a free conversation
                </Button>
              </Link>
            </div>
          </ScrollSection>

          {/* Quote */}
          <ScrollSection>
            <div className="max-w-2xl mx-auto text-center space-y-8 mt-24">
              <div className="flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
              <blockquote className="text-xl md:text-2xl font-serif italic text-foreground/80 leading-relaxed px-4">
                "SeeHere is a reflective space, not a clinical service. Think of it as a thoughtful companion for self-exploration — available whenever you need it."
              </blockquote>
              <div className="flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-24 px-6 md:px-10 overflow-hidden">
        <ScrollSection>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-4">
              Common questions
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
              Everything you might want to know
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="therapy" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  Is this therapy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy. It offers empathic conversation and gentle techniques to help you process thoughts and feelings, but it does not provide diagnoses, treatment plans, or clinical intervention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  SeeHere uses AI trained in person-centred principles to provide empathic reflections through text-based conversations. You type what's on your mind, and receive thoughtful responses designed to help you explore your feelings and gain clarity. Sessions are available 24/7 with no scheduling required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="confidential" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  Are my conversations confidential?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cost" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  How much does it cost?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  You get 2 free sessions to try SeeHere with no commitment. After that, sessions can be purchased in credit packs starting from £5. Credits never expire.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  Who is this for?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Anyone looking for a quiet, judgement-free space to reflect. Whether you're navigating a difficult time, working through everyday stress, or simply want to understand yourself better.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis" className="border border-border/20 rounded-xl bg-card/70 backdrop-blur-sm px-6">
                <AccordionTrigger className="text-lg md:text-xl font-serif font-medium text-foreground hover:no-underline">
                  What if I'm struggling or in crisis?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-8 px-6 text-center">
        <div className="relative z-10 space-y-2">
          <p className="text-xs text-muted-foreground">A space for reflection</p>
          <div className="flex justify-center gap-4">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              Terms &amp; Conditions
            </a>
            <span className="text-xs text-muted-foreground/30">·</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
