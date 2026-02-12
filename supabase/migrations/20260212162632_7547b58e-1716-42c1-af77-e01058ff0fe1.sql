
-- Recreate the function (it should already exist from the partial migration, but let's be safe)
CREATE OR REPLACE FUNCTION public.auto_end_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE sessions
  SET
    is_active = false,
    ended_at = started_at + CASE
      WHEN session_type = 'paid' THEN INTERVAL '45 minutes'
      ELSE INTERVAL '25 minutes'
    END,
    duration_minutes = CASE
      WHEN session_type = 'paid' THEN 45
      ELSE 25
    END
  WHERE is_active = true
    AND (
      (session_type = 'paid' AND started_at + INTERVAL '45 minutes' < NOW())
      OR
      (session_type != 'paid' AND started_at + INTERVAL '25 minutes' < NOW())
    );
END;
$$;
