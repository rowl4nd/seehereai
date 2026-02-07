import Logo from "@/components/Logo";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <Logo />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 px-6 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-3xl font-serif font-light text-foreground">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">1. Who We Are</h2>
              <p>
                See Here is an AI-powered listening companion operated by Cecilia Gregory ("we", "us", "our"). We act as the data controller for your personal information. If you have any questions about how we handle your data, please contact us through the application.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">2. What Data We Collect</h2>
              <p>We collect the following personal data when you use See Here:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Account information:</strong> Your email address, used for authentication and communication</li>
                <li><strong>Conversation data:</strong> The messages you share during sessions, stored to provide continuity between sessions</li>
                <li><strong>Session history:</strong> Timestamps and duration of your sessions</li>
                <li><strong>Payment information:</strong> Processed securely by Stripe — we do not store your card details</li>
                <li><strong>Profile data:</strong> Display name (optional) and onboarding acknowledgements</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">3. Why We Collect It (Lawful Basis)</h2>
              <p>We process your data under the following lawful bases as defined by the UK GDPR:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Contractual necessity (Article 6(1)(b)):</strong> To provide the See Here service — including storing your conversations for session continuity, managing your account, and processing payments</li>
                <li><strong>Legitimate interest (Article 6(1)(f)):</strong> To maintain and improve the service, ensure security, and prevent misuse</li>
                <li><strong>Consent (Article 6(1)(a)):</strong> Where you have given explicit consent, such as acknowledging this privacy policy</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">4. How Your Data Is Stored &amp; Protected</h2>
              <p>
                Your data is stored in a secure, encrypted database. We implement <strong>row-level security</strong>, which means your conversations, sessions, and profile data are technically isolated — only your authenticated account can access your own records. Data is transmitted over encrypted connections (HTTPS/TLS) at all times.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">5. Who Can Access Your Data</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>You:</strong> Only you can view your conversations, session history, and profile through the application</li>
                <li><strong>Nominated administrator:</strong> A single nominated administrator has limited access to the database for service administration, troubleshooting, and legal compliance purposes only</li>
                <li><strong>Third parties:</strong> We do not sell, rent, or share your personal data with any third party for marketing or advertising purposes</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">6. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active. If you request deletion of your account, all associated data — including conversations, session history, and profile information — will be permanently deleted within 30 days. Payment records may be retained for longer where required by law (e.g. tax obligations).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">7. Your Rights Under GDPR</h2>
              <p>Under the UK General Data Protection Regulation, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Right of access:</strong> Request a copy of all personal data we hold about you</li>
                <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Right to erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Right to restrict processing:</strong> Request that we limit how we use your data</li>
                <li><strong>Right to data portability:</strong> Request your data in a structured, machine-readable format</li>
                <li><strong>Right to object:</strong> Object to processing based on legitimate interest</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">8. How to Exercise Your Rights</h2>
              <p>
                To exercise any of your rights, please contact us through the application. We will respond to your request within one calendar month. If your request is complex, we may extend this by a further two months, and we will inform you of any such extension. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  ico.org.uk
                </a>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">9. Cookies</h2>
              <p>
                See Here uses only essential cookies required for authentication and session management. We do not use tracking cookies, analytics cookies, or any third-party advertising cookies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">10. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Stripe:</strong> For secure payment processing. Stripe's privacy policy can be found at{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    stripe.com/privacy
                  </a>
                </li>
                <li><strong>AI language model:</strong> Your conversation messages are sent to an AI model to generate responses. These messages are not used to train the AI model and are not retained by the AI provider beyond the duration of the request</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">11. Children's Privacy</h2>
              <p>
                See Here is intended for users aged 18 and over. We do not knowingly collect personal data from anyone under the age of 18. If we become aware that we have collected data from a minor, we will delete it promptly.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Continued use of See Here after changes constitutes acceptance of the updated policy. We will notify users of significant changes where possible.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">13. Contact</h2>
              <p>
                If you have questions about this privacy policy or wish to exercise your data rights, please reach out through the application.
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

export default Privacy;
