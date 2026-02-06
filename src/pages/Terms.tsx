import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          See Here
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-3xl font-serif font-light text-foreground">
            Terms &amp; Conditions
          </h1>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">1. About See Here</h2>
              <p>
                See Here is an AI-powered listening companion designed to provide reflective, supportive conversation. It is <strong>not</strong> a replacement for professional mental health care, therapy, counselling, or medical advice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">2. AI Disclosure</h2>
              <p>
                All conversations on See Here are conducted with an artificial intelligence system. You are not speaking with a human therapist, counsellor, or mental health professional. The AI is designed to listen, reflect, and ask supportive questions, but it cannot diagnose, treat, or prescribe.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">3. Not a Crisis Service</h2>
              <p>
                See Here is not equipped to handle mental health emergencies. If you are in crisis or experiencing thoughts of self-harm or suicide, please contact a professional service immediately:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Samaritans:</strong> Call 116 123 (free, 24/7) or email jo@samaritans.org</li>
                <li><strong>Crisis Text Line:</strong> Text SHOUT to 85258 (free, 24/7)</li>
                <li><strong>Emergency services:</strong> Call 999 if in immediate danger</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">4. Privacy &amp; Data</h2>
              <p>
                Your conversations are stored securely and are only accessible to you. Conversation history is used solely to provide continuity between sessions — allowing the AI to remember previous discussions and offer more personalised support. Your data is never shared with third parties for marketing or advertising purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">5. Sessions &amp; Credits</h2>
              <p>
                New users receive 2 free sessions. Additional sessions can be purchased using credits. Free sessions last 25 minutes; paid sessions last 45 minutes. A rest period of at least 12 hours is required between sessions to encourage reflection.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">6. Acceptable Use</h2>
              <p>
                You agree to use See Here for personal reflection and self-exploration only. You must not use the service to generate harmful, abusive, or illegal content. We reserve the right to suspend accounts that violate these terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">7. Limitation of Liability</h2>
              <p>
                See Here is provided "as is" without warranties of any kind. We are not liable for any decisions, actions, or outcomes resulting from your use of this service. By using See Here, you acknowledge that AI-generated responses may not always be accurate or appropriate for your situation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">8. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of See Here after changes constitutes acceptance of the updated terms. We will notify users of significant changes where possible.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">9. Contact</h2>
              <p>
                If you have questions about these terms, please reach out through the application.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Last updated: February 2026
        </p>
      </footer>
    </div>
  );
};

export default Terms;
