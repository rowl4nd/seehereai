

# Resume Active Sessions

## The Problem

Right now, if you navigate away from the Mirror page mid-session, your messages are lost and there's no way to get back. The timer is already based on the session start time in the database, so it would count down correctly -- but the page doesn't support resuming.

## What Changes

### 1. Dashboard -- Show "Resume session" button

When there's an active session with time remaining, the Dashboard will show a **"Resume session"** button instead of "Begin a session". This takes you straight back to the Mirror, skipping the guidance screens.

If the active session has expired (started too long ago and the timer has run out), it will be automatically ended in the background so you see the normal dashboard.

**File:** `src/pages/Dashboard.tsx`

### 2. Mirror -- Handle resuming an existing session

When the Mirror page loads and detects an existing active session (from the database), it will:

- Skip the "start new session" logic (it already does this)
- Load the conversation messages from the database for that session
- Resume the timer from where it left off (already works due to `started_at` calculation)
- Show a "Welcome back" message if messages were loaded
- If the session has expired while you were away, automatically end it and redirect to cooldown

**File:** `src/pages/Mirror.tsx`

### 3. Save messages during the session (not just at the end)

Currently, messages are only saved to the `conversations` table when you click "End session". To support resuming, we need to save messages as they happen:

- Create (or update) the conversation record when the session starts
- Update the conversation's `messages` field after each new message exchange
- This way, if you navigate away, the messages are already saved and can be loaded back

**File:** `src/pages/Mirror.tsx`

### 4. Auto-end expired sessions

Add logic so that if an active session exists but its timer has fully elapsed (e.g., you left 2 hours ago), it gets automatically ended rather than letting you back into a dead session.

**Files:** `src/pages/Mirror.tsx`, `src/pages/Dashboard.tsx`

## Summary of flow

1. You're in a session on the Mirror page, 10 minutes in
2. You accidentally close or navigate away
3. You land on the Dashboard -- it shows "Resume session" with the time remaining
4. You click it, go straight to Mirror (no guidance screens)
5. Mirror loads your messages from the database, resumes the timer with the correct time left
6. You continue your conversation as normal

