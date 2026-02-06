-- Update has_cooldown_passed to check calendar day (UTC) instead of 12 hours
CREATE OR REPLACE FUNCTION public.has_cooldown_passed(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT NOT EXISTS (
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
  );
$function$;

-- Update get_next_session_time to return start of next calendar day (UTC)
CREATE OR REPLACE FUNCTION public.get_next_session_time(_user_id uuid)
 RETURNS timestamp with time zone
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (
      SELECT (DATE(ended_at AT TIME ZONE 'UTC') + INTERVAL '1 day')::timestamp AT TIME ZONE 'UTC'
      FROM public.sessions
      WHERE user_id = _user_id
        AND ended_at IS NOT NULL
      ORDER BY ended_at DESC
      LIMIT 1
    ),
    NOW()
  );
$function$;