import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Session {
  id: string;
  user_id: string;
  session_type: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
}

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [canStartSession, setCanStartSession] = useState(false);
  const [nextSessionTime, setNextSessionTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setActiveSession(null);
      setCanStartSession(false);
      setNextSessionTime(null);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      setLoading(true);

      // Auto-end any expired sessions server-side before fetching
      await supabase.rpc("auto_end_expired_sessions");

      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
      } else {
        setSessions(sessionsData || []);
        const active = sessionsData?.find((s) => s.is_active);
        setActiveSession(active || null);
      }

      // Check cooldown
      const { data: cooldownData } = await supabase.rpc("has_cooldown_passed", {
        _user_id: user.id,
      });
      setCanStartSession(cooldownData ?? false);

      // Get next session time
      const { data: nextTimeData } = await supabase.rpc("get_next_session_time", {
        _user_id: user.id,
      });
      setNextSessionTime(nextTimeData);

      setLoading(false);
    };

    fetchSessions();
  }, [user]);

  const startSession = async (sessionType: "free" | "paid") => {
    if (!user) return { error: new Error("Not authenticated"), session: null };

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        session_type: sessionType,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error starting session:", error);
      return { error, session: null };
    }

    setActiveSession(data);
    setSessions((prev) => [data, ...prev]);
    return { error: null, session: data };
  };

  const addSessionToState = (session: Session) => {
    setSessions((prev) => {
      if (prev.some((s) => s.id === session.id)) return prev;
      return [session, ...prev];
    });
  };

  const endSession = async (sessionId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    let session = sessions.find((s) => s.id === sessionId);

    // If not in local state (e.g. created via RPC), fetch from DB
    if (!session) {
      const { data, error: fetchErr } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();
      if (fetchErr || !data) {
        console.error("Could not find session to end:", fetchErr);
        return { error: fetchErr || new Error("Session not found") };
      }
      session = data;
    }

    const startedAt = new Date(session.started_at);
    const endedAt = new Date();
    const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

    const { error } = await supabase
      .from("sessions")
      .update({
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
        is_active: false,
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error ending session:", error);
      return { error };
    }

    setActiveSession(null);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, ended_at: endedAt.toISOString(), duration_minutes: durationMinutes, is_active: false }
          : s
      )
    );
    setCanStartSession(false);
    setNextSessionTime(new Date(endedAt.getTime() + 12 * 60 * 60 * 1000).toISOString());

    return { error: null };
  };

  return {
    sessions,
    activeSession,
    canStartSession,
    nextSessionTime,
    loading,
    startSession,
    endSession,
    addSessionToState,
  };
}
