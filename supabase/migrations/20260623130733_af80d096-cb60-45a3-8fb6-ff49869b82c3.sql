-- 1. access_codes table
CREATE TABLE public.access_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  label text,
  max_redemptions integer NOT NULL DEFAULT 10,
  redemptions_used integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.access_codes TO authenticated;
GRANT ALL ON public.access_codes TO service_role;

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- No client policies: codes are managed only by the backend (service_role bypasses RLS).
-- The redeem flow runs through a SECURITY DEFINER function below.

CREATE TRIGGER update_access_codes_updated_at
  BEFORE UPDATE ON public.access_codes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. code_redemptions table
CREATE TABLE public.code_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id uuid NOT NULL REFERENCES public.access_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.code_redemptions TO authenticated;
GRANT ALL ON public.code_redemptions TO service_role;

ALTER TABLE public.code_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redemptions"
  ON public.code_redemptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. org_access flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN org_access boolean NOT NULL DEFAULT false;

-- 4. redeem_access_code function (atomic check-and-claim)
CREATE OR REPLACE FUNCTION public.redeem_access_code(_code text)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _user_id uuid := auth.uid();
  _code_row public.access_codes%ROWTYPE;
BEGIN
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Not authenticated'::text;
    RETURN;
  END IF;

  -- Already redeemed a code?
  IF EXISTS (SELECT 1 FROM public.code_redemptions WHERE user_id = _user_id) THEN
    RETURN QUERY SELECT false, 'You have already redeemed an access code'::text;
    RETURN;
  END IF;

  -- Lock the code row to prevent concurrent over-redemption
  SELECT * INTO _code_row
  FROM public.access_codes
  WHERE lower(code) = lower(trim(_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Invalid access code'::text;
    RETURN;
  END IF;

  IF NOT _code_row.is_active THEN
    RETURN QUERY SELECT false, 'This access code is no longer active'::text;
    RETURN;
  END IF;

  IF _code_row.expires_at IS NOT NULL AND _code_row.expires_at < now() THEN
    RETURN QUERY SELECT false, 'This access code has expired'::text;
    RETURN;
  END IF;

  IF _code_row.redemptions_used >= _code_row.max_redemptions THEN
    RETURN QUERY SELECT false, 'This access code has reached its limit'::text;
    RETURN;
  END IF;

  -- Claim it
  INSERT INTO public.code_redemptions (code_id, user_id)
  VALUES (_code_row.id, _user_id);

  UPDATE public.access_codes
  SET redemptions_used = redemptions_used + 1
  WHERE id = _code_row.id;

  UPDATE public.profiles
  SET org_access = true
  WHERE user_id = _user_id;

  RETURN QUERY SELECT true, 'Organisation access unlocked'::text;
END;
$function$;

-- 5. Update cooldown check so org accounts are never blocked by the daily limit
CREATE OR REPLACE FUNCTION public.has_cooldown_passed(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM auth.users WHERE id = _user_id AND email IN ('rowland.jack@outlook.com', 'cecilia@seehere.ai')
    ) THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = _user_id AND org_access = true
    ) THEN
      -- Org accounts: unlimited daily, only blocked by an already-active session
      NOT EXISTS (
        SELECT 1 FROM public.sessions
        WHERE user_id = _user_id AND is_active = true
      )
    ELSE
      NOT EXISTS (
        SELECT 1
        FROM public.sessions
        WHERE user_id = _user_id
          AND ended_at IS NOT NULL
          AND DATE(ended_at AT TIME ZONE 'UTC') = DATE(NOW() AT TIME ZONE 'UTC')
      ) AND NOT EXISTS (
        SELECT 1
        FROM public.sessions
        WHERE user_id = _user_id
          AND is_active = true
      )
  END;
$function$;

-- 6. Update start_paid_session(_session_type) so org accounts get free 45-min sessions
CREATE OR REPLACE FUNCTION public.start_paid_session(_session_type text)
RETURNS TABLE(session_id uuid, new_balance integer, error_msg text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _session_id UUID;
  _new_balance INT;
  _user_id UUID := auth.uid();
  _is_org BOOLEAN;
BEGIN
  IF _user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::INT, 'Not authenticated'::TEXT;
    RETURN;
  END IF;

  SELECT org_access INTO _is_org FROM profiles WHERE user_id = _user_id;

  IF COALESCE(_is_org, false) THEN
    -- Org accounts: free, full-length session, no credit deduction
    INSERT INTO sessions (user_id, session_type, is_active)
    VALUES (_user_id, 'paid', true)
    RETURNING id INTO _session_id;

    RETURN QUERY SELECT _session_id, (SELECT balance FROM credits WHERE user_id = _user_id), NULL::TEXT;
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

  INSERT INTO sessions (user_id, session_type, is_active)
  VALUES (_user_id, _session_type, true)
  RETURNING id INTO _session_id;

  RETURN QUERY SELECT _session_id, COALESCE(_new_balance, (SELECT balance FROM credits WHERE user_id = _user_id)), NULL::TEXT;
END;
$function$;