import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [sessionsAdded, setSessionsAdded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("No payment session found");
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        if (response.error) {
          console.error("Verify error:", response.error);
          setSessionsAdded(null);
        } else if (response.data?.success) {
          setSessionsAdded(response.data.sessions);
        } else if (response.data?.message === "Already processed") {
          setSessionsAdded(response.data.sessions || null);
        } else {
          setError(response.data?.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setSessionsAdded(null);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="relative z-10 p-6 md:p-8">
        <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          see here
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
          {verifying ? (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-primary/30" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-light text-foreground">
                  Confirming your payment...
                </h1>
                <p className="text-sm text-muted-foreground">Just a moment</p>
              </div>
            </>
          ) : error ? (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-destructive/20" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-light text-foreground">
                  Something went wrong
                </h1>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Link to="/credits">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors underline">
                  Try again
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/40" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-serif font-light text-foreground">
                  Thank you
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {sessionsAdded
                    ? `${sessionsAdded} session${sessionsAdded !== 1 ? "s" : ""} added to your account.`
                    : "Your payment has been received. Credits will appear on your dashboard shortly."}
                </p>
              </div>
              <Link to="/dashboard">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-sm font-sans transition-colors">
                  Return to your space
                </button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
