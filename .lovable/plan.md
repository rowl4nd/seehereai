

# Make the chatbot time-of-day aware

## What changes

The chatbot will detect the user's local time of day and adjust both its greeting and conversational tone accordingly -- warmer and softer in the evening, brighter in the morning, etc.

## Two places to update

### 1. Frontend greeting (`src/pages/Mirror.tsx`)

Update the `getGreeting()` function (around line 54) to use the current hour and vary the opening line:

- **Morning (5am-11am)**: "Good morning" -- fresh, gentle energy
- **Afternoon (12pm-4pm)**: "Good afternoon" -- warm, steady
- **Evening (5pm-8pm)**: "Good evening" -- winding down, cosy
- **Night (9pm-4am)**: "Hi there" -- calm, soft, acknowledging the late hour

Example output: "Good evening, Sarah. I'm here to listen. Take your time -- there's no rush. What's on your mind tonight?"

The closing word also shifts: "today" for daytime, "tonight" for evening/night.

### 2. Backend system prompt + time context (`supabase/functions/chat/index.ts`)

- Accept a new `timeOfDay` field in the request body (e.g. `"evening"`)
- Pass it from the frontend when calling the chat function
- Append a short section to the system prompt:

```
## TIME OF DAY CONTEXT
It is currently [evening]. Adjust your tone subtly:
- Morning: gentle, fresh energy
- Afternoon: warm, steady
- Evening: cosy, winding-down energy
- Night: calm, soft, acknowledging the late hour
Use time-appropriate language naturally (e.g. "tonight" instead of "today").
```

This keeps the AI's follow-up messages consistent with the greeting tone throughout the session.

### 3. Frontend chat call (`src/pages/Mirror.tsx`)

Update the two places where `supabase.functions.invoke("chat", ...)` is called (around lines 335 and 417) to include the `timeOfDay` value in the request body.

## Technical details

- Time of day is determined from `new Date().getHours()` on the client side -- this automatically uses the user's local timezone
- The `timeOfDay` string is one of: `"morning"`, `"afternoon"`, `"evening"`, `"night"`
- A small helper function `getTimeOfDay()` will be added near the top of `Mirror.tsx`
- The `getGreeting()` function will call this helper to pick the right salutation
- No new dependencies needed

## Files modified

- `src/pages/Mirror.tsx` -- time-aware greeting + pass `timeOfDay` to edge function
- `supabase/functions/chat/index.ts` -- accept `timeOfDay`, append context to system prompt

