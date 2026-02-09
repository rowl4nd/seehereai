

## Restrict Sign-Up to Approved Testers

### What This Does

Only people whose email you've pre-approved will be able to create new accounts. Existing users can still log in normally -- the check only happens during sign-up.

### Steps

**1. Create the `allowed_testers` table and check function (database migration)**

- Create an `allowed_testers` table with columns: `id` (UUID, primary key), `email` (text, unique, not null), `added_at` (timestamp, defaults to now)
- Enable RLS on the table with no public access policies (managed via backend UI only)
- Create a database function `is_email_allowed(email text)` that returns true/false by checking the table
- Seed the table with all 7 current user emails:
  - cecilia@seehere.ai
  - alasdairswenson@gmail.com
  - meg_rowland@hotmail.com
  - jennyrowland62@gmail.com
  - ce4counselling@yahoo.com
  - rowland101@hotmail.co.uk
  - rowland.jack@outlook.com

**2. Update sign-up flow (`src/pages/Auth.tsx`)**

- Before calling `signUp()`, call `supabase.rpc('is_email_allowed', { _email: email })`
- If the function returns `false`, show a toast: "Registration is currently invite-only. Please contact us for access." and skip sign-up
- Login and forgot-password flows remain unchanged

### Managing Testers

To add new testers later, insert their email into the `allowed_testers` table via the Cloud backend UI.

### Removing the Restriction

When ready for public launch:
1. Remove the allowlist check from `Auth.tsx`
2. Drop the `allowed_testers` table and function
3. Publish

### Technical: Database Migration SQL

```sql
-- Create allowed_testers table
CREATE TABLE public.allowed_testers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE public.allowed_testers ENABLE ROW LEVEL SECURITY;

-- Function to check if email is allowed (callable without auth)
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

-- Seed current users
INSERT INTO public.allowed_testers (email) VALUES
  ('cecilia@seehere.ai'),
  ('alasdairswenson@gmail.com'),
  ('meg_rowland@hotmail.com'),
  ('jennyrowland62@gmail.com'),
  ('ce4counselling@yahoo.com'),
  ('rowland101@hotmail.co.uk'),
  ('rowland.jack@outlook.com');
```

### Technical: Auth.tsx Change

In the sign-up branch of `handleSubmit`, add a check before calling `signUp()`:

```typescript
// Check allowlist before sign-up
const { data: isAllowed } = await supabase.rpc('is_email_allowed', { _email: email });
if (!isAllowed) {
  toast.error("Registration is currently invite-only. Please contact us for access.");
  setIsSubmitting(false);
  return;
}
```

