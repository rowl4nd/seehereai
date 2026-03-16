

## Issue: Headline metrics showing "—" because `session_number` is always off by one

### Root cause

In `src/pages/Mirror.tsx`, when a free session starts:
1. Line 251 increments `free_sessions_used` in the database
2. Line 256 calculates `sessionNumber` using the **stale** `profile.free_sessions_used` value (before the increment)

So a user on their 2nd free session has `free_sessions_used = 1` in the profile object. The event fires with `session_number: 1` instead of `2`. The edge function looks for `session_number === "2"` and finds nothing, so `secondFreeSessionCount` is 0, and the metric shows "—".

### Fix

**`src/pages/Mirror.tsx` line 256**: Account for the increment that already happened on line 251.

Change:
```typescript
const sessionNumber = (profile?.free_sessions_used || 0) + (sessionType === "paid" ? 1 : 0);
```
To:
```typescript
const sessionNumber = (profile?.free_sessions_used || 0) + 1;
```

This gives the correct 1-indexed session number regardless of session type (for free: stale value + 1 = correct; for paid: total free sessions + 1 = next session number).

### Note
Existing analytics data already recorded with the wrong `session_number` won't retroactively fix. Only new events going forward will have the correct value. The "—" will resolve once new second-session events are tracked.

