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