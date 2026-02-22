CREATE OR REPLACE FUNCTION public.check_email_status(_email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _is_allowed boolean;
  _is_existing_user boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_testers WHERE lower(email) = lower(_email)
  ) INTO _is_allowed;

  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE lower(email) = lower(_email)
  ) INTO _is_existing_user;

  RETURN jsonb_build_object(
    'is_allowed', _is_allowed,
    'is_existing_user', _is_existing_user
  );
END;
$$;