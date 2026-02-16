import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MessageCircle, Sparkles, Compass, Heart, Shield, Clock } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import heroLogo from "@/assets/see-here-logo.png";

import heroBackgroundRight from "@/assets/hero-bg-right.jpg";
import splitSafeSpace from "@/assets/split-safe-space.jpg";
import splitSupport from "@/assets/split-support.jpg";
import chatPreview from "@/assets/chat-preview.png";
import talkBubble from "@/assets/talk-bubble.png";
import replyBubble from "@/assets/reply-bubble.png";
import reflectBubble from "@/assets/reflect-bubble.png";

const ScrollSection = ({
  children,
  className = "",
  delay = 0
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
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const { user, loading } = useAuth();
  const [betaEmail, setBetaEmail] = useState("");
  const [betaReason, setBetaReason] = useState("");
  const [betaSending, setBetaSending] = useState(false);
  const [betaSent, setBetaSent] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#beta-signup') {
      setTimeout(() => {
        document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const handleBetaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setBetaSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: "Beta Signup Request",
          email: betaEmail.trim(),
          message: betaReason.trim() || "No reason provided — just interested in beta access.",
        },
      });
      if (error) throw error;
      setBetaSent(true);
      toast.success("Request sent — we'll be in touch!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBetaSending(false);
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
          {!loading &&
            (user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="text-sm bg-[#4a7a4f] hover:bg-[#3d6542] text-white">
                  Log in
                </Button>
              </Link>
            ))}
        </div>
      </header>

      {/* Beta Access Banner */}
      <div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-3 px-6 text-center">
        <p className="text-sm text-foreground">
          <span className="font-medium">Beta Testing Phase</span> — We're limiting early access to ensure quality.
          <a
            href="#beta-signup"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="underline underline-offset-2 hover:text-[#4a7a4f] transition-colors font-medium ml-1"
          >
            Join our first 50 testers
          </a>
          {" "}and receive 8 free sessions.
        </p>
      </div>

      {/* ── Hero with split background images ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background image (hidden on mobile) */}
        <div className="absolute inset-0 hidden md:block">
          <img
            src={heroBackgroundRight}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#f8f6f3]/60" />
        </div>

        {/* Solid center overlay with subtle gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="hidden md:block absolute inset-0 bg-[#f8f6f3]/90"
            style={{
              maskImage: 'radial-gradient(ellipse 50% 60% at 50% 50%, black 40%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 50% 60% at 50% 50%, black 40%, transparent 75%)'
            }}
          />
          {/* Mobile: solid gradient background */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-background via-[#f8f6f3] to-background" />
          {/* Subtle background shapes */}
          <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-[#cbb7ef]/8 blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-[350px] h-[350px] rounded-full bg-[#b1cfac]/8 blur-[100px]" />
        </div>

        {/* Central content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <img src={heroLogo} alt="see here" className="h-36 md:h-48 w-auto mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-[1.05] text-foreground tracking-tight">
            A quiet space to talk
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">AI companion trained to listen and support</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-muted-foreground text-base md:text-lg">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Available 24/7
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Fully private & encrypted
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4a7a4f] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              No subscriptions
            </span>
          </div>
          <Link to="/auth" className="inline-block pt-4">
            <Button
              size="lg"
              className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
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
            <img src={splitSafeSpace} alt="Safe space for reflection" className="w-full h-full object-cover" />
          </div>

          {/* Text side */}
          <div className="bg-[#cbb7ef]/10 flex items-center justify-end px-8 md:px-16 py-16 md:py-20">
            <ScrollSection>
              <div className="max-w-lg space-y-6 text-right ml-auto">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
                  Built by people who understand
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  SeeHere was created by therapists who know how many people need space to think out loud — but don't
                  think they are ready for or can easily access traditional therapy.
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
                  <Link to="/auth">
                    <Button
                      size="lg"
                      className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Begin a free conversation
                    </Button>
                  </Link>
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
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4"
                />
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
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4"
                />
              </div>
            </ScrollSection>

            <ScrollSection delay={200} className="h-full">
              <div className="group flex flex-col items-center text-center p-6 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-5 text-2xl font-serif text-primary group-hover:scale-105 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-lg font-serif font-light text-foreground mb-3">Reflect and return</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sessions are available 24/7. Come back to chat after a brief cooldown period.
                </p>
                <img
                  src={reflectBubble}
                  alt="Time to reflect"
                  className="w-full h-auto max-h-[180px] object-contain rounded mt-4"
                />
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
                      Grounded in unconditional positive regard and empathic understanding. You are accepted fully,
                      without judgment.
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
                      className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-12 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Begin a free conversation
                    </Button>
                  </Link>
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

      {/* ── Quote section with subtle bg ── */}
      <section className="relative py-24 px-6 bg-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <blockquote className="text-2xl md:text-3xl font-serif font-light text-foreground/90 leading-relaxed">
              "SeeHere is a reflective space, not a clinical service. Think of it as a thoughtful companion for
              self-exploration — available whenever you need it."
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
            <p className="text-center text-muted-foreground mb-16">Everything you might want to know</p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="why" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  Why SeeHere?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      Unlike generic AI, SeeHere is trained specifically in person-centred therapy principles — not for
                      productivity or problem-solving.
                    </li>
                    <li>
                      Unlike traditional therapy, there's no waiting list, no scheduling, no pressure to commit to
                      weekly sessions, and sessions cost a fraction of what you'd pay for professional therapy.
                    </li>
                    <li>
                      Unlike many mental health apps that offer CBT exercises or mood tracking, SeeHere focuses purely
                      on giving you space to think out loud with a companion that listens without judgment.
                    </li>
                  </ul>
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

              <AccordionItem value="cost" className="border-b border-border/40 pb-4">
                <AccordionTrigger className="text-xl md:text-2xl font-serif font-light text-foreground hover:no-underline text-left py-4">
                  How much does it cost?
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2 pb-4">
                  You get 2 free sessions to try SeeHere with no commitment. After that, sessions can be purchased in
                  credit packs starting from £5. Credits never expire.
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

      {/* ── Beta Access Signup ── */}
      <section id="beta-signup" className="relative py-24 px-6 md:px-12 bg-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-lg mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground">Join Our Beta</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              We're carefully onboarding our first users to ensure the best possible experience. The first 50 testers
              receive 8 free sessions — enough to truly explore what SeeHere can offer.
            </p>

            {betaSent ? (
              <div className="rounded-lg border border-border/40 bg-background/60 p-8 space-y-3">
                <p className="text-lg font-medium text-foreground">Thank you for your interest!</p>
                <p className="text-sm text-muted-foreground">
                  We'll review your request and get back to you within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBetaSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label htmlFor="beta-email" className="text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <Input
                    id="beta-email"
                    type="email"
                    placeholder="you@email.com"
                    value={betaEmail}
                    onChange={(e) => setBetaEmail(e.target.value)}
                    required
                    maxLength={255}
                    className="placeholder:text-muted-foreground/30"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="beta-reason" className="text-sm font-medium text-foreground">
                    Why would you like to try SeeHere? (Optional)
                  </label>
                  <Textarea
                    id="beta-reason"
                    placeholder="Tell us a little about yourself..."
                    value={betaReason}
                    onChange={(e) => setBetaReason(e.target.value)}
                    maxLength={1000}
                    className="min-h-[100px] placeholder:text-muted-foreground/30"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={betaSending}
                  className="w-full bg-[#4a7a4f] hover:bg-[#3d6542] text-white py-3"
                >
                  {betaSending ? "Sending…" : "Request Beta Access"}
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground">
              We'll review your request and send access within 24–48 hours.
            </p>
          </div>
        </ScrollSection>
      </section>

      {/* Safety notice */}
      <div className="relative z-10 bg-[#fae5da]/20 border-t border-border/30 py-2 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          In crisis? Contact{" "}
          <a href="tel:116123" className="underline underline-offset-2 hover:text-foreground transition-colors font-medium">
            Samaritans: 116 123
          </a>{" "}
          or text SHOUT to 85258
        </p>
      </div>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6 text-center border-t border-border/30 bg-[#f8f6f3]">
        <div className="relative z-10 space-y-4">
          <p className="text-sm text-muted-foreground">A space for reflection</p>
          <div className="flex justify-center gap-8">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a href="/contact" className="text-sm text-muted-foreground/60 hover:text-foreground transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;