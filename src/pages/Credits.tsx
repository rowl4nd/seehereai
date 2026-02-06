import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const creditPackages = [
  {
    id: "single",
    sessions: 1,
    price: 500, // pence
    priceDisplay: "£5",
    pricePerSession: "£5",
  },
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

const Credits = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handlePurchase = async (packageId: string) => {
    // This will be connected to Stripe
    // For now, show a message
    alert("Stripe integration coming soon! Package: " + packageId);
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
      {/* Subtle warm border frame */}
      <div className="fixed inset-4 border border-border/50 rounded-2xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <Link to="/dashboard" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          See Here
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-8 animate-fade-in">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-light text-foreground">
              Session Credits
            </h1>
            <p className="text-sm text-muted-foreground">
              Credits never expire. Use them whenever you're ready.
            </p>
          </div>

          {/* Packages */}
          <div className="grid gap-4 md:grid-cols-2">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`bg-card/50 border-border/50 relative ${
                  pkg.popular ? "ring-2 ring-primary/30" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-serif font-light text-2xl">
                    {pkg.sessions} session{pkg.sessions > 1 ? "s" : ""}
                  </CardTitle>
                  <CardDescription>
                    {pkg.pricePerSession}/session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-light text-foreground">
                      {pkg.priceDisplay}
                    </span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    variant={pkg.popular ? "default" : "outline"}
                    className={`w-full ${
                      pkg.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "border-border/50 hover:bg-accent/50"
                    }`}
                  >
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-xs text-muted-foreground/70">
            Secure payment powered by Stripe
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
