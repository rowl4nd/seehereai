import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const AIEmotionalSupport = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "What is AI Emotional Support — and Can It Actually Help? | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "AI for mental health is everywhere right now. Here's what it can and can't do — and what makes some approaches more grounded than others.";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      <header className="sticky top-0 z-50 border-b px-4 py-2 md:px-8 flex items-center justify-between" style={{ backgroundColor: "#f8f6f3", borderColor: "#e8e1d9" }}>
        <Logo />
        <Link to="/blog" className="text-sm transition-colors" style={{ color: "#8a8278" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")} onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}>← All articles</Link>
      </header>

      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}>Understanding AI</span>
              <span className="text-xs" style={{ color: "#8a8278" }}>5 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>What is AI Emotional Support — and Can It Actually Help?</h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>AI for mental health is everywhere right now. Here's an honest look at what it can and can't do — and what makes some approaches more grounded than others.</p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>If you've typed how you're feeling into ChatGPT at 2am, you're not alone. Millions of people are quietly using general-purpose AI tools for emotional support.</p>
            <p style={{ color: "#5f5a53" }}>The question is: does it actually help? And is all AI emotional support the same?</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>What AI can genuinely offer</h2>
            <p>There are a few things AI does surprisingly well. It's available immediately, at any hour. It doesn't get tired, distracted, or uncomfortable with difficult topics. It doesn't make you feel like a burden.</p>
            <p style={{ color: "#5f5a53" }}>The act of articulating a feeling — putting it into words, even to a machine — has genuine psychological value.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>What AI cannot do</h2>
            <p>AI cannot assess clinical risk. It cannot diagnose. It cannot provide therapy in any meaningful clinical sense.</p>
            <p style={{ color: "#5f5a53" }}>General-purpose AI wasn't designed for this context. It's optimised for helpfulness and engagement, not for careful, boundaried support.</p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>"Not all AI emotional support is the same. The difference between a general chatbot and a purpose-built wellbeing companion matters — especially when you're struggling."</blockquote>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>What makes a grounded approach different</h2>
            <p>Purpose-built AI wellbeing tools approach the conversation differently. The best ones are:</p>
            <div className="space-y-4 pl-1">
              <div className="space-y-1"><h3 className="font-medium" style={{ color: "#3d3a35" }}>Honest about what they are</h3><p style={{ color: "#5f5a53" }}>They don't pretend to be human or encourage dependency.</p></div>
              <div className="space-y-1"><h3 className="font-medium" style={{ color: "#3d3a35" }}>Grounded in therapeutic principles</h3><p style={{ color: "#5f5a53" }}>Built on person-centred or CBT frameworks rather than general conversational AI.</p></div>
              <div className="space-y-1"><h3 className="font-medium" style={{ color: "#3d3a35" }}>Designed for wellbeing, not engagement</h3><p style={{ color: "#5f5a53" }}>Good AI emotional support isn't trying to keep you on the platform as long as possible.</p></div>
            </div>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>Where SeeHere fits</h2>
            <p>SeeHere was built by therapists specifically for the "missing middle" — people who are struggling but not in crisis.</p>
            <p style={{ color: "#5f5a53" }}>It won't replace a good therapist. But for the moments when you just need to be heard — and there's nobody available to listen — it's something real.</p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>See what grounded AI support feels like.</p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>Two free sessions. No account needed.</p>
            <button onClick={() => navigate("/try")} className="inline-block px-10 py-4 rounded-2xl text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: "#4a7a4f" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3d6542")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4a7a4f")}>Try SeeHere free</button>
            <p className="text-xs" style={{ color: "#8a8278" }}>Fully private · Built by therapists · No subscription</p>
          </div>

          <div className="pt-4">
            <Link to="/blog" className="text-sm transition-colors" style={{ color: "#8a8278" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#3d3a35")} onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}>← Back to all articles</Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: "#e8e1d9" }}>
        <p className="text-xs" style={{ color: "#8a8278" }}>© {new Date().getFullYear()} See Here Ltd. SeeHere is a reflective AI, not a clinical or emergency service. <a href="tel:116123" className="underline" style={{ color: "#8a8278" }}>Samaritans: 116 123</a>.</p>
      </footer>
    </div>
  );
};

export default AIEmotionalSupport;
