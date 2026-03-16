import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useAnalytics } from "@/hooks/useAnalytics";

const creditPackages = [
  {
    id: "four",
    sessions: 4,
    price: 1200,
    priceDisplay: "£12",
    pricePerSession: "£3",
  },
  {
    id: "eight",
    sessions: 8,
    price: 2000,
    priceDisplay: "£20",
    pricePerSession: "£2.50",
    popular: true,
  },
  {
    id: "sixteen",
    sessions: 16,
    price: 3200,
    priceDisplay: "£32",
    pricePerSession: "£2",
  },
];

const singleSession = {
  id: "single",
  sessions: 1,
  price: 500,
  priceDisplay: "£5",
  pricePerSession: "£5",
};

const Credits = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setPurchasingId(packageId);
    try {
      const response = await supabase.functions.invoke("create-checkout", {
        body: { packageId },
      });

      if (response.error) {
        toast.error("Could not start checkout. Please try again.");
        console.error("Checkout error:", response.error);
        return;
      }

      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPurchasingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8">
        <Logo to="/dashboard" />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-light text-foreground">Session Credits</h1>
            <p className="text-sm text-muted-foreground">Credits never expire. Use them whenever you're ready.</p>
          </div>

          {/* Main packages — 3 tiers */}
          <div className="grid gap-4 md:grid-cols-3">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`bg-card/50 border-border/50 relative ${pkg.popular ? "ring-2 ring-primary/30" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-serif font-light text-2xl">{pkg.sessions} sessions</CardTitle>
                  <CardDescription>{pkg.pricePerSession}/session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-light text-foreground">{pkg.priceDisplay}</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasingId !== null}
                    variant={pkg.popular ? "default" : "outline"}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "border-border/50 hover:bg-accent/50"
                    }`}
                  >
                    {purchasingId === pkg.id ? "Redirecting..." : "Purchase"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stripe note */}
          <p className="text-center text-xs text-muted-foreground/70">Secure payment powered by Stripe</p>

          {/* Single session — deprioritised */}
          <p className="text-center text-xs text-muted-foreground/50">
            Just want to try one?{" "}
            <button
              onClick={() => handlePurchase(singleSession.id)}
              disabled={purchasingId !== null}
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors disabled:opacity-50"
            >
              Single session — £5
            </button>
          </p>
        </div>
      </main>

      {/* Back link */}
      <footer className="relative z-10 p-6 text-center">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Return to dashboard
        </Link>
      </footer>
    </div>
  );
};

export default Credits;
