import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const AnxietySupport = () => {
  const [showDisclosure, setShowDisclosure] = useState(false);
  const navigate = useNavigate();

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  useEffect(() => {
    document.title = "Support for Everyday Anxiety When You're Not in Crisis | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Anxiety that doesn't feel bad enough for professional help is still anxiety. You don't need to be at rock bottom to deserve support.";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      <DisclosureModal open={showDisclosure} onAccept={handleDisclosureAccept} />
      <header
        className="sticky top-0 z-50 border-b px-4 py-2 md:px-8 flex items-center justify-between"
        style={{ backgroundColor: "#f8f6f3", borderColor: "#e8e1d9" }}
      >
        <Logo />
        <Link
          to="/blog"
          className="text-sm transition-colors"
          style={{ color: "#8a8278" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
        >
          ← All articles
        </Link>
      </header>

      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}
              >
                Anxiety
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                4 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Support for Everyday Anxiety When You're Not in Crisis
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              Anxiety that doesn't feel "bad enough" for professional help is still anxiety. You don't need to be at
              rock bottom to deserve support.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>
              There's a particular kind of anxiety that's very hard to get help for. It's not dramatic. It doesn't stop
              you functioning. You go to work, you see your friends, you get through the day. But underneath all of it,
              there's a constant low hum of dread. A tightness that doesn't quite go away.
            </p>

            <p style={{ color: "#5f5a53" }}>
              When you try to describe it to someone, it sounds manageable. "I just feel a bit on edge." "I overthink
              things." "I can't really switch off." The words don't capture the weight of it. And so you carry it
              quietly, telling yourself it's not bad enough to warrant proper help.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              The problem with "not bad enough"
            </h2>

            <p>
              The mental health system — through no fault of the people working in it — is largely designed around
              crisis. Waiting lists prioritise those in the most acute need. GP appointments are short. The implicit
              message, unintentional as it is, can feel like: come back when it's worse.
            </p>

            <p style={{ color: "#5f5a53" }}>
              But anxiety that's left unaddressed doesn't usually stay at the same level. The thoughts that keep you
              awake at 2am have a way of expanding. And the longer you carry something alone, the heavier it gets.
            </p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "You don't need to be at rock bottom to deserve a space to breathe. Everyday anxiety is real, and it
              deserves to be taken seriously."
            </blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What actually helps
            </h2>

            <p>
              The research on anxiety is fairly consistent: avoidance makes it worse, and engagement makes it better.
              Not forcing yourself to confront your fears before you're ready — but gently, consistently, not letting
              the anxiety win by staying silent.
            </p>

            <div className="space-y-5 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Name it
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Something as simple as putting your anxiety into words — "I'm worried about X because Y" — activates a
                  different part of the brain to the one that's spinning. Labelling an emotion reduces its intensity.
                  This is one reason talking (or writing) about anxiety helps even when nothing changes practically.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Distinguish the worry from the fact
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  A lot of anxiety is anticipatory — it's about what might happen rather than what is happening. Gently
                  separating "what I'm worried about" from "what I know to be true right now" can loosen its grip. A
                  good therapist helps you do this. So can a structured reflective conversation.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Find somewhere to put it
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Anxiety grows in silence and isolation. Even an imperfect outlet — a journal, a trusted friend, a
                  private AI space — is better than carrying it alone. The act of externalising it, getting it out of
                  your head and into words, is where the relief usually starts.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              When to seek more support
            </h2>

            <p>
              If your anxiety is significantly affecting your daily life — your sleep, your relationships, your ability
              to work — it's worth speaking to your GP and asking for a referral to NHS Talking Therapies. You can also
              self-refer in most parts of England.
            </p>

            <p style={{ color: "#5f5a53" }}>
              If you're in a moment of acute distress, Samaritans are available 24 hours on{" "}
              <a href="tel:116123" className="underline" style={{ color: "#4a7a4f" }}>
                116 123
              </a>
              .
            </p>

            <p>
              For the everyday hum of it — the nights when your mind won't settle, the days when the weight feels
              heavier than usual — SeeHere offers a private, person-centred space to think it through. Not to fix it.
              Just to be heard.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              Somewhere quiet to put it down for a moment.
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Two free sessions. No account needed.
            </p>
            <button
              onClick={() => setShowDisclosure(true)}
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Try SeeHere free
            </button>
            <p className="text-xs" style={{ color: "#8a8278" }}>
              Fully private · Built by therapists · No subscription
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/blog"
              className="text-sm transition-colors"
              style={{ color: "#8a8278" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: "#e8e1d9" }}>
        <p className="text-xs" style={{ color: "#8a8278" }}>
          © {new Date().getFullYear()} See Here Ltd. SeeHere is a reflective AI, not a clinical or emergency service.{" "}
          <a href="tel:116123" className="underline" style={{ color: "#8a8278" }}>
            Samaritans: 116 123
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default AnxietySupport;
