

# Implement Resend Email Integration

## Step 1: Store the Resend API Key
- Securely store `RESEND_API_KEY` as a backend secret

## Step 2: Create the Send Email Edge Function
- Create `supabase/functions/send-email/index.ts`
- Handles two email types: **confirmation** and **password reset**
- Sends branded HTML emails from **hello@seehere.ai** via the Resend API
- Clean, minimal templates matching SeeHere's calm, serif-font aesthetic

## Step 3: Configure Authentication to Use Custom Email Hook
- Update `supabase/config.toml` to register the `send-email` function as an auth email hook
- Set `verify_jwt = false` for the function since auth hooks call it directly

## Step 4: Email Templates

- **Confirmation email**
  - From: `hello@seehere.ai`
  - Subject: "Welcome to SeeHere -- please verify your email"
  - Contains a verification link
  - Warm, welcoming tone

- **Password reset email**
  - From: `hello@seehere.ai`
  - Subject: "Reset your SeeHere password"
  - Contains a reset link
  - Clear, reassuring tone

## What This Fixes
- Emails sent from your verified `hello@seehere.ai` address instead of shared infrastructure
- Much better inbox placement with Hotmail, Outlook, Gmail, etc.
- No changes to the existing login/signup UI -- purely a backend improvement

