import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import cePhoto from "@/assets/ce-photo.jpg";

const FounderStory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Meet Ce — The Therapist Behind SeeHere | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Ce Gregory is a Former BACP-accredited counsellor with decades of clinical experience. She built SeeHere because she believed AI could be a genuine force for good.";
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
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 shadow-lg">
              <img src={cePhoto} alt="Ce Gregory, founder of SeeHere" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}>Our founder</span>
              <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>Hi. I'm Ce.</h1>
              <p className="text-sm" style={{ color: "#8a8278" }}>Former BACP Accredited Counsellor · Advanced Diploma Psychological Trauma · 25+ years in practice</p>
            </div>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>Throughout my career as a counsellor, one thing stayed with me long after every session ended: the people who never came through the door.</p>
            <p style={{ color: "#5f5a53" }}>The ones who needed support but couldn't afford it. The ones who were on a waiting list and quietly gave up. The ones who felt their problems weren't serious enough to warrant a therapist's time.</p>
            <p style={{ color: "#5f5a53" }}>I spent over two decades in clinical practice — as a school counsellor, as Clinical Lead at a rape and sexual abuse centre, as a supervisor of other therapists, and in private practice.</p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>"All of us, at different times in our lives, need somewhere to put our thoughts. Somewhere to hear ourselves think."</blockquote>

            <p style={{ color: "#5f5a53" }}>When I retired from clinical practice, I didn't stop thinking about those people. And then I started paying attention to AI.</p>
            <p style={{ color: "#5f5a53" }}>I'll be honest — my first reaction was scepticism. But I kept looking. And what I found surprised me.</p>
            <p style={{ color: "#5f5a53" }}>When AI is built carefully — when it's grounded in real therapeutic principles, when it knows its limits — it can offer something genuine. Not therapy. Not a replacement for human connection. But a real, thoughtful space to think out loud.</p>
            <p style={{ color: "#5f5a53" }}>So I built SeeHere. Every aspect of how SeeHere behaves in conversation is grounded in the same Person-Centred principles that I've applied in practice for twenty-five years.</p>
            <p style={{ color: "#5f5a53" }}>SeeHere isn't perfect — no form of support is. But it's honest, it's careful, and it's built with a depth of clinical understanding that generic AI simply doesn't have.</p>
            <p className="font-medium" style={{ color: "#3d3a35" }}>— Ce Gregory, Founder</p>
          </div>

          <div className="rounded-2xl p-8 space-y-4" style={{ backgroundColor: "#f1ede8" }}>
            <h2 className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>Ce's background</h2>
            <ul className="space-y-2.5 text-sm" style={{ color: "#5f5a53" }}>
              {[
                "MBACP Accredited — British Association for Counselling and Psychotherapy",
                "MSc Psychological Trauma — University of Chester",
                "BSc (Hons) Psychology — Open University",
                "Advanced Diploma in Supervision — PCCS",
                "Registered EMDR Practitioner",
                "Diploma in Counselling, CBT, and Person-Centred Therapy",
                "Clinical Lead — RASA Merseyside (2012–2014)",
                "School Counsellor — Calday Grange Grammar School (2000–2012)",
                "25+ years in private counselling and supervision practice",
                "Trainer — Rape Crisis England and Wales (2014–present)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#4a7a4f" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>Experience what Ce built.</p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>Two free sessions. No account needed. No waiting list.</p>
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

export default FounderStory;
