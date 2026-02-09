
CREATE TABLE public.allowed_testers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE public.allowed_testers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_email_allowed(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_testers
    WHERE lower(email) = lower(_email)
  );
$$;

INSERT INTO public.allowed_testers (email) VALUES
  ('cecilia@seehere.ai'),
  ('alasdairswenson@gmail.com'),
  ('meg_rowland@hotmail.com'),
  ('jennyrowland62@gmail.com'),
  ('ce4counselling@yahoo.com'),
  ('rowland101@hotmail.co.uk'),
  ('rowland.jack@outlook.com');
