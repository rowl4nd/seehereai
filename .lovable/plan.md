

# Configure SMTP to Route Auth Emails Through Resend

## What This Does
All authentication emails (confirmation, password reset, magic link) will be sent from `hello@seehere.ai` via Resend's SMTP servers instead of the default shared infrastructure. This improves deliverability to Hotmail, Outlook, Gmail, etc.

## What Changes

### Backend Configuration (programmatic)
- Use the `configure-auth` tool to set SMTP settings:
  - **Host**: `smtp.resend.com`
  - **Port**: `465`
  - **Username**: `resend`
  - **Password**: Your existing Resend API key
  - **Sender email**: `hello@seehere.ai`
  - **Sender name**: `SeeHere`

### Cleanup
- The `send-email` Edge Function created earlier is no longer needed (SMTP handles everything). It will be removed along with its config entry in `supabase/config.toml`.

## What Stays the Same
- No changes to the login/signup UI
- No changes to `useAuth.tsx` or `Auth.tsx`
- Email verification still required before sign-in
- Password reset flow unchanged

## Files Changed
- `supabase/config.toml` -- remove the `send-email` function entry
- `supabase/functions/send-email/index.ts` -- deleted (no longer needed)

