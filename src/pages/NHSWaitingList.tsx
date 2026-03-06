import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import DisclosureModal from "@/components/DisclosureModal";

const NHSWaitingList = () => {
  const [showDisclosure, setShowDisclosure] = useState(false);
  const navigate = useNavigate();

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  useEffect(() => {
    document.title = "Struggling While You Wait for NHS Therapy | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Waiting months for NHS therapy when you need support now is one of the hardest positions to be in. Here's what you can do in the meantime.";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      <DisclosureModal open={showDisclosure} onAccept={handleDisclosureAccept} />
      {/* Header */}
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
          {/* Article header */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}
              >
                NHS & Access
              </span>
              <span className="text-xs" style={{ color: "#8a8278" }}>
                4 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Struggling While You Wait for NHS Therapy
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>
              Waiting months for support when you need it now is one of the hardest positions to be in. Here's an honest
              look at what that wait actually feels like — and what you can do in the meantime.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          {/* Article body */}
          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>
              You did the hard thing. You asked for help. You went to your GP, described how you were feeling — possibly
              for the first time to anyone — and were told you'd been referred for talking therapy. That took courage.
            </p>

            <p>And then you were told the wait would be somewhere between three and eighteen months.</p>

            <p style={{ color: "#5f5a53" }}>
              According to NHS data, nearly 1.7 million people in England are currently on a waiting list for mental
              health treatment. Tens of thousands of those have been waiting for over a year. The system is under
              extraordinary pressure, and none of that is your fault. But knowing that doesn't make the wait any easier.
            </p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What the wait actually does to you
            </h2>

            <p>
              There's a particular kind of difficulty that comes with being in the waiting period. You're not getting
              worse in a way that feels "urgent enough" to call a crisis line. But you're also not okay. You're just...
              holding on. Trying to keep the lid on things until your name comes up on a list.
            </p>

            <p>
              The problem is that keeping the lid on things takes enormous energy. It can affect your sleep, your
              relationships, your ability to concentrate at work. And because you've already been told help is coming,
              it can feel wrong to complain — like you should just be grateful to be on the list at all.
            </p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>
              "You don't need to be in crisis to deserve support. The space between 'fine' and 'crisis' is exactly where
              most of us spend our hardest days."
            </blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              What you can do while you wait
            </h2>

            <p>
              There are a few genuinely useful options — not as replacements for the therapy you're waiting for, but as
              ways to carry less weight in the meantime.
            </p>

            <div className="space-y-6 pl-1">
              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Talk to someone regularly
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  This sounds obvious but it's the most important one. Thoughts that stay inside your head circle and
                  grow. Getting them out — even imperfectly — helps. This can be a trusted friend, a support group, or a
                  private digital space if you're not ready to talk to someone you know.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Use self-referral services
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  NHS Talking Therapies (formerly IAPT) allows self-referral in most areas of England — you don't need
                  to go through your GP. If your GP referred you a while ago, it's worth checking whether you can also
                  self-refer to access support sooner, or to join a different pathway.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Look at low-cost therapy options
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  Organisations like the BACP directory, Counselling Directory, and Psychology Today list qualified
                  therapists including those who offer reduced fees. Trainee therapists working toward accreditation
                  often offer very low-cost sessions — they're supervised and often excellent.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#3d3a35" }}>
                  Find a reflective space for the in-between moments
                </h3>
                <p style={{ color: "#5f5a53" }}>
                  You don't need a full therapy session to process how you're feeling. Sometimes you just need somewhere
                  to put the thoughts that are piling up. SeeHere was built specifically for this — a private,
                  person-centred AI companion for the days when you need to think out loud and there's nobody available
                  to listen.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>
              A note on crisis support
            </h2>

            <p>
              If at any point the wait feels unsurvivable — please don't manage that alone. Samaritans are available 24
              hours a day on{" "}
              <a href="tel:116123" className="underline" style={{ color: "#4a7a4f" }}>
                116 123
              </a>
              , or you can text SHOUT to 85258. Your GP can also refer you to urgent mental health support if your
              situation changes.
            </p>

            <p style={{ color: "#5f5a53" }}>
              The wait is hard. But you don't have to carry all of it alone until your appointment comes.
            </p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          {/* CTA */}
          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>
              A quiet space while you wait.
            </p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              SeeHere is free to try — no account needed, no waiting list.
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: "#4a7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}
            >
              Try 2 free sessions
            </Link>
            <p className="text-xs" style={{ color: "#8a8278" }}>
              Fully private · Built by therapists · No subscription
            </p>
          </div>

          {/* Back to blog */}
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
          <a href="tel:116123" className="underline">
            Samaritans: 116 123
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default NHSWaitingList;
