import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DisclosureModal from "@/components/DisclosureModal";
import Logo from "@/components/Logo";

const posts = [
  {
    slug: "/blog/nhs-waiting-list",
    title: "Struggling While You Wait for NHS Therapy",
    description:
      "Waiting months for support when you need it now is one of the hardest positions to be in. Here's what you can do in the meantime.",
    tag: "NHS & Access",
    readTime: "4 min read",
  },
  {
    slug: "/blog/affordable-mental-health-support",
    title: "Affordable Mental Health Support in the UK",
    description:
      "Private therapy can cost £60–£150 a session. Here's an honest look at what's available when that's simply not possible.",
    tag: "Cost & Access",
    readTime: "5 min read",
  },
  {
    slug: "/blog/ai-emotional-support",
    title: "What is AI Emotional Support — and Can It Actually Help?",
    description:
      "AI for mental health is everywhere right now. Here's what it can and can't do — and what makes some approaches more grounded than others.",
    tag: "Understanding AI",
    readTime: "5 min read",
  },
  {
    slug: "/blog/anxiety-support",
    title: "Support for Everyday Anxiety When You're Not in Crisis",
    description:
      "Anxiety that doesn't feel 'bad enough' for professional help is still anxiety. You don't need to be at rock bottom to deserve support.",
    tag: "Anxiety",
    readTime: "4 min read",
  },
  {
    slug: "/blog/talking-to-someone",
    title: "Need Someone to Talk To? You Don't Have to Wait",
    description:
      "Sometimes you just need to say it out loud. Here's why that instinct is worth listening to — and where to go when you feel it.",
    tag: "Getting Support",
    readTime: "3 min read",
  },
  {
    slug: "/mental-clarity",
    title: "Beyond Journaling: A Space to Find Your Own Answers",
    description: "Most AI wants to give you answers. SeeHere is designed to help you hear your own.",
    tag: "Reflection",
    readTime: "3 min read",
  },
  {
    slug: "/work-stress",
    title: "When Work Feels Like a Burden You Can't Share",
    description: "A private, secure space to process professional burnout without it ever leaving the room.",
    tag: "Work & Stress",
    readTime: "3 min read",
  },
  {
    slug: "/support-alternative",
    title: "Not in Crisis but Struggling? Therapy Alternatives",
    description:
      "Bridging the gap between noticing a struggle and finding a space to talk. SeeHere is the missing middle.",
    tag: "Therapy Alternatives",
    readTime: "5 min read",
  },
];

const Blog = () => {
  const [showDisclosure, setShowDisclosure] = useState(false);
  const navigate = useNavigate();

  const handleDisclosureAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    setShowDisclosure(false);
    navigate("/try");
  };
  useEffect(() => {
    document.title = "SeeHere Journal | Emotional Wellbeing Guides & Support";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content =
      "Honest, practical guides on emotional wellbeing, mental health support in the UK, and how to find help when you're not okay but not in crisis.";
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
        <button
          onClick={() => setShowDisclosure(true)}
          className="text-sm font-medium transition-colors"
          style={{ color: "#4a7a4f" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3d6542")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4a7a4f")}
        >
          Try SeeHere free →
        </button>
      </header>

      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="mb-16 space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] font-medium" style={{ color: "#4a7a4f" }}>
              The SeeHere Journal
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>
              Honest guides for the space between fine and not okay.
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#5f5a53" }}>
              No programmes. No pressure. Just useful, grounded writing on emotional wellbeing and finding support in
              the UK.
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-px">
            {posts.map((post, i) => (
              <Link
                key={post.slug}
                to={post.slug}
                className="group block py-8 border-b transition-all duration-200"
                style={{ borderColor: "#e8e1d9" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}
                      >
                        {post.tag}
                      </span>
                      <span className="text-xs" style={{ color: "#8a8278" }}>
                        {post.readTime}
                      </span>
                    </div>
                    <h2
                      className="text-xl md:text-2xl font-serif font-light leading-snug transition-colors duration-200"
                      style={{ color: "#3d3a35" }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "#5f5a53" }}>
                      {post.description}
                    </p>
                  </div>
                  <div
                    className="text-sm shrink-0 mt-1 transition-all duration-200 group-hover:translate-x-1"
                    style={{ color: "#4a7a4f" }}
                  >
                    Read →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 pt-12 border-t text-center space-y-5" style={{ borderColor: "#e8e1d9" }}>
            <p className="text-sm" style={{ color: "#5f5a53" }}>
              Reading about support is a good start. Taking a step is better.
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
              No account needed to start. Fully private.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: "#e8e1d9" }}>
        <p className="text-xs" style={{ color: "#8a8278" }}>
          © {new Date().getFullYear()} See Here Ltd. SeeHere is a reflective AI, not a clinical or emergency service.
        </p>
      </footer>
    </div>
  );
};

export default Blog;
