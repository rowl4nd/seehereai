import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Logo from "@/components/Logo";

const Terms = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Terms & Conditions | SeeHere";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-3xl font-serif font-light text-foreground">Terms &amp; Conditions</h1>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">1. About See Here</h2>
              <p>
                See Here is operated by See Here Ltd, registered in England and Wales under company number 17014368.
              </p>
              <p>
                See Here is an AI-powered listening companion designed to provide reflective, supportive conversation.
                It is <strong>not</strong> a replacement for professional mental health care, therapy, counselling, or
                medical advice.
              </p>
              <p>
                You must be at least 18 years old to use See Here. If you are under 18, you may only use this service
                with the consent and supervision of a parent or guardian. See Here is not designed for use by children.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">2. AI Disclosure</h2>
              <p>
                All conversations on See Here are conducted with an artificial intelligence system. You are not speaking
                with a human therapist, counsellor, or mental health professional. The AI is designed to listen,
                reflect, and ask supportive questions, but it cannot diagnose, treat, or prescribe.
              </p>
              <p>
                <strong>
                  By using See Here, you acknowledge and accept that you are interacting with an artificial intelligence
                  system, not a human.
                </strong>
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">3. Not a Crisis Service</h2>
              <p>
                See Here is not equipped to handle mental health emergencies. If you are in crisis or experiencing
                thoughts of self-harm or suicide, please contact a professional service immediately:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Samaritans:</strong> Call 116 123 (free, 24/7) or email jo@samaritans.org
                </li>
                <li>
                  <strong>Crisis Text Line:</strong> Text SHOUT to 85258 (free, 24/7)
                </li>
                <li>
                  <strong>Emergency services:</strong> Call 999 if in immediate danger
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">4. Privacy &amp; Data</h2>
              <p>
                Your conversations are stored securely and are only accessible to you. Conversation messages are{" "}
                <strong>encrypted at rest</strong> using industry-standard encryption (AES-256-GCM), meaning they are
                not stored in a readable format — even at the database level.
              </p>
              <p>
                Conversation history is used solely to provide continuity between sessions — allowing the AI to remember
                previous discussions and offer more personalised support.
              </p>
              <p>
                Your data is never shared with third parties for marketing or advertising purposes. For full details on
                how we collect, use, and protect your data, please see our Privacy Policy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">5. Sessions &amp; Credits</h2>
              <p>
                New users receive 2 free sessions. Additional sessions can be purchased using credits. Free sessions
                last 25 minutes; paid sessions last 45 minutes. Only one session per user per day is allowed to
                encourage a cooldown period and time for reflection.
              </p>
              <p>
                Credits are non-refundable except as required by law or in cases of technical failure on our part.
                Credits do not expire and remain valid until used.
              </p>
              <p>
                All payments are processed securely through Stripe. By purchasing credits, you agree to Stripe's terms
                of service.
              </p>
              <p>
                By purchasing credits and initiating a session, you agree to the immediate delivery of digital content
                and acknowledge that you waive your statutory 14-day right to cancel under the Consumer Contracts
                (Information, Cancellation and Additional Charges) Regulations 2013, as permitted by UK consumer law.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">6. Acceptable Use</h2>
              <p>
                You agree to use See Here for personal reflection and self-exploration only. You must not use the
                service to generate harmful, abusive, or illegal content. We reserve the right to suspend accounts that
                violate these terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">7. Limitation of Liability</h2>
              <p>We are not liable for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Any decisions, actions, or outcomes resulting from your use of See Here</li>
                <li>Any indirect, consequential, or special losses</li>
                <li>Any reliance you place on AI-generated responses</li>
                <li>Any loss of data, business, or opportunity</li>
              </ul>
              <p>
                See Here is provided "as is" and "as available" without warranties of any kind, express or implied,
                including but not limited to warranties of merchantability, fitness for a particular purpose, or
                non-infringement.
              </p>
              <p>
                To the maximum extent permitted by law, our total liability to you for any claim arising from these
                Terms or your use of See Here shall not exceed the amount you have paid to See Here in the 12 months
                preceding the claim, or £100, whichever is lower.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">8. Account Termination</h2>
              <p>
                You may delete your account at any time through your account settings. Upon deletion, your conversation
                history and personal data will be permanently deleted within 30 days, except where we are required by
                law to retain certain information.
              </p>
              <p>We reserve the right to suspend or terminate your account immediately if:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You breach these Terms</li>
                <li>You use the service in a harmful, abusive, or illegal manner</li>
                <li>We reasonably believe your use poses a risk to other users or our service</li>
              </ul>
              <p>
                If your account is terminated for violating these Terms, any unused credits will be forfeited and
                non-refundable.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">9. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of See Here after changes constitutes
                acceptance of the updated terms. We will notify users of significant changes where possible.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">10. Governing Law</h2>
              <p>
                These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms or your
                use of See Here will be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">11. Contact</h2>
              <p>
                If you have questions about these terms, please contact us at{" "}
                <a
                  href="mailto:hello@seehere.ai"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  hello@seehere.ai
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">Last updated: February 2026</p>
      </footer>
    </div>
  );
};

export default Terms;
