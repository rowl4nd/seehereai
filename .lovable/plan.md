

## Add Second Crisis Trigger Session-End Rule

A small change to the system prompt in the chat edge function to instruct the AI that if crisis resources are triggered a second time in the same session, it should gently tell the user it cannot continue and end the session.

### What changes

**Modified file: `supabase/functions/chat/index.ts`**

In the "If someone asks for such information" list (lines 110-114), add a 5th point:

```
5. If crisis resources have already been provided once during this session and are triggered again, gently let the person know that you care about their safety but are not equipped to continue, and that the session will now end. Append [END_SESSION] at the very end of your message. Example: "I really care about your safety, and I can hear how much pain you're in. I'm not the right support for what you're going through right now. Please do reach out to the Samaritans on 116 123 — they're available 24/7 and are there for exactly this. I'm going to close our session now so you can focus on getting the support you deserve."
```

**Modified file: `src/pages/Mirror.tsx`** (or wherever AI responses are processed)

Add logic to detect the `[END_SESSION]` tag in the AI response, strip it from the displayed message, and automatically end the session -- similar to how `[NAME:]` and `[NAME_DECLINED]` tags are already handled.

### Technical detail

- The `[END_SESSION]` tag follows the same pattern as the existing `[NAME:]` tag: appended at the end of the AI's message, stripped before display, and used to trigger an action (in this case, calling `endSession`).
- The edge function will also strip the tag from the response and return a `endSession: true` flag in the JSON, consistent with how `detectedName` is returned.

