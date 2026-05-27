## Plan: Send "free sessions ended" email after the 2nd free session

### New edge function

Create `supabase/functions/send-free-sessions-ended-email/index.ts` (modeled on `send-welcome-email`):

- Sent via Resend from `See Here <hello@seehere.ai>`
- Subject: **"Your free sessions are complete"**
- Same visual styling as welcome email (cream bg, white card, serif, sage green CTA)
- CTA button "Continue your sessions →" linking to `https://seehere.ai/credits`

**Copy:**

> Hi,
>
> You've just finished your two free sessions on SeeHere. We hope they offered a quiet space to think and be heard.
>
> To keep going, you can unlock paid sessions for a small amount. Each paid session lasts **45 minutes** - almost twice as long as your free ones - giving you the room to go deeper into whatever's on your mind.
>
> We suggest at least **8 sessions** to get the most out of SeeHere. That's usually when patterns start to surface and reflection begins to settle into something useful.
>
> Your next session is waiting whenever you're ready.
>
> [Continue your sessions →]
>
> Take care,
> The SeeHere Team

### Trigger logic

In `src/hooks/useSessions.tsx` `endSession()`, after the DB update succeeds:

- If the ended session's `session_type === 'free'` AND the profile's `free_sessions_used >= 2` AND a "sent" flag is not yet set → invoke the new edge function with `{ email: user.email }`, then set the flag.

### Migration

Add a boolean column `free_sessions_ended_email_sent` (default false) to `public.profiles` to prevent duplicate sends.

### Out of scope

- No change to the welcome email
- No change to session timing, credit, or pricing logic
- No change to the default Supabase confirmation email