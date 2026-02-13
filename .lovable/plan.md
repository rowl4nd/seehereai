

# Send Welcome Email via Resend on Signup

## Summary
Create a backend function that sends a branded welcome email from `hello@seehere.ai` when a new user signs up, using the user's provided email copy.

## Changes

### 1. Create `supabase/functions/send-welcome-email/index.ts`
- Accepts `{ email }` in the request body
- Uses `RESEND_API_KEY` to call the Resend API
- Sends from `hello@seehere.ai` with subject "Welcome to See Here"
- Clean, minimal HTML email using the exact copy provided:
  - Thank you for first session
  - Reflection prompts (what stayed, what felt clearer, what felt unfinished)
  - 6-8 sessions recommendation
  - "Your space is here" sign-off
- CORS headers included
- Fire-and-forget (failure won't block signup)

### 2. Update `supabase/config.toml`
- Add `[functions.send-welcome-email]` with `verify_jwt = false`

### 3. Update `src/pages/Auth.tsx`
- After successful signup, call the welcome email function (non-blocking)
- Change success toast from "Check your email to confirm your account" to "Welcome to See Here"

## Prerequisite
- The `seehere.ai` domain must be verified in Resend for sending from `hello@seehere.ai`

