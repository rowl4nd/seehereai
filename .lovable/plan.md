

# Email Delivery Status

## Current State
- **Email confirmation is DISABLED** — users can sign up and log in immediately without verifying their email.
- SMTP via Resend is **not configured** because it requires migrating to external Supabase, which we don't want to do at this stage.
- The `RESEND_API_KEY` secret is still stored and can be used later if we migrate.
- The `send-email` Edge Function has been deleted (no longer needed).

## Future
- If/when we migrate to external Supabase, we can configure Resend SMTP and re-enable email confirmation.
