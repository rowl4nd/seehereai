import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";
import Logo from "@/components/Logo";
import { useAnalytics } from "@/hooks/useAnalytics";

const Cooldown = () => {
  const { user, loading: authLoading } = useAuth();
  const { nextSessionTime } = useSessions();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  // Determine which session just ended
  // free_sessions_used is incremented before redirect, so:
  // 1 = just finished session 1, 2 = just finished session 2
  const freeSessions = profile?.free_sessions_used ?? 0;
  const isPostSession1 = freeSessions === 1;
  const isPostSession2 = freeSessions >= 2;

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
      <div className="min-h-screen flex items-center justify-center bg-[#f8f6f3]">
        <div className="animate-pulse text-[#857f77] font-serif italic tracking-wide" role="status" aria-live="polite">
          Entering the quiet...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f3] relative overflow-hidden selection:bg-[#af9cd3]/20">
      {/* Decorative misty background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 md:px-12 opacity-40 hover:opacity-100 transition-opacity z-20">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 z-10">
        <div className="w-full max-w-xl text-center space-y-12">
          {/* Glass card */}
          <div className="relative p-10 md:p-16 rounded-[60px] min-h-[280px] flex flex-col items-center justify-center">
            {/* Glass background */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[60px] shadow-[0_4px_24px_-1px_rgba(0,0,0,0.02)] border border-white/60" />

            {/* Content */}
            <div className="relative space-y-8">
              {/* Pulsing circle */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-[#af9cd3]/20 flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-[#af9cd3]/30" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-[#3d3a35]">
                  Time for your thoughts to settle
                </h1>
                <p className="text-lg text-[#5f5a53] leading-relaxed font-light italic opacity-90">
                  Give yourself space to sit with what surfaced. The most meaningful reflections often arrive in the
                  moments after.
                </p>
              </div>

              {/* Time remaining — only show if they have a free session left OR have credits */}
              {timeUntilNext && isPostSession1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm text-[#857f77] italic">We can speak again in...</p>
                  <p className="text-2xl font-serif italic text-[#3d3a35]">{timeUntilNext}</p>
                </div>
              )}

              {/* Journaling prompt */}
              <div className="space-y-3 pt-2">
                <p className="text-xs uppercase tracking-[0.25em] text-[#857f77]">While you wait</p>
                <p className="text-lg font-serif italic text-[#5f5a53] leading-relaxed">
                  "What's one thing from our conversation that stayed with you?"
                </p>
              </div>

              {/* ── Context-aware nudge ── */}

              {/* Post session 1: quiet reminder of second free session */}
              {isPostSession1 && (
                <div className="pt-2 border-t border-[#af9cd3]/20">
                  <p className="text-sm text-[#857f77] font-light italic">
                    Your second free session will be here when you're ready.
                  </p>
                </div>
              )}

              {/* Post session 2: soft transition to paid */}
              {isPostSession2 && (
                <div className="pt-4 border-t border-[#af9cd3]/20 space-y-3">
                  <p className="text-sm text-[#857f77] font-light leading-relaxed">
                    You've completed your free sessions.
                    <br />
                    If you'd like to continue, sessions start from <span className="text-[#3d3a35]">£2</span>.
                  </p>
                  <Link
                    to="/credits"
                    className="inline-block text-xs uppercase tracking-[0.2em] text-[#af9cd3] hover:text-[#3d3a35] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-sm"
                  >
                    → See session options
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-10 text-center flex flex-col gap-4 z-10">
        <Link
          to="/dashboard"
          className="text-xs uppercase tracking-[0.25em] text-[#857f77] hover:text-[#3d3a35] transition-colors px-4 py-2 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-md"
        >
          Return to Dashboard
        </Link>
        <div className="text-xs text-[#857f77] uppercase tracking-[0.1em] max-w-xs mx-auto leading-loose">
          Not a crisis service. In danger? Call 999 or 111.
        </div>
      </footer>
    </div>
  );
};

export default Cooldown;
