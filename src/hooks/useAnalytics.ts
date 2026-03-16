import { useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

function getAnalyticsSessionId(): string {
  let id = sessionStorage.getItem("sh_analytics_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("sh_analytics_session_id", id);
  }
  return id;
}

export function useAnalytics() {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(getAnalyticsSessionId());

  const trackEvent = useCallback(
    (eventName: string, metadata?: Record<string, any>) => {
      try {
        supabase.functions
          .invoke("track-event", {
            body: {
              event_name: eventName,
              session_id: sessionIdRef.current,
              user_id: user?.id || null,
              metadata: metadata || null,
            },
          })
          .catch(() => {});
      } catch {
        // silent
      }
    },
    [user?.id]
  );

  return { trackEvent };
}
