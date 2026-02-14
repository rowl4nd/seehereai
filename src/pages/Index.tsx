import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Sparkles, Compass, Heart, Shield, Clock } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Logo from "@/components/Logo";

import heroLogo from "@/assets/see-here-logo.png";
import splitSafeSpace from "@/assets/split-safe-space.jpg";
import splitSupport from "@/assets/split-support.jpg";

const ScrollSection = ({
  children,
  className = "",
  delay = 0




}: {children: React.ReactNode;className?: string;delay?: number;}) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}>

      {children}
    </div>);

};

const Index = () => {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 md:px-12 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <Logo />
        <div className="flex items-center gap-4">
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            FAQs
          </a>
          {!loading && (
          user ?
          <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">
                  Dashboard
                </Button>
              </Link> :

          <Link to="/auth">
                <Button size="sm" className="text-sm bg-[#4a7a4f] hover:bg-[#3d6542] text-white">
                  Log in
                </Button>
              </Link>)
          }
        </div>
      </header>

      {/* Safety notice */}
      <div className="relative z-10 bg-[#fae5da]/20 border-b border-border/30 py-2 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          In crisis? Contact{" "}
          <a href="tel:116123" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">
            Samaritans: 116 123
          </a>{" "}
          or text SHOUT to 85258
        </p>
      </div>

      {/* ── Hero - Clean, minimal ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[#f8f6f3] to-background">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-[#cbb7ef]/8 blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-[350px] h-[350px] rounded-full bg-[#b1cfac]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <img src={heroLogo} alt="see here" className="h-24 md:h-32 w-auto mx-auto mb-4" />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.05] text-foreground tracking-tight">
            A quiet space<br />to talk
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Psychologically informed AI conversations available 24/7. Gentle reflections, in private and without judgement.
          </p>
          <Link to="/auth" className="inline-block pt-4">
            <Button
              size="lg"
              className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">

              Start your first session (free)
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Split content - Image + Text ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {/* Image side */}
          <div className="aspect-square md:aspect-auto md:min-h-[600px] overflow-hidden">
            <img
              src={splitSafeSpace}
              alt="Safe space for reflection"
              className="w-full h-full object-cover" />

          </div>

          {/* Text side */}
          <div className="bg-[#cbb7ef]/10 flex items-center px-8 md:px-16 py-16 md:py-20">
            <ScrollSection>
              <div className="max-w-lg space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
                  A space designed for you
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Whether you're processing a difficult conversation, feeling stuck in a decision, navigating a transition, or simply need to think out loud — SeeHere is here.
                </p>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-[#4a7a4f] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">To talk</h3>
                      <p className="text-sm text-muted-foreground">A space to say what's on your mind — openly and freely.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-[#4a7a4f] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Not to be judged</h3>
                      <p className="text-sm text-muted-foreground">Complete acceptance. No criticism, no agenda.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-[#4a7a4f] mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">To be understood</h3>
                      <p className="text-sm text-muted-foreground">Empathic reflections that help you make sense of what you're feeling.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── How it works - 3 cards ── */}
      <section className="relative py-24 px-6 md:px-12 bg-[#f8f6f3]">
        <div className="max-w-6xl mx-auto">
          <ScrollSection>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-foreground mb-20">
              How it works
            </h2>
          </ScrollSection>

          <div className="grid md:grid-cols-3 gap-6">
            <ScrollSection delay={0}>
              <div className="group flex flex-col items-center text-center p-8 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-6 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-xl font-serif font-light text-foreground mb-3">Share what's on your mind</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type freely in a private, text-based conversation. No scheduling, no pressure.
                </p>
              </div>
            </ScrollSection>

            <ScrollSection delay={100}>
              <div className="group flex flex-col items-center text-center p-8 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-6 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-xl font-serif font-light text-foreground mb-3">Receive empathic reflection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get thoughtful responses that help you see your situation more clearly.
                </p>
              </div>
            </ScrollSection>

            <ScrollSection delay={200}>
              <div className="group flex flex-col items-center text-center p-8 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-6 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-xl font-serif font-light text-foreground mb-3">Return whenever you need</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sessions are available 24/7. Come back to continue the conversation anytime.
                </p>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── What you will get - Reverse split ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {/* Text side first on desktop */}
          <div className="bg-[#b1cfac]/10 flex items-center px-8 md:px-16 py-16 md:py-20 order-2 md:order-1">
            <ScrollSection>
              <div className="max-w-lg space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
                  What you will get
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Warmth, understanding, and room to breathe. Grounded in person-centred principles.
                </p>
                
                <div className="space-y-5 pt-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#4a7a4f]" />
                      Person-centred listening
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Grounded in unconditional positive regard and empathic understanding. You are accepted fully, without judgment.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#4a7a4f]" />
                      Gentle, practical support
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Psychologically informed techniques offered as invitations, never prescriptions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#4a7a4f]" />
                      Your pace, your space
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sessions that respect your time. No pressure, no rush. You decide when and how to engage.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link to="/auth">
                    <Button
                      size="lg"
                      className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">

                      Begin a free conversation
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollSection>
          </div>

          {/* Image side */}
          <div className="aspect-square md:aspect-auto md:min-h-[600px] overflow-hidden order-1 md:order-2">
            <img
              src={splitSupport}
              alt="Calm and supportive environment"
              className="w-full h-full object-cover" />

          </div>
        </div>
      </section>

      {/* ── Quote section with subtle bg ── */}
      <section className="relative py-24 px-6 bg-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <blockquote className="text-2xl md:text-3xl font-serif font-light text-foreground/90 leading-relaxed">
              "SeeHere is a reflective space, not a clinical service. Think of it as a thoughtful companion for self-exploration — available whenever you need it."
            </blockquote>
          </div>
        </ScrollSection>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-24 px-6 md:px-12">
        <ScrollSection>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-foreground mb-6">
              Common questions
            </h2>
            <p className="text-center text-muted-foreground mb-16">
              Everything you might want to know
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="therapy" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Is this therapy?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy. It offers empathic conversation and gentle techniques to help you process thoughts and feelings, but it does not provide diagnoses, treatment plans, or clinical intervention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  SeeHere uses AI trained in person-centred principles to provide empathic reflections through text-based conversations. You type what's on your mind, and receive thoughtful responses designed to help you explore your feelings and gain clarity. Sessions are available 24/7 with no scheduling required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="confidential" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Are my conversations confidential?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cost" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  How much does it cost?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  You get 2 free sessions to try SeeHere with no commitment. After that, sessions can be purchased in credit packs starting from £5. Credits never expire.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Who is this for?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  Anyone looking for a quiet, judgement-free space to reflect. Whether you're navigating a difficult time, working through everyday stress, or simply want to understand yourself better.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  What if I'm struggling or in crisis?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6 text-center border-t border-border/30 bg-[#f8f6f3]">
        <div className="relative z-10 space-y-4">
          <p className="text-sm text-muted-foreground">A space for reflection</p>
          <div className="flex justify-center gap-8">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Terms &amp; Conditions
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;