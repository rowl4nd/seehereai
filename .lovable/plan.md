
# Cross-check beta signup emails against allowed testers

When a user enters their email into either beta access form (the hero mini-form or the full beta signup section), check the `allowed_testers` table first. If the email is already approved, show a friendly message telling them access is live and directing them to log in -- instead of sending the contact email.

## How it works

1. **Before sending the beta request email**, call the existing `is_email_allowed` RPC with the entered email
2. **If the email IS already in `allowed_testers`**:
   - Skip sending the contact email
   - Show a success-style toast: "Great news -- your access is already live! Please create your account using the Log in button at the top of the page."
   - Set `betaSent` to true and display a confirmation panel with the same message and a direct link to `/auth`
3. **If the email is NOT in `allowed_testers`**:
   - Proceed with the existing flow (send the contact email, show "we'll be in touch")

## Changes

**`src/pages/Index.tsx`** -- update `handleBetaSubmit`:
- Add an `is_email_allowed` RPC call at the start of the function (before invoking `send-contact-email`)
- If allowed, show a distinct confirmation message and return early
- If not allowed, continue with the existing email-sending logic
- The confirmation panel (shown after submit) will also need a variant for the "already approved" case, including a link/button to navigate to `/auth`

## Technical details

- Uses the existing `supabase.rpc('is_email_allowed', { _email: email })` -- no database or backend changes needed
- Both forms (hero and bottom section) share the same `handleBetaSubmit` handler and `betaSent` state, so both will be covered by a single code change
- A new boolean state (e.g. `alreadyApproved`) will control which confirmation message variant to display
- The confirmation panel for approved users will include a "Create your account" button linking to `/auth`
