

# Update Welcome Email Content

## Overview

Update the `send-welcome-email` edge function with the new email copy. The structure stays the same -- just replacing the body text and adding a hyperlink to the feedback form.

## Changes to `supabase/functions/send-welcome-email/index.ts`

Replace the HTML email body with the new copy:

- **Greeting**: "Hi,"
- **Opening**: "Welcome to SeeHere. We hope your first session felt steady, private, and helpful."
- **Reflection paragraph**: "Sometimes the space between sessions is where insight begins to settle. We often recommend 6-8 sessions to truly see patterns emerge and for the mental noise to soften."
- **Feedback section**: "Help us build the future of SeeHere" as a bold/styled heading, followed by the beta explanation. The words "Feedback Form" will be a hyperlink to `https://forms.gle/koT1ZR1bcUn8nnkX9` styled in the brand green color.
- **Closing**: "There's no pressure. Come back when you're ready."
- **Sign-off**: "Your space is here," on one line, then "The SeeHere Team" as the signature (replacing "-- See Here")

## Technical Detail

- Single file edit: `supabase/functions/send-welcome-email/index.ts`
- Only the `htmlBody` template string changes -- no logic changes
- The feedback form link uses the existing URL from the early access email: `https://forms.gle/koT1ZR1bcUn8nnkX9`
- The edge function will auto-deploy after the edit

