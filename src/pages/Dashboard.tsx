import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCredits } from "@/hooks/useCredits";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Logo from "@/components/Logo";
const Dashboard = () => {
  const {
    user,
    loading: authLoading,
    signOut
  } = useAuth();
  const {
    profile,
    loading: profileLoading
  } = useProfile();
  const {
    credits,
    loading: creditsLoading
  } = useCredits();
  const {
    canStartSession,
    nextSessionTime,
    loading: sessionsLoading
  } = useSessions();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);
  const handleStartSession = () => {
    if (!profile?.has_completed_onboarding) {
      navigate("/onboarding");
    } else {
      navigate("/guidance");
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const isLoading = authLoading || profileLoading || creditsLoading || sessionsLoading;

  // Calculate available sessions
  const freeSessionsRemaining = profile ? Math.max(0, 2 - (profile.free_sessions_used || 0)) : 0;
  const paidSessions = credits?.balance || 0;
  const totalAvailable = freeSessionsRemaining + paidSessions;
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <Logo />
        <Button variant="ghost" onClick={handleSignOut} className="text-sm text-muted-foreground">
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Welcome message */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-light text-foreground">
              Your Space
            </h1>
            <p className="text-sm text-muted-foreground">
              A moment of calm awaits
            </p>
          </div>

          {/* Session Card */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-serif font-light text-xl">Sessions</CardTitle>
              <CardDescription>
                {isLoading ? <Skeleton className="h-4 w-32 mx-auto" /> : <>
                    {totalAvailable} session{totalAvailable !== 1 ? "s" : ""} available
                    {freeSessionsRemaining > 0 && <span className="block text-xs mt-1">
                        ({freeSessionsRemaining} free remaining)
                      </span>}
                  </>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? <Skeleton className="h-10 w-full" /> : canStartSession ? totalAvailable > 0 ? <Button onClick={handleStartSession} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Begin a session
                  </Button> : <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You've used all your sessions
                    </p>
                    <Link to="/credits">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Get more sessions
                      </Button>
                    </Link>
                  </div> : <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Give yourself time to reflect
                  </p>
                  {nextSessionTime && <p className="text-xs text-muted-foreground/70">
                      Next session available {formatDistanceToNow(new Date(nextSessionTime), {
                  addSuffix: true
                })}
                    </p>}
                </div>}
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-serif font-light text-xl">Credits</CardTitle>
              <CardDescription>
                {isLoading ? <Skeleton className="h-4 w-24 mx-auto" /> : <>{paidSessions} credit{paidSessions !== 1 ? "s" : ""}</>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/credits">
                <Button variant="outline" className="w-full border-border/50 hover:bg-accent/50">
                  Purchase credits
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};
export default Dashboard;