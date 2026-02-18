

# Automate beta access with instant approval and welcome email

## What changes

### 1. New backend function: `grant-beta-access`

A new function that:
- Inserts the email into the `allowed_testers` table (using service role key, with `ON CONFLICT DO NOTHING` for duplicates)
- Sends the branded welcome email you provided via Resend, with proper clickable links for seehere.ai and the Google Form

Email details:
- From: `See Here <hello@seehere.ai>`
- Subject: "Your See Here access is live"
- Body: your exact copy, with `www.seehere.ai` and the Google Forms feedback link rendered as proper HTML anchor tags
- Styled consistently with the existing email templates (Georgia font, warm background, green accents)

### 2. Update `handleBetaSubmit` in `src/pages/Index.tsx`

- If email is already approved (existing cross-check): show the "already live" message as now
- If email is NOT yet approved: call `grant-beta-access` instead of `send-contact-email`
- Change the success confirmation message to: **"Request received -- please check your emails (and junk folder)"**
- Update the toast to match

### 3. Clean up outdated copy

- **Hero confirmation panel** (line 188-191): change "We'll review your request and get back to you within 24-48 hours" to "Request received -- please check your emails (and junk folder)"
- **Bottom section confirmation panel** (line 525-530): same change
- **Bottom section static text** (line 573-575): change "We'll review your request and send access within 24-48 hours" to something like "Access is granted instantly -- check your inbox"

### 4. Config update

Add `grant-beta-access` to `supabase/config.toml` with `verify_jwt = false` (unauthenticated visitors use this form).

## Technical details

- Uses existing secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` -- all already configured
- The function creates a Supabase admin client to insert into `allowed_testers` bypassing RLS
- Duplicate emails are handled gracefully with `ON CONFLICT DO NOTHING`
- No database migrations needed -- the `allowed_testers` table already has the right schema
- The `send-contact-email` function is no longer called from the beta forms but remains available for the Contact page

