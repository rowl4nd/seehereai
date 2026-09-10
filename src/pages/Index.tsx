import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { MessageCircle, Heart, Shield, Clock, Check, X, Send, ArrowRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Logo from "@/components/Logo";
import AccessSection from "@/components/AccessSection";

import heroLogo from "@/assets/see-here-logo.png";
import splitSafeSpace from "@/assets/split-safe-space.jpg";
import splitSupport from "@/assets/split-support.jpg";
import talkBubble from "@/assets/talk-bubble.png";
import replyBubble from "@/assets/reply-bubble.png";
import reflectBubble from "@/assets/reflect-bubble.png";
import quoteCard1 from "@/assets/quote-card-1.png";
import quoteCard2 from "@/assets/quote-card-2.png";
import quoteCard3 from "@/assets/quote-card-3.png";
import heroBgLeft from "@/assets/hero-bg-left.jpg";

// ─── Scroll animation wrapper ─────────────────────────────────────────────────
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

// ─── Disclosure modal (shared component) ──────────────────────────────────────
import DisclosureModalComponent from "@/components/DisclosureModal";

const HERO_PLACEHOLDERS = [
  "I keep replaying a conversation in my head...",
  "I'm feeling overwhelmed and can't switch off...",
  "Something happened and I need to talk it through...",
  "I feel stuck and don't know where to start...",
];

// ─── Main page ────────────────────────────────────────────────────────────────
const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [heroInput, setHeroInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    trackEvent("homepage_viewed");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show Admin link only for admin accounts
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  // Check if already accepted this session
  useEffect(() => {
    const accepted = sessionStorage.getItem("sh_disclosure_accepted");
    if (accepted) setDisclosureAccepted(true);
  }, []);

  // Rotate hero placeholder every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % HERO_PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

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
        sameAs: ["https://www.instagram.com/seehere.ai", "https://www.facebook.com/profile.php?id=61588016676425"],
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
              text: "SeeHere exists for the 'Missing Middle' of mental health. Traditional therapy is a big leap, and wellness apps often feel like homework. We offer a quiet, reflective space for when you aren't in crisis, but you're also not okay.",
            },
          },
          {
            "@type": "Question",
            name: "How much does it cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can start a session immediately — no sign-up needed. After 5 messages, we invite you to create a free account to save your conversation. You get 2 full sessions completely free. Beyond that, access is arranged through an organisation that offers SeeHere to its community, or personally with us — just get in touch. No subscriptions, no auto-renewals.",
            },
          },
          {
            "@type": "Question",
            name: "Is SeeHere.ai therapy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy.",
            },
          },
          {
            "@type": "Question",
            name: "Are my conversations confidential?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Your conversations are encrypted and private. We do not share your data with third parties.",
            },
          },
        ],
      },
    ]);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const handleTryForFree = () => {
    if (user) {
      navigate("/dashboard");
    } else if (!disclosureAccepted) {
      trackEvent("disclosure_shown", { trigger: "cta_button" });
      setShowDisclosure(true);
    } else {
      navigate("/try");
    }
  };

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setDisclosureAccepted(true);
    setShowDisclosure(false);
    trackEvent("disclosure_accepted");

    const val = heroInput.trim();
    if (val) {
      navigate("/try", { state: { initialMessage: val } });
    } else {
      navigate("/try");
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = heroInput.trim();
    if (!val) return;
    if (user) {
      navigate("/dashboard");
    } else if (!disclosureAccepted) {
      trackEvent("disclosure_shown", { trigger: "hero_submit" });
      setShowDisclosure(true);
    } else {
      navigate("/try", { state: { initialMessage: val } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-clip">
      {/* ── Disclosure modal ── */}
      {showDisclosure && <DisclosureModalComponent open={showDisclosure} onAccept={handleDisclosureAccept} onClose={() => setShowDisclosure(false)} />}

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-4 py-2 md:px-8 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <Logo />
        <div className="flex items-center gap-4">
          <a
            href="#access"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            For organisations
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            FAQs
          </a>
          <a
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Blog
          </a>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Admin
            </Link>
          )}
          {!loading &&
            (user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth" onClick={() => trackEvent("login_from_homepage")}>
                <button className="px-5 py-2 bg-[#4a7a4f]/10 rounded-2xl border border-[#4a7a4f]/20 shadow-sm text-[#3d3a35] text-sm font-medium hover:bg-[#4a7a4f]/20 transition-all duration-200">
                  Log in
                </button>
              </Link>
            ))}
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#cbb7ef]/20 via-[#f4eadf]/30 to-[#b1cfac]/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#cbb7ef]/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#b1cfac]/12 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#f4eadf]/30 blur-[100px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-1/3">
            <img
              src={heroBgLeft}
              alt=""
              className="absolute left-0 top-0 h-full w-full object-cover opacity-[0.12]"
              style={{
                maskImage: "linear-gradient(to left, transparent 0%, black 70%)",
                WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 70%)",
              }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center space-y-8">
          <div className="text-center space-y-4">
            <img src={heroLogo} alt="SeeHere" className="h-20 md:h-28 w-auto mx-auto" />
            <h1 className="font-serif font-light text-[#3d3a35] leading-[1.1] tracking-tight">
              <span className="block text-3xl md:text-5xl">A private space to talk.</span>
              <span className="block text-base md:text-xl mt-2 text-[#5f5a53] font-light">
                Built by therapists. Powered by AI.
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#5f5a53] font-bold bg-[#e8e0f0]/60 backdrop-blur-sm rounded-full px-6 py-3">
<span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#4a7a4f]" /> Two free sessions
                </span>
            <span className="w-px h-3 bg-[#3d3a35]/20 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#4a7a4f]" /> Encrypted &amp; private
            </span>
            <span className="w-px h-3 bg-[#3d3a35]/20 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#4a7a4f]" /> Available 24/7
            </span>
            <span className="w-px h-3 bg-[#3d3a35]/20 hidden sm:block" />
            <span className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#4a7a4f]" /> No subscriptions
            </span>
          </div>

          {user ? (
            <div className="w-full text-center space-y-4">
              <p className="text-[#5f5a53]">Welcome back. Your space is waiting.</p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-10 py-6 rounded-2xl text-base font-medium shadow-lg"
              >
                Continue your session
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto">
              <form onSubmit={handleHeroSubmit} className="relative group">
                <label htmlFor="hero-message" className="sr-only">
                  Share what's on your mind
                </label>
                <textarea
                  id="hero-message"
                  ref={textareaRef}
                  value={heroInput}
                  onChange={(e) => setHeroInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder={HERO_PLACEHOLDERS[placeholderIndex]}
                  rows={3}
                  className="w-full resize-none rounded-2xl border-2 border-[#4a7a4f]/40 bg-white/80 backdrop-blur-sm px-5 py-4 pr-14 text-base text-[#3d3a35] placeholder:text-[#3d3a35]/60 focus:outline-none focus:ring-4 focus:ring-[#4a7a4f]/20 focus:border-[#4a7a4f]/60 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:bg-white"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!heroInput.trim()}
                  className="absolute right-3 bottom-3 p-3.5 rounded-xl bg-[#4a7a4f] hover:bg-[#3d6542] text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>

              </form>
              <p className="mt-3 text-xs text-[#3d3a35]/50 italic text-center">
                ·{" "}
                <Link
                  to="/auth"
                  className="underline hover:text-[#3d3a35]/80 transition-colors"
                  onClick={() => trackEvent("login_from_homepage")}
                >
                  Have an account? Log in
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#3d3a35]">Discover more</span>
          <div className="w-px h-10 bg-[#3d3a35]/30" />
        </div>
      </section>

      {/* ── Missing middle ── */}
      <section className="py-20 px-6 bg-[#f4eadf]/30 text-center">
        <ScrollSection>
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">The missing middle</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35] leading-snug">
              You're not in crisis.
              <br />
              But you're also not okay.
            </h2>
            <p className="text-[#5f5a53] leading-relaxed text-base max-w-lg mx-auto">
              Traditional therapy feels like a big leap. Wellness apps feel like homework. SeeHere is the space in
              between — somewhere quiet to put the weight down.
            </p>
          </div>
        </ScrollSection>
      </section>

      {/* ── Split: Built by therapists ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div className="aspect-square md:aspect-auto md:min-h-[560px] overflow-hidden">
            <img src={splitSafeSpace} alt="Safe space for reflection" className="w-full h-full object-cover" />
          </div>
          <div className="bg-gradient-to-br from-[#f4eadf]/30 to-[#b1cfac]/20 flex items-center justify-end px-8 md:px-16 py-16 md:py-20">
            <ScrollSection>
              <div className="max-w-lg space-y-6 text-right ml-auto">
                <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">Our foundation</p>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35] leading-tight">
                  Built by people who understand
                </h2>
                <p className="text-[#5f5a53] leading-relaxed">
                  SeeHere was created by therapists who know how many people need space to think out loud — but don't
                  feel ready for, or can't easily access, traditional therapy.
                </p>
                <p className="text-[#5f5a53] leading-relaxed">
                  We combined evidence-based person-centred principles with AI to create a companion that listens
                  without judgment, reflects without fixing, and knows its limits.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-sm text-[#3d3a35] font-medium">Listens with empathy</p>
                    <Heart className="w-4 h-4 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-sm text-[#3d3a35] font-medium">Asks thoughtful questions</p>
                    <MessageCircle className="w-4 h-4 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 justify-end">
                    <p className="text-sm text-[#3d3a35] font-medium">Honest about what it is and isn't</p>
                    <Shield className="w-4 h-4 text-[#4a7a4f] flex-shrink-0" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={handleTryForFree}
                    className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-10 py-6 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  >
                    Start your first free session
                  </Button>
                </div>
              </div>
            </ScrollSection>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-24 px-6 md:px-12 bg-[#f4eadf]/20">
        <div className="max-w-5xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-16 space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">The process</p>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35]">How it works</h2>
            </div>
          </ScrollSection>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {[
              {
                n: "1",
                title: "Share what's on your mind",
                body: "Type freely in a private, text-based conversation. No scheduling, no forms, no pressure.",
                img: talkBubble,
                alt: "I just feel like I need someone to talk to",
                delay: 0,
              },
              {
                n: "2",
                title: "Receive empathic reflection",
                body: "Get thoughtful responses that help you feel heard and see your situation more clearly.",
                img: replyBubble,
                alt: "I'm glad you reached out — I'm here",
                delay: 100,
              },
              {
                n: "3",
                title: "Build your inner record",
                body: "Your companion remembers previous conversations, helping you notice patterns in your thinking over time.",
                img: reflectBubble,
                alt: "Time to reflect",
                delay: 200,
              },
            ].map((card) => (
              <ScrollSection key={card.n} delay={card.delay} className="h-full">
                <div className="group flex flex-col items-center text-center p-7 rounded-2xl bg-white/60 backdrop-blur border border-white/70 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-full bg-[#4a7a4f]/10 flex items-center justify-center mb-5 text-lg font-serif text-[#4a7a4f] group-hover:bg-[#4a7a4f]/20 transition-colors duration-300">
                    {card.n}
                  </div>
                  <h3 className="text-base font-serif font-light text-[#3d3a35] mb-3">{card.title}</h3>
                  <p className="text-sm text-[#5f5a53] leading-relaxed">{card.body}</p>
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-full h-auto max-h-[160px] object-contain rounded mt-5"
                  />
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── What / not what ── */}
      <section className="py-20 px-6 bg-[#3d3a35] text-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif font-light">Clear about what we are</h2>
              <p className="text-[#f8f6f3]/60 text-sm">And what we're not.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#4a7a4f] font-medium mb-5">SeeHere is</p>
                {[
                  "A space to think out loud",
                  "Person-centred and empathic",
                  "Available whenever you need it",
                  "Honest about being AI",
                  "A bridge toward professional support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#4a7a4f] flex-shrink-0" />
                    <span className="text-sm text-[#f8f6f3]/80">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#f8f6f3]/40 font-medium mb-5">SeeHere is not</p>
                {[
                  "A therapy service",
                  "A crisis or emergency service",
                  "A diagnostic tool",
                  "A subscription you'll forget about",
                  "Designed to keep you coming back",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <X className="w-4 h-4 text-[#f8f6f3]/30 flex-shrink-0" />
                    <span className="text-sm text-[#f8f6f3]/50">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollSection>
      </section>

      {/* ── Split: What you'll experience ── */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-[#cbb7ef]/15 to-[#f4eadf]/20 flex items-center px-8 md:px-16 py-16 md:py-20 order-2 md:order-1">
            <ScrollSection>
              <div className="max-w-lg space-y-6">
                <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">The experience</p>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35] leading-tight">
                  What you will experience
                </h2>
                <p className="text-[#5f5a53] leading-relaxed">
                  Warmth, understanding, and room to breathe. Grounded in person-centred principles.
                </p>
                <div className="space-y-5 pt-2">
                  <div>
                    <h3 className="text-sm font-medium text-[#3d3a35] mb-1.5 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#4a7a4f]" /> Person-centred listening
                    </h3>
                    <p className="text-sm text-[#5f5a53] leading-relaxed">
                      Based on unconditional positive regard. You are accepted fully, without judgment.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#3d3a35] mb-1.5 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#4a7a4f]" /> Gentle, practical support
                    </h3>
                    <p className="text-sm text-[#5f5a53] leading-relaxed">
                      Psychologically informed techniques offered as invitations, never prescriptions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#3d3a35] mb-1.5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#4a7a4f]" /> Your pace, your space
                    </h3>
                    <p className="text-sm text-[#5f5a53] leading-relaxed">
                      No pressure. No rush. You decide when and how to engage.
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    size="lg"
                    onClick={handleTryForFree}
                    className="bg-[#4a7a4f] hover:bg-[#3d6542] text-white px-10 py-6 text-sm font-medium shadow-lg rounded-2xl"
                  >
                    Start your first free session
                  </Button>
                </div>
              </div>
            </ScrollSection>
          </div>
          <div className="aspect-square md:aspect-auto md:min-h-[560px] overflow-hidden order-1 md:order-2">
            <img src={splitSupport} alt="Calm and supportive environment" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── Quote cards ── */}
      <section className="relative py-20 px-6 bg-[#f8f6f3]">
        <ScrollSection>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <img
              src={quoteCard1}
              alt="Reflective space quote"
              className="w-full h-auto object-cover rounded-2xl shadow-md"
            />
            <img src={quoteCard2} alt="Founder quote" className="w-full h-auto object-cover rounded-2xl shadow-md" />
            <img src={quoteCard3} alt="User quote" className="w-full h-auto object-cover rounded-2xl shadow-md" />
          </div>
        </ScrollSection>
      </section>

      {/* ── Access ── */}
      <AccessSection onTryForFree={handleTryForFree} />

      {/* ── Safety notice ── */}
      <div className="bg-[#f4eadf]/50 border-y border-border/30 py-3 px-6 text-center">
        <p className="text-sm text-[#3d3a35]">
          In crisis? Contact{" "}
          <a
            href="tel:116123"
            className="underline underline-offset-2 hover:text-[#4a7a4f] transition-colors font-semibold"
          >
            Samaritans: 116 123
          </a>{" "}
          or text SHOUT to 85258. SeeHere is not a crisis service.
        </p>
      </div>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-20 px-6 md:px-12">
        <ScrollSection>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">Questions</p>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35]">Common questions</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                {
                  value: "why",
                  q: "Why SeeHere?",
                  a: `SeeHere exists for the "Missing Middle" of mental health. Traditional therapy is a big leap, and wellness apps often feel like homework. We offer a quiet, reflective space for when you aren't in crisis, but you're also not okay. No programmes, no progress tracking — just a space to think out loud.`,
                },
                {
                  value: "cost",
                  q: "How much does it cost?",
                  a: `You can start a session immediately — no sign-up needed. After 5 messages, we invite you to create a free account to save your conversation. You get 2 full sessions completely free. Beyond that, access is arranged either through an organisation that offers SeeHere to its community, or personally with us — just get in touch. No subscriptions, no auto-renewals.`,
                },
                {
                  value: "therapy",
                  q: "Is this therapy?",
                  a: `No. SeeHere is a reflective space grounded in person-centred principles, not a substitute for professional therapy. It offers empathic conversation and gentle techniques to help you process thoughts and feelings, but it does not provide diagnoses, treatment plans, or clinical intervention.`,
                },
                {
                  value: "how",
                  q: "How does it work?",
                  a: `SeeHere uses AI trained in person-centred principles to provide gentle reflections through text-based conversations. The AI remembers your previous conversations, building continuity and understanding over time — helping you explore your feelings with deeper context.`,
                },
                {
                  value: "confidential",
                  q: "Are my conversations confidential?",
                  a: `Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space.`,
                },
                {
                  value: "who",
                  q: "Who is this for?",
                  a: `Anyone looking for a quiet, judgment-free space to reflect. Whether you're navigating a difficult time, working through everyday stress, or simply want to understand yourself better.`,
                },
                {
                  value: "crisis",
                  q: "What if I'm struggling or in crisis?",
                  a: `SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.`,
                },
              ].map(({ value, q, a }) => (
                <AccordionItem key={value} value={value} className="border-b border-border/30 pb-2">
                  <AccordionTrigger className="text-lg md:text-xl font-serif font-light text-[#3d3a35] hover:no-underline text-left py-4">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#5f5a53] leading-relaxed pt-1 pb-4">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollSection>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6 text-center border-t border-border/30 bg-[#f8f6f3]">
        <div className="relative z-10 space-y-6">
          <div className="pt-4 border-t border-border/20 max-w-2xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/contact", label: "Contact Us" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-[#5f5a53]/70 hover:text-[#3d3a35] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-xs text-[#5f5a53]/60 max-w-md mx-auto leading-relaxed pt-2">
            See Here is committed to digital accessibility (WCAG 2.1 AA). If you experience any barriers, contact{" "}
            <a href="mailto:hello@seehere.ai" className="underline hover:text-[#3d3a35] transition-colors">
              hello@seehere.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
