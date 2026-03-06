
CREATE OR REPLACE FUNCTION public.start_paid_session()
RETURNS TABLE(session_id uuid, new_balance integer, error_msg text, session_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _session_id UUID;
  _new_balance INT;
  _user_id UUID := auth.uid();
  _session_type TEXT;
  _free_used INT;
BEGIN
  -- Verify authenticated
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::INT, 'Not authenticated'::TEXT, NULL::TEXT;
    RETURN;
  END IF;

  -- Server-side: determine session type based on free sessions used
  SELECT free_sessions_used INTO _free_used
  FROM profiles
  WHERE user_id = _user_id;

  IF _free_used < 2 THEN
    _session_type := 'free';

    -- Increment free sessions counter atomically
    UPDATE profiles
    SET free_sessions_used = free_sessions_used + 1
    WHERE user_id = _user_id;
  ELSE
    _session_type := 'paid';

    -- Deduct credit atomically
    UPDATE credits 
    SET balance = balance - 1 
    WHERE user_id = _user_id 
      AND balance > 0
    RETURNING balance INTO _new_balance;

    IF NOT FOUND THEN
      RETURN QUERY SELECT NULL::UUID, NULL::INT, 'Insufficient credits'::TEXT, NULL::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Create session with server-determined type
  INSERT INTO sessions (user_id, session_type, is_active)
  VALUES (_user_id, _session_type, true)
  RETURNING id INTO _session_id;

  RETURN QUERY SELECT 
    _session_id, 
    COALESCE(_new_balance, (SELECT balance FROM credits WHERE user_id = _user_id)), 
    NULL::TEXT,
    _session_type;
END;
$$;
