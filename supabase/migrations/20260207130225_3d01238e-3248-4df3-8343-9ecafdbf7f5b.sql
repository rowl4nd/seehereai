ALTER TABLE public.profiles
ADD COLUMN has_acknowledged_privacy_policy boolean NOT NULL DEFAULT false;