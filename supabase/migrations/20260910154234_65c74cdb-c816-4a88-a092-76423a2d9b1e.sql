ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS extended_until timestamptz;

CREATE OR REPLACE FUNCTION public.extend_session(_session_id uuid)
RETURNS TABLE(success boolean, message text, extended_until timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _row public.sessions%ROWTYPE;
  _new_end timestamptz;
BEGIN
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::text, NULL::timestamptz;
    RETURN;
  END IF;

  SELECT * INTO _row
  FROM public.sessions
  WHERE id = _session_id AND user_id = _user_id AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'No active session found'::text, NULL::timestamptz;
    RETURN;
  END IF;

  IF _row.extended_until IS NOT NULL THEN
    RETURN QUERY SELECT false, 'This session has already been extended'::text, _row.extended_until;
    RETURN;
  END IF;

  _new_end := _row.started_at
    + CASE WHEN _row.session_type = 'paid' THEN INTERVAL '45 minutes' ELSE INTERVAL '25 minutes' END
    + INTERVAL '10 minutes';

  UPDATE public.sessions
  SET extended_until = _new_end
  WHERE id = _row.id;

  RETURN QUERY SELECT true, 'Session extended by 10 minutes'::text, _new_end;
END;
$$;

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
    ended_at = COALESCE(
      extended_until,
      started_at + CASE WHEN session_type = 'paid' THEN INTERVAL '45 minutes' ELSE INTERVAL '25 minutes' END
    ),
    duration_minutes = CASE
      WHEN extended_until IS NOT NULL THEN
        GREATEST(1, (EXTRACT(EPOCH FROM (extended_until - started_at)) / 60)::int)
      WHEN session_type = 'paid' THEN 45
      ELSE 25
    END
  WHERE is_active = true
    AND COALESCE(
      extended_until,
      started_at + CASE WHEN session_type = 'paid' THEN INTERVAL '45 minutes' ELSE INTERVAL '25 minutes' END
    ) < NOW();
END;
$$;