import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const TalkingToSomeone = () => {
  useEffect(() => {
    document.title = "Need Someone to Talk To? You Don't Have to Wait | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Sometimes you just need to say it out loud. Here's why that instinct is worth listening to — and where to go when you feel it.";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
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
                Getting Support
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                3 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Need Someone to Talk To? You Don't Have to Wait.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              Sometimes you just need to say it out loud. Here's why that instinct is worth listening to — and where to
              go when you feel it.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>
              There's a moment — maybe late at night, maybe in the middle of a perfectly ordinary day — when something
              in you just needs to say it. Whatever it is. Not to fix it, not to get advice. Just to say it to someone
              and have them hear it.
            </p>

            <p style={{ color: "#5f5a53" }}>
              That instinct is worth paying attention to. It's your mind asking for something it genuinely needs.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              Why being heard matters so much
            </h2>

            <p>
              There's a reason talking therapy has been the foundation of mental health treatment for over a century.
              The act of putting feelings into words — and having someone receive those words without judgment — does
              something that no amount of thinking alone can do.
            </p>

            <p style={{ color: "#5f5a53" }}>
              It externalises what's internal. It makes the shapeless thing take a shape. And in that process, something
              often shifts. Not because the problem is solved, but because you're no longer alone with it.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              The problem with waiting
            </h2>

            <p>
              Most of us wait too long. We tell ourselves it's not serious enough, that we should be able to handle it,
              that other people have it worse. We wait until we're really struggling before we let ourselves reach out.
            </p>

            <p style={{ color: "#5f5a53" }}>
              But support works best before you're at the edge. The moment you notice you need to talk to someone is
              exactly the right moment — not after another three weeks of carrying it alone.
            </p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "The moment you notice you need to talk to someone is exactly the right moment. Not later. Now."
            </blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              Where to go
            </h2>

            <div className="space-y-5 pl-1">
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Someone you trust
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  If there's a friend or family member you feel safe with, that's always the first place. You don't need
                  to have it figured out before you reach out. "I just need to talk" is enough.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Samaritans
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Available 24 hours on{" "}
                  <a href="tel:116123" className="underline" style={{ color: "#4a7a4f" }}>
                    116 123
                  </a>
                  . Not just for crisis — for anyone who needs to talk. Free, confidential, no judgment.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Your GP
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  If what you're carrying has been there for a while, a GP appointment is a good step. They can refer
                  you to NHS Talking Therapies or other local support.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  SeeHere
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  If it's late, if you're not ready to talk to someone you know, or if you just need somewhere to put it
                  right now — SeeHere is a private, person-centred AI companion available immediately. No waiting, no
                  scheduling, no account needed to start. Just a quiet space to say it out loud.
                </p>
              </div>
            </div>

            <p>
              You don't need to wait until it's bad enough. You don't need a reason beyond "I need to talk to someone."
              That's enough. It's always been enough.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              Someone is here. Right now.
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Two free sessions. No account needed. No waiting.
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Try SeeHere free
            </Link>
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

export default TalkingToSomeone;
