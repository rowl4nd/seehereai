## Plan: Update welcome email content

Update `supabase/functions/send-welcome-email/index.ts` to replace the current email body with the new copy.

### New email body
- Greeting: "Hi,"
- "Welcome to SeeHere."
- "We hope your first session felt like a safe space to talk."
- "There's no pressure to rush back. But whenever something's on your mind - big or small - your space is here."
- "Most people find that talking freely more often is when things start to shift. Not because anything is fixed, but because it gives you time to reflect on your thoughts and feelings."
- "Your next session is waiting whenever you're ready."
- CTA button/link: **Start your next session →** linking to `https://seehere.ai/auth` (the login page)
- Sign-off: "Take care, The SeeHere Team"

### Changes
- Replace the HTML body content in the edge function.
- Remove the old "Help us build the future of SeeHere" feedback section and 6-free-sessions offer.
- Style the CTA as a prominent button using the existing sage green accent (`#709474`) consistent with the current template.
- Keep the existing wrapper styles (serif font, white card on cream background, sign-off divider).
- Redeploy the `send-welcome-email` edge function.

### Out of scope
- No changes to when/where the email is triggered (still only on guest → account migration in `GuestChat.tsx`).
- No subject line change (stays "Welcome to See Here").
- No sender change.
