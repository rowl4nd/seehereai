
-- Drop functions that depend on allowed_testers
DROP FUNCTION IF EXISTS public.is_email_allowed(_email text);
DROP FUNCTION IF EXISTS public.check_email_status(_email text);

-- Drop the allowed_testers table
DROP TABLE IF EXISTS public.allowed_testers;
