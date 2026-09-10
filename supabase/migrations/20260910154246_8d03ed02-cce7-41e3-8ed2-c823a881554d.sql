REVOKE EXECUTE ON FUNCTION public.extend_session(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.auto_end_expired_sessions() FROM anon;
GRANT EXECUTE ON FUNCTION public.extend_session(uuid) TO authenticated;