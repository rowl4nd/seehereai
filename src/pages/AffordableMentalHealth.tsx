import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const AffordableMentalHealth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Affordable Mental Health Support in the UK | SeeHere";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Private therapy can cost £60–£150 a session. Here's an honest look at affordable mental health support options in the UK when that's simply not possible.";
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
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: "#4a7a4f18", color: "#4a7a4f" }}>Cost & Access</span>
              <span className="text-xs" style={{ color: "#8a8278" }}>5 min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-light leading-tight" style={{ color: "#3d3a35" }}>Affordable Mental Health Support in the UK</h1>
            <p className="text-lg leading-relaxed" style={{ color: "#5f5a53" }}>Private therapy can cost £60–£150 a session. Here's an honest look at what's available when that's simply not an option.</p>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="space-y-7 text-base leading-relaxed" style={{ color: "#3d3a35" }}>
            <p>The cost of mental health support in the UK is, frankly, not talked about enough. If you can afford private therapy, it's genuinely excellent — a skilled therapist at £70–£150 a session can be life-changing. But for most people, that kind of regular outlay simply isn't possible.</p>
            <p style={{ color: "#5f5a53" }}>And the NHS, while free at the point of use, comes with waiting lists that can stretch for months. So what do you do if you need support now and can't afford to pay full price?</p>
            <p>Here's an honest rundown of the options — including some that are less well known.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>NHS Talking Therapies (free, but there's a wait)</h2>
            <p>NHS Talking Therapies — formerly known as IAPT — offers free CBT and other evidence-based therapies for anxiety and depression. You can self-refer in most parts of England without going through your GP.</p>
            <p style={{ color: "#5f5a53" }}>If you haven't already self-referred, it's worth doing so now even if you're also exploring other options.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>Trainee therapists (low cost, often excellent)</h2>
            <p>Therapists in training charge significantly less than qualified therapists, often £15–£35 a session, and are supervised throughout by an experienced practitioner.</p>
            <p style={{ color: "#5f5a53" }}>You can find trainee therapists through counselling training colleges, the BACP therapist directory, and platforms like Counselling Directory.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>Charities and community organisations</h2>
            <p>Many mental health charities offer free or low-cost counselling. Mind, Samaritans, Cruse (bereavement), and Rape Crisis are among the better-known ones.</p>
            <p style={{ color: "#5f5a53" }}>It's worth searching "[your area] free counselling" or checking the Hub of Hope directory.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>Sliding scale private therapy</h2>
            <p>Many private therapists offer reduced rates for people on lower incomes — they just don't advertise it prominently. It's always worth asking.</p>

            <h2 className="text-2xl font-serif font-light pt-4" style={{ color: "#3d3a35" }}>For the in-between moments</h2>
            <p>Therapy — even low-cost therapy — is typically once a week at most. That leaves a lot of days in between when you might be struggling and have nowhere to put it.</p>
            <p style={{ color: "#5f5a53" }}>SeeHere was built for exactly that gap. It's not a replacement for therapy, but it's a private, person-centred space available whenever you need it.</p>

            <blockquote className="border-l-4 pl-6 py-1 italic" style={{ borderColor: "#4a7a4f40", color: "#5f5a53" }}>"You don't need to choose between getting help and paying your bills. There are options — they just take a bit of knowing where to look."</blockquote>
          </div>

          <hr style={{ borderColor: "#e8e1d9" }} />

          <div className="text-center space-y-5 py-8">
            <p className="text-lg font-serif font-light" style={{ color: "#3d3a35" }}>Start with two free sessions.</p>
            <p className="text-sm" style={{ color: "#5f5a53" }}>No account needed, no waiting list, no pressure.</p>
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

export default AffordableMentalHealth;
