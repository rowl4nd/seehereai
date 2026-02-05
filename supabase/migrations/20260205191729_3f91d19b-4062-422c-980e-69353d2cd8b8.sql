-- See Here Database Schema
-- Profiles, Sessions, and Credits with proper RLS

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
    has_acknowledged_terms BOOLEAN NOT NULL DEFAULT false,
    has_acknowledged_ai_disclosure BOOLEAN NOT NULL DEFAULT false,
    free_sessions_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create sessions table
CREATE TABLE public.sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL DEFAULT 'free' CHECK (session_type IN ('free', 'paid')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credits table (balance per user)
CREATE TABLE public.credits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create credit purchases table (history)
CREATE TABLE public.credit_purchases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sessions_purchased INTEGER NOT NULL,
    amount_paid INTEGER NOT NULL, -- in pence/cents
    stripe_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

-- Helper function to check cooldown (12 hours since last session ended)
CREATE OR REPLACE FUNCTION public.has_cooldown_passed(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.sessions
    WHERE user_id = _user_id
      AND ended_at IS NOT NULL
      AND ended_at > (NOW() - INTERVAL '12 hours')
  ) AND NOT EXISTS (
    SELECT 1
    FROM public.sessions
    WHERE user_id = _user_id
      AND is_active = true
  );
$$;

-- Helper function to get next available session time
CREATE OR REPLACE FUNCTION public.get_next_session_time(_user_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT ended_at + INTERVAL '12 hours'
      FROM public.sessions
      WHERE user_id = _user_id
        AND ended_at IS NOT NULL
      ORDER BY ended_at DESC
      LIMIT 1
    ),
    NOW()
  );
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Sessions RLS policies
CREATE POLICY "Users can view own sessions"
ON public.sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
ON public.sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
ON public.sessions FOR UPDATE
USING (auth.uid() = user_id);

-- Credits RLS policies
CREATE POLICY "Users can view own credits"
ON public.credits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
ON public.credits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
ON public.credits FOR UPDATE
USING (auth.uid() = user_id);

-- Credit purchases RLS policies
CREATE POLICY "Users can view own purchases"
ON public.credit_purchases FOR SELECT
USING (auth.uid() = user_id);

-- Only allow inserts via service role (Stripe webhook)
CREATE POLICY "Service role can insert purchases"
ON public.credit_purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_credits_updated_at
BEFORE UPDATE ON public.credits
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile and credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on auth.users to auto-create profile and credits
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();