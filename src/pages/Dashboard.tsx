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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import AccessCodeRedeem from "@/components/AccessCodeRedeem";
import { getSecondsRemaining, getSessionEndTime } from "@/lib/sessionTiming";
import { usePageMeta } from "@/hooks/usePageMeta";


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
    endSession,
    deleteSession,
  } = useSessions();
  const navigate = useNavigate();
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  usePageMeta("Your Space | SeeHere", "Your SeeHere dashboard — start a session and revisit past conversations.");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Auto-end expired active sessions (honours a one-time extension stored on the session)
  useEffect(() => {
    if (!activeSession || sessionsLoading) return;

    if (Date.now() >= getSessionEndTime(activeSession)) {
      // Session has expired while away — auto-end it
      endSession(activeSession.id);
    }
  }, [activeSession, sessionsLoading, endSession]);

  // Calculate time remaining on active session
  const getActiveSessionTimeRemaining = () => {
    if (!activeSession) return 0;
    return getSecondsRemaining(activeSession);
  };


  const activeTimeRemaining = activeSession ? getActiveSessionTimeRemaining() : 0;
  const hasActiveResumableSession = !!activeSession && activeTimeRemaining > 0;

  const handleStartSession = () => {
    if (!profile?.has_completed_onboarding) {
      navigate("/onboarding");
    } else {
      navigate("/mirror");
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
  const isOrg = profile?.org_access ?? false;
  const freeSessionsRemaining = profile ? Math.max(0, 2 - (profile.free_sessions_used || 0)) : 0;
  const paidSessions = credits?.balance || 0;
  const totalAvailable = freeSessionsRemaining + paidSessions;
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground" role="status" aria-live="polite">Loading...</div>
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 flex justify-between items-center px-4 py-2 md:px-8">
        <Logo />
        <Button variant="ghost" onClick={handleSignOut} className="text-sm text-muted-foreground">
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <main id="main-content" className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
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
              <h2 className="font-serif font-light text-xl leading-none tracking-tight">Sessions</h2>
              <CardDescription>
                {isLoading ? <Skeleton className="h-4 w-32 mx-auto" /> : isOrg ? (
                  <span className="block">Organisation access — unlimited sessions</span>
                ) : <>
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
              ) : canStartSession ? (isOrg || totalAvailable > 0) ? <Button onClick={handleStartSession} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Begin a session
                  </Button> : <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You've used your free sessions
                    </p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      Continued access comes through an organisation code, or one we arrange with you personally.
                    </p>
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

          {/* Access code entry / contact for personal access */}
          {!isOrg && !isLoading && (
            <div className="space-y-2">
              <AccessCodeRedeem onRedeemed={() => window.location.reload()} />
              <Link
                to="/contact"
                className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Don't have a code? Contact us for personal access
              </Link>
            </div>
          )}

          {/* Past Sessions */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="text-center pb-4">
              <h2 className="font-serif font-light text-xl leading-none tracking-tight">Past Sessions</h2>
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {s.duration_minutes ? `${s.duration_minutes} min` : "—"}
                          </span>
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingSessionId(s.id);
                              const { error } = await deleteSession(s.id);
                              setDeletingSessionId(null);
                              if (error) {
                                toast.error("Failed to delete session");
                              } else {
                                toast.success("Session deleted");
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            aria-label="Delete session"
                          >
                            <Trash2 className={`h-3.5 w-3.5 text-muted-foreground/50 hover:text-destructive transition-colors ${deletingSessionId === s.id ? 'animate-pulse' : ''}`} />
                          </button>
                        </div>
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