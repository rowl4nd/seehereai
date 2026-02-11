
CREATE OR REPLACE FUNCTION public.start_paid_session(
  _session_type TEXT
)
RETURNS TABLE(session_id UUID, new_balance INT, error_msg TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _session_id UUID;
  _new_balance INT;
  _user_id UUID := auth.uid();
BEGIN
  -- Verify authenticated
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::INT, 'Not authenticated'::TEXT;
    RETURN;
  END IF;

  -- For paid sessions, atomically check and decrement credits
  IF _session_type = 'paid' THEN
    UPDATE credits 
    SET balance = balance - 1 
    WHERE user_id = _user_id 
      AND balance > 0
    RETURNING balance INTO _new_balance;

    IF NOT FOUND THEN
      RETURN QUERY SELECT NULL::UUID, NULL::INT, 'Insufficient credits'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Create session
  INSERT INTO sessions (user_id, session_type, is_active)
  VALUES (_user_id, _session_type, true)
  RETURNING id INTO _session_id;

  RETURN QUERY SELECT _session_id, COALESCE(_new_balance, (SELECT balance FROM credits WHERE user_id = _user_id)), NULL::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.start_paid_session TO authenticated;
REVOKE EXECUTE ON FUNCTION public.start_paid_session FROM anon;
