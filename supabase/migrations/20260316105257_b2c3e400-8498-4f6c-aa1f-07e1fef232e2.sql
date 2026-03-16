CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check own admin status"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);