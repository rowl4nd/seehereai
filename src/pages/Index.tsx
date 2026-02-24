import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Heart, Shield, Clock, X, Check } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Logo from "@/components/Logo";

import heroLogo from "@/assets/see-here-logo.png";
import splitSafeSpace from "@/assets/split-safe-space.jpg";
import splitSupport from "@/assets/split-support.jpg";
import talkBubble from "@/assets/talk-bubble.png";
import replyBubble from "@/assets/reply-bubble.png";
import reflectBubble from "@/assets/reflect-bubble.png";
import quoteCard1 from "@/assets/quote-card-1.png";
import quoteCard2 from "@/assets/quote-card-2.png";
import quoteCard3 from "@/assets/quote-card-3.png";

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
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SeeHere",
      url: "https://seehere.ai",
      logo: "https://seehere.ai/og-image.png",
      sameAs: ["https://www.instagram.com/seehere.ai", "https://www.facebook.com/profile.php?id=61588016676425"]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
      {
        "@type": "Question",
        name: "Why SeeHere?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SeeHere exists for the 'Missing Middle' of mental health. Traditional therapy is a big leap, and wellness apps often feel like homework. We offer a quiet, reflective space for when you aren't in crisis, but you're also not okay. No programmes, no progress tracking—just a space to think out loud."
        }
      },
      {
        "@type": "Question",
        name: "How much does it cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can start a session immediately for free. After 6 messages, we ask you to create a free account to continue and save your progress. Beyond your free credits, sessions are available in 'Presence Packs' starting from £5. No subscriptions, no auto-renewals. You only pay for the space you use."
        }
      },
      {
        "@type": "Question",
        name: "Is SeeHere.ai therapy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy. It offers empathic conversation to help you process thoughts, but does not provide clinical intervention or diagnoses."
        }
      },
      {
        "@type": "Question",
        name: "Are my conversations confidential?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space for reflection."
        }
      }]

    }]
    );
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleTryForFree = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/try/guidance");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 py-2 md:px-8 bg-background/95 backdrop-blur-sm border-b border-border/40">
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

      {/* Beta Banner */}
      <div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-1.5 px-6 text-center">
        <p className="text-sm text-foreground">
          <span className="font-medium">Beta Testing Phase</span> — SeeHere is in beta. Your feedback helps us improve.
        </p>
      </div>

      {/* ── Hero - Clean, minimal ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#cbb7ef]/20 via-[#f4eadf]/20 to-[#b1cfac]/20">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-[#cbb7ef]/8 blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-[350px] h-[350px] rounded-full bg-[#b1cfac]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <img src={heroLogo} alt="see here" className="h-28 md:h-38 w-auto mx-auto mb-4" />
          <h1 className="font-serif font-light leading-[1.05] text-foreground tracking-tight">
            <span className="block text-4xl md:text-5xl lg:text-6xl">A quiet place to be heard.</span>
            <span className="block text-xl md:text-2xl lg:text-3xl mt-4 opacity-85">
              SeeHere - Your AI listening companion
            </span>
          </h1>

          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-x-8 gap-y-4 text-muted-foreground text-sm md:text-base border-y border-border/20 py-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="flex items-center gap-2 text-foreground font-medium">
                <X className="w-4 h-4 text-red-400/80" /> Questionnaires
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <X className="w-4 h-4 text-red-400/80" /> Waitlists
              </span>
              <span className="flex items-center gap-2 text-foreground font-medium">
                <X className="w-4 h-4 text-red-400/80" /> Subscriptions
              </span>
            </div>
            <div className="hidden md:block w-px h-16 bg-border/40 mx-2" />
            <div className="flex flex-col items-start gap-2">
              <span className="flex items-center gap-2 text-[#4a7a4f] font-medium">
                <Check className="w-4 h-4" /> Fully Confidential
              </span>
              <span className="flex items-center gap-2 text-[#4a7a4f] font-medium">
                <Check className="w-4 h-4" /> Available 24/7
              </span>
              <span className="flex items-center gap-2 text-[#4a7a4f] font-medium">
                <Check className="w-4 h-4" /> Person-Centred
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center">
            <Button
              size="lg"
              onClick={handleTryForFree}
              className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">

              Start your first free session
            </Button>
            <p className="mt-3 text-xs text-muted-foreground italic">​Already signed up? Log in above.         </p>
          </div>
        </div>
      </section>

      {/* ── Split content - Image + Text ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {/* Image side */}
          <div className="aspect-square md:aspect-auto md:min-h-[600px] overflow-hidden">
            <img src={splitSafeSpace} alt="Safe space for reflection" className="w-full h-full object-cover" />
          </div>

          {/* Text side */}
          <div className="bg-gradient-to-r from-[#f4eadf]/20 to-[#b1cfac]/20 flex items-center justify-end px-8 md:px-16 py-16 md:py-20">
            <ScrollSection>
              <div className="max-w-lg space-y-6 text-right ml-auto">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
                  Built by people who understand
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  SeeHere was created by therapists who know how many people need space to think out loud — but don't
                  think they are ready for, or can easily access traditional therapy.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  We combined evidence-based therapeutic principles with AI to create a companion that:
                </p>

                <div className="space-y-4 pt-2 items-end">
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-base text-foreground font-medium">Listens with empathy</p>
                    <Heart className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-base text-foreground font-medium">Asks thoughtful questions</p>
                    <MessageCircle className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-base text-foreground font-medium">Never judges</p>
                    <Shield className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    size="lg"
                    onClick={handleTryForFree}
                    className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">

                    Start your first free session
                  </Button>
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── How it works - 3 cards ── */}
      <section className="relative py-24 px-6 md:px-12 bg-[#f4eadf]/25">
        <div className="max-w-6xl mx-auto">
          <ScrollSection>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-foreground mb-20">
              How it works
            </h2>
          </ScrollSection>

          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            <ScrollSection delay={0} className="h-full">
              <div className="group flex flex-col items-center text-center p-6 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-5 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-lg font-serif font-light text-foreground mb-3">Share what's on your mind</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type freely in a private, text-based conversation. No scheduling, no pressure.
                </p>
                <img
                  src={talkBubble}
                  alt="I just feel like I need someone to talk to"
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4" />

              </div>
            </ScrollSection>

            <ScrollSection delay={100} className="h-full">
              <div className="group flex flex-col items-center text-center p-6 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-5 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-lg font-serif font-light text-foreground mb-3">Receive empathic reflection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get thoughtful responses that help you see your situation more clearly.
                </p>
                <img
                  src={replyBubble}
                  alt="I'm glad you reached out; I'm here and ready to listen"
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4" />

              </div>
            </ScrollSection>

            <ScrollSection delay={200} className="h-full">
              <div className="group flex flex-col items-center text-center p-6 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-5 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-lg font-serif font-light text-foreground mb-3">Build your inner record</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your companion remembers your previous conversations, helping you spot patterns in your own thinking
                  over time.
                </p>
                <img
                  src={reflectBubble}
                  alt="Time to reflect"
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4" />

              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── What you will get - Reverse split ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {/* Text side first on desktop */}
          <div className="bg-gradient-to-r from-[#cbb7ef]/20 to-[#f4eadf]/20 flex items-center px-8 md:px-16 py-16 md:py-20 order-2 md:order-1">
            <ScrollSection>
              <div className="max-w-lg space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
                  What you will experience
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
                      Based on unconditional positive regard and empathic understanding. You are accepted fully, without
                      judgment.
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
                  <Button
                    size="lg"
                    onClick={handleTryForFree}
                    className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">

                    Start your first free session
                  </Button>
                </div>
              </div>
            </ScrollSection>
          </div>

          {/* Image side */}
          <div className="aspect-square md:aspect-auto md:min-h-[600px] overflow-hidden order-1 md:order-2">
            <img src={splitSupport} alt="Calm and supportive environment" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── Quote cards ── */}
      <section className="relative py-24 px-6 bg-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <img
              src={quoteCard1}
              alt="Reflective space quote"
              className="w-full h-auto object-cover rounded-xl shadow-lg" />

            <img src={quoteCard2} alt="Founder quote" className="w-full h-auto object-cover rounded-xl shadow-lg" />
            <img src={quoteCard3} alt="User quote" className="w-full h-auto object-cover rounded-xl shadow-lg" />
          </div>
        </ScrollSection>
      </section>

      {/* Safety notice (Moved above FAQ) */}
      <div className="relative z-10 bg-[#f4eadf]/40 border-y border-border/30 py-3 px-6 text-center shadow-sm">
        <p className="text-sm text-foreground">
          In crisis? Contact{" "}
          <a
            href="tel:116123"
            className="underline underline-offset-2 hover:text-[#4a7a4f] transition-colors font-semibold">

            Samaritans: 116 123
          </a>{" "}
          or text SHOUT to 85258
        </p>
      </div>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-20 px-6 md:px-12">
        <ScrollSection>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-foreground mb-6">
              Common questions
            </h2>
            <p className="text-center text-muted-foreground mb-16">Everything you might want to know</p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="why" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Why SeeHere?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  SeeHere exists for the "Missing Middle" of mental health. Traditional therapy is a big leap, and
                  wellness apps often feel like homework. We offer a quiet, reflective space for when{" "}
                  <strong>you aren't in crisis, but you're also not okay.</strong> No programmes, no progress
                  tracking—just a space to think out loud.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cost" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  How much does it cost?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  You can start a session immediately for free. After 6 messages, we ask you to create a free account to
                  continue and save your progress. Beyond your free credits, sessions are available in "Presence Packs"
                  starting from £5. No subscriptions, no auto-renewals. You only pay for the space you use.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="therapy" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Is this therapy?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for
                  professional therapy. It offers empathic conversation and gentle techniques to help you process
                  thoughts and feelings, but it does not provide diagnoses, treatment plans, or clinical intervention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  SeeHere uses AI trained in person-centred principles to provide gentle reflections through text-based
                  conversations. The AI remembers your previous conversations, building continuity and understanding
                  over time — helping you explore your feelings with deeper context.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="confidential" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Are my conversations confidential?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  Yes. Your conversations are encrypted and private. We do not share your data with third parties, and
                  sessions are designed to be a safe, confidential space.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Who is this for?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  Anyone looking for a quiet, judgement-free space to reflect. Whether you're navigating a difficult
                  time, working through everyday stress, or simply want to understand yourself better.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  What if I'm struggling or in crisis?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health
                  crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6 text-center border-t border-border/30 bg-[#f8f6f3]">
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Finding the right space for you:</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <a
                href="/mental-clarity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors duration-200">

                Mental Clarity
              </a>
              <a
                href="/work-stress"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors duration-200">

                Work Stress
              </a>
              <a
                href="/support-alternative"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors duration-200">

                Therapy Alternatives
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-border/20 max-w-2xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Terms &amp; Conditions
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Privacy Policy
            </a>
            <a
              href="/contact"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;