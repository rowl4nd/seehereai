import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const Cooldown = () => {
  const { user, loading: authLoading } = useAuth();
  const { nextSessionTime } = useSessions();
  const navigate = useNavigate();
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!nextSessionTime) return;

    const updateTime = () => {
      const nextTime = new Date(nextSessionTime);
      if (nextTime <= new Date()) {
        navigate("/dashboard");
        return;
      }
      setTimeUntilNext(formatDistanceToNow(nextTime, { addSuffix: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [nextSessionTime, navigate]);

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
        <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          See Here
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
          {/* Icon/visual */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-light text-foreground">
              Time to reflect
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Give yourself space to process what we discussed. Sometimes the most meaningful insights come in the quiet moments after.
            </p>
          </div>

          {/* Time remaining */}
          {timeUntilNext && (
            <div className="bg-card/50 border border-border/50 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Your next session is available in
              </p>
              <p className="text-2xl font-serif text-foreground">
                {timeUntilNext}
              </p>
            </div>
          )}

          {/* Journaling prompt */}
          <div className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground/70">
              While you wait, you might consider:
            </p>
            <p className="text-sm text-foreground italic">
              "What's one thing from our conversation that stayed with you?"
            </p>
          </div>

          {/* Dashboard link */}
          <Link to="/dashboard">
            <Button variant="outline" className="border-border/50 hover:bg-accent/50">
              Return to dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Cooldown;
