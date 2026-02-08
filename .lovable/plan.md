

# Remember User's Name (and Respect When They Decline)

## Overview

The chatbot will gently invite users to share their name, remember it for future sessions, and -- crucially -- also remember if someone prefers not to share their name, so it never asks again.

## How It Works

There are three possible states for a user:

1. **Name known** -- The chatbot greets them by name and never asks again
2. **Name declined** -- The chatbot knows not to ask and uses a warm, anonymous greeting
3. **Neither yet** -- New user; the chatbot gently invites them to share their name (once per session, as an optional invitation)

## Changes Required

### 1. Database: Add a `name_declined` column to `profiles`

A new boolean column `name_declined` (default `false`) on the `profiles` table. This flag is set to `true` when the AI detects the user has declined to share their name.

### 2. Backend Function: `supabase/functions/chat/index.ts`

- Accept two new optional fields in the request body: `userName` and `nameDeclined`
- Add a new section to the system prompt:

```
## USER NAME
- If a userName is provided, use it naturally and warmly. Do NOT ask for their name.
- If nameDeclined is true, the person has previously chosen not to share their name. Respect this completely. Do NOT ask for their name. Do not reference it. Just be warm and present.
- If neither userName nor nameDeclined is set, gently invite them to share their name early in the conversation. Frame it as purely optional (e.g., "Is there a name you'd like me to call you? No pressure at all if you'd prefer not to."). Only ask once. If they decline, respect it immediately and move on.
- If the user shares their name, append [NAME: TheirName] at the very end of your message.
- If the user explicitly declines to share their name, append [NAME_DECLINED] at the very end of your message.
- These tags must come AFTER your actual response text. They will be hidden from the user.
```

- After receiving the AI response, use regex to detect and strip both `[NAME: ...]` and `[NAME_DECLINED]` tags
- Return them as separate fields in the JSON response: `detectedName` and `nameDeclined`

### 3. Frontend: `src/pages/Mirror.tsx`

- Pass `profile?.display_name` as `userName` and `profile?.name_declined` as `nameDeclined` to the chat edge function
- After receiving a response:
  - If `detectedName` is returned and `display_name` is currently empty, save the name to the profile via `updateProfile({ display_name: detectedName })`
  - If `nameDeclined` is returned and not already set, save the preference via `updateProfile({ name_declined: true })`
- Personalise the initial greeting message:
  - If `display_name` exists: "Hello, [Name]. Welcome back. I'm here to listen..."
  - If `name_declined` is true: "Hello. Welcome back. I'm here to listen..." (no name prompt)
  - If neither: use the current generic greeting (the AI will handle asking in its first reply)

### 4. Profile Hook: `src/hooks/useProfile.tsx`

- Add `name_declined` to the `Profile` interface so the new column is available throughout the app

## Technical Details

- The `[NAME: ...]` tag is detected with regex `/\[NAME:\s*(.+?)\]/` and stripped server-side
- The `[NAME_DECLINED]` tag is detected with regex `/\[NAME_DECLINED\]/` and stripped server-side
- Both tags are removed from the message before it reaches the user -- they never see them
- If a user later changes their mind and shares their name, the `[NAME: ...]` tag will fire, saving their name and the `name_declined` flag can be reset
- The greeting personalisation happens in the frontend using already-loaded profile data, before any AI call is made

