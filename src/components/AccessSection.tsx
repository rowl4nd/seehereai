import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AccessSectionProps {
  onTryForFree?: () => void;
}

/**
 * Self-contained "how access works" section.
 * Kept standalone so it can later be lifted into a dedicated /organisations page
 * or per-partner routes without a rewrite.
 */
const AccessSection = ({ onTryForFree }: AccessSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="access"
      className="py-20 px-6 bg-gradient-to-br from-[#cbb7ef]/15 via-[#f4eadf]/20 to-[#b1cfac]/15"
    >
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-[#4a7a4f] font-medium">Access</p>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#3d3a35]">
            Two free sessions for anyone. Beyond that, access is arranged with us.
          </h2>
          <p className="text-[#5f5a53] leading-relaxed">
            SeeHere isn't sold by the session. Continued access comes either through an organisation offering it to
            their community, or personally, arranged directly with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-10">
          {/* Organisation access */}
          <div className="p-8 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm space-y-4 flex flex-col">
            <h3 className="text-xl font-serif font-light text-[#3d3a35]">Access through your organisation</h3>
            <p className="text-sm text-[#5f5a53] leading-relaxed flex-1">
              Charities, universities and employers can offer SeeHere to the people they support — a quiet,
              person-centred space to think out loud, available between appointments and outside office hours. Staff
              and service users are given an access code, which unlocks full sessions on their own private account.
            </p>
            <div className="space-y-3 pt-1">
              <Link to="/auth" className="block">
                <Button className="w-full bg-[#4a7a4f] hover:bg-[#3d6542] text-white rounded-2xl py-6 text-sm font-medium">
                  I have an access code
                </Button>
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-[#4a7a4f] hover:text-[#3d6542] underline underline-offset-4 transition-colors"
              >
                Interested in offering SeeHere to your community? Get in touch
              </Link>
            </div>
          </div>

          {/* Personal access */}
          <div className="p-8 bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm space-y-4 flex flex-col">
            <h3 className="text-xl font-serif font-light text-[#3d3a35]">Personal access</h3>
            <p className="text-sm text-[#5f5a53] leading-relaxed flex-1">
              Not part of an organisation? Start with your two free sessions, and if SeeHere feels useful, write to us.
              We'll arrange access personally and send you your own code — no subscriptions, no auto-renewals.
            </p>
            <div className="space-y-3 pt-1">
              {onTryForFree && (
                <Button
                  onClick={onTryForFree}
                  className="w-full bg-[#4a7a4f] hover:bg-[#3d6542] text-white rounded-2xl py-6 text-sm font-medium"
                >
                  Try it free now
                </Button>
              )}
              <Link
                to="/contact"
                className="block text-sm text-[#4a7a4f] hover:text-[#3d6542] underline underline-offset-4 transition-colors"
              >
                Contact us to arrange personal access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
