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

const cards = [
{
  icon: MessageCircle,
  title: "To talk",
  description: "A space to say what's on your mind — openly, freely, and without limits."
},
{
  icon: Sparkles,
  title: "To be heard",
  description: "Every word matters here. You'll be met with presence and genuine attention."
},
{
  icon: Compass,
  title: "To be understood",
  description: "Empathic reflections that help you make sense of what you're feeling."
},
{
  icon: Heart,
  title: "Not to be judged",
  description: "Complete acceptance. No criticism, no agenda — just warmth and safety."
}];


const features = [
{
  icon: Heart,
  title: "Person-centred listening",
  description:
  "Grounded in unconditional positive regard and empathic understanding. You are accepted fully, without judgment."
},
{
  icon: Shield,
  title: "Gentle, practical support",
  description:
  "Psychologically informed techniques offered as invitations, never prescriptions. Take what resonates, leave what doesn't."
},
{
  icon: Clock,
  title: "Your pace, your space",
  description: "Sessions that respect your time. No pressure, no rush. You decide when and how to engage."
}];


const Index = () => {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-[hsl(var(--sage-soft)/0.12)] via-60% to-[hsl(var(--peach-soft)/0.3)] overflow-x-hidden">
      {/* Flowing background shapes - more subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-32 w-[500px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#cbb7ef]/10 blur-[120px] animate-[gentleFloat_20s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-20 w-[450px] h-[350px] rounded-[40%_60%_70%_30%/40%_70%_30%_60%] bg-[#b1cfac]/10 blur-[100px]" />
        <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-[#fae5da]/15 blur-[120px]" />
        <div className="absolute top-[55%] right-[15%] w-[350px] h-[300px] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-[#cbb7ef]/8 blur-[130px] animate-[gentleFloat_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[75%] -left-10 w-[500px] h-[350px] rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-[#b1cfac]/8 blur-[120px]" />
        <div className="absolute top-[90%] right-[5%] w-[400px] h-[400px] rounded-[50%_40%_60%_50%/40%_60%_50%_40%] bg-[#fae5da]/12 blur-[110px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex justify-between items-center px-6 py-4 md:px-12 bg-background/70 backdrop-blur-xl border-b border-border/40">
        <Logo />
        <div className="flex items-center gap-3">
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-1.5">
            FAQs
          </a>
          {!loading && (
          user ?
          <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm hover:bg-accent/50">
                  Dashboard
                </Button>
              </Link> :

          <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-sm hover:bg-accent/50">
                  Log in
                </Button>
              </Link>)
          }
        </div>
      </header>

      {/* Safety notice - more subtle */}
      <div className="relative z-10 bg-accent/5 border-b border-border/30 py-2.5 px-6 text-center">
        <p className="text-xs text-muted-foreground/80">
          In crisis? Contact{" "}
          <a href="tel:116123" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Samaritans: 116 123
          </a>{" "}
          or text SHOUT to 85258
        </p>
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pb-20 pt-12">
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-fade-in flex flex-col items-center">
          <img src={heroLogo} alt="see here" className="h-28 md:h-36 w-auto mb-1" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light leading-[1.1] text-foreground tracking-tight">
            A quiet space to talk
          </h1>
          
          {/* Step cards - modernized */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl pt-2">
            {["Share what's on your mind", "Receive gentle reflection", "Gain clarity at your own pace"].map((text, i) =>
            <div key={text} className="contents">
                <div className="w-40 h-24 flex items-center justify-center px-4 rounded-lg bg-gradient-to-br from-[#cbb7ef]/20 to-[#b9a3e0]/30 backdrop-blur-sm border border-[#b9a3e0]/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <p className="text-sm font-medium text-foreground leading-snug">{text}</p>
                </div>
                {i < 2 &&
              <>
                    <span className="hidden md:block text-muted-foreground/30 text-base">→</span>
                    <span className="block md:hidden text-muted-foreground/30 text-base">↓</span>
                  </>
              }
              </div>
            )}
          </div>

          <p className="text-base md:text-lg text-muted-foreground/90 max-w-xl mx-auto leading-relaxed pt-1">Psychologically informed AI conversations available 24/7. Empathic reflections, privately and without judgement.

          </p>

          <Link to="/auth" className="pt-2">
            <Button
              size="lg"
              className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-10 py-6 text-base font-medium shadow-lg shadow-[#4a7a4f]/20 hover:shadow-xl hover:shadow-[#4a7a4f]/30 transition-all duration-300 hover:scale-[1.02] rounded-lg">

              Start your first session (free)
            </Button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </div>
      </section>

      {/* ── Combined Middle Section ── */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* SeeHere cards */}
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-3">
              A space designed for you
            </h2>
            <p className="text-center text-muted-foreground/80 mb-14 max-w-xl mx-auto text-base leading-relaxed">
              Whether you're processing a difficult conversation, feeling stuck in a decision, navigating a transition, or simply need to think out loud
            </p>
          </ScrollSection>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-24">
            {cards.map((card, i) =>
            <ScrollSection key={card.title} delay={i * 100}>
                <div className="group flex flex-col items-start text-left p-7 rounded-lg bg-card/60 backdrop-blur-md border border-border/30 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-accent/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-serif font-medium text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{card.description}</p>
                </div>
              </ScrollSection>
            )}
          </div>

          {/* What you will get */}
          <ScrollSection>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-3">
              What you will get
            </h2>
            <p className="text-center text-muted-foreground/80 mb-14 max-w-md mx-auto text-base">
              Warmth, understanding, and room to breathe
            </p>
          </ScrollSection>

          <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 mb-20">
            {features.map((feature, i) =>
            <ScrollSection key={feature.title} delay={i * 100}>
                <div className="group p-7 rounded-lg bg-card/40 backdrop-blur-md border border-border/25 hover:bg-card/60 hover:shadow-sm transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/80 to-sage-soft/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="w-4.5 h-4.5 text-accent-foreground" />
                  </div>
                  <h3 className="text-base font-serif font-medium text-foreground mb-2.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">{feature.description}</p>
                </div>
              </ScrollSection>
            )}
          </div>

          {/* Who this is for */}
          <ScrollSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif font-light text-center text-foreground mb-10">
                You might find SeeHere helpful if you...
              </h2>

              <div className="grid gap-3.5 md:grid-cols-2">
                {[
                "Need to process a difficult conversation or decision",
                "Feel overwhelmed by stress and want to untangle your thoughts",
                "Are navigating a life transition and need space to reflect",
                "Want to understand your emotions and reactions better"].
                map((text) =>
                <div key={text} className="p-5 rounded-lg bg-card/30 backdrop-blur-sm border border-border/20 hover:border-border/40 transition-all duration-300">
                    <p className="text-sm text-muted-foreground/90 leading-relaxed">{text}</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollSection>

          {/* CTA Button */}
          <ScrollSection>
            <div className="mt-14 text-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-10 py-6 text-base font-medium shadow-lg shadow-[#4a7a4f]/20 hover:shadow-xl hover:shadow-[#4a7a4f]/30 transition-all duration-300 hover:scale-[1.02] rounded-lg">

                  Begin a free conversation
                </Button>
              </Link>
            </div>
          </ScrollSection>

          {/* Quote */}
          <ScrollSection>
            <div className="max-w-2xl mx-auto text-center space-y-6 mt-20">
              <div className="flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              </div>
              <blockquote className="text-lg md:text-xl font-serif italic text-foreground/70 leading-relaxed px-4">
                "SeeHere is a reflective space, not a clinical service. Think of it as a thoughtful companion for self-exploration — available whenever you need it."
              </blockquote>
              <div className="flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-20 px-6 md:px-12 overflow-hidden">
        <ScrollSection>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-center text-foreground mb-3">
              Common questions
            </h2>
            <p className="text-center text-muted-foreground/80 mb-12 max-w-md mx-auto text-base">
              Everything you might want to know
            </p>

            <Accordion type="single" collapsible className="space-y-2.5">
              <AccordionItem value="therapy" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  Is this therapy?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy. It offers empathic conversation and gentle techniques to help you process thoughts and feelings, but it does not provide diagnoses, treatment plans, or clinical intervention.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  How does it work?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  SeeHere uses AI trained in person-centred principles to provide empathic reflections through text-based conversations. You type what's on your mind, and receive thoughtful responses designed to help you explore your feelings and gain clarity. Sessions are available 24/7 with no scheduling required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="confidential" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  Are my conversations confidential?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cost" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  How much does it cost?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  You get 2 free sessions to try SeeHere with no commitment. After that, sessions can be purchased in credit packs starting from £5. Credits never expire.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="who" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  Who is this for?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  Anyone looking for a quiet, judgement-free space to reflect. Whether you're navigating a difficult time, working through everyday stress, or simply want to understand yourself better.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="crisis" className="border border-border/30 rounded-lg bg-card/50 backdrop-blur-md px-6 hover:bg-card/70 transition-colors duration-200">
                <AccordionTrigger className="text-base md:text-lg font-serif font-medium text-foreground hover:no-underline py-5">
                  What if I'm struggling or in crisis?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground/90 leading-relaxed pb-5">
                  SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-10 px-6 text-center border-t border-border/30">
        <div className="relative z-10 space-y-3">
          <p className="text-xs text-muted-foreground/70 tracking-wide">A space for reflection</p>
          <div className="flex justify-center gap-6">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Terms &amp; Conditions
            </a>
            <span className="text-xs text-muted-foreground/30">·</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200">

              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;