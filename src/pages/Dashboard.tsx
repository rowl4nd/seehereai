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
import { Link as RouterLink } from "react-router-dom";
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
    sessions,
    activeSession,
    canStartSession,
    nextSessionTime,
    loading: sessionsLoading,
    endSession
  } = useSessions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Auto-end expired active sessions
  useEffect(() => {
    if (!activeSession || sessionsLoading) return;

    const sessionDuration = activeSession.session_type === "paid" ? 45 * 60 : 25 * 60;
    const startTime = new Date(activeSession.started_at).getTime();
    const endTime = startTime + sessionDuration * 1000;

    if (Date.now() >= endTime) {
      // Session has expired while away — auto-end it
      endSession(activeSession.id);
    }
  }, [activeSession, sessionsLoading, endSession]);

  // Calculate time remaining on active session
  const getActiveSessionTimeRemaining = () => {
    if (!activeSession) return 0;
    const sessionDuration = activeSession.session_type === "paid" ? 45 * 60 : 25 * 60;
    const startTime = new Date(activeSession.started_at).getTime();
    const endTime = startTime + sessionDuration * 1000;
    return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  };

  const activeTimeRemaining = activeSession ? getActiveSessionTimeRemaining() : 0;
  const hasActiveResumableSession = !!activeSession && activeTimeRemaining > 0;

  const handleStartSession = () => {
    if (!profile?.has_completed_onboarding) {
      navigate("/onboarding");
    } else {
      navigate("/guidance");
    }
  };

  const handleResumeSession = () => {
    navigate("/mirror");
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
              {isLoading ? <Skeleton className="h-10 w-full" /> : hasActiveResumableSession ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You have an active session — {Math.floor(activeTimeRemaining / 60)} min remaining
                  </p>
                  <Button onClick={handleResumeSession} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Resume session
                  </Button>
                </div>
              ) : canStartSession ? totalAvailable > 0 ? <Button onClick={handleStartSession} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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

          {/* Purchase credits button */}
          <Link to="/credits" className="block">
            <Button className="w-full text-background" style={{ backgroundColor: '#af9cd3' }}>
              Purchase sessions
            </Button>
          </Link>

          {/* Past Sessions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-serif font-light text-xl">Past Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (() => {
                const pastSessions = sessions
                  .filter((s) => !s.is_active && s.ended_at)
                  .slice(0, 5);

                if (pastSessions.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground text-center">
                      No sessions yet
                    </p>
                  );
                }

                return (
                  <div className="space-y-2">
                    {pastSessions.map((s) => (
                      <RouterLink
                        key={s.id}
                        to={`/history/${s.id}`}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent/30 transition-colors group"
                      >
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {formatDistanceToNow(new Date(s.ended_at!), { addSuffix: true })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {s.duration_minutes ? `${s.duration_minutes} min` : "—"}
                        </span>
                      </RouterLink>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};
export default Dashboard;