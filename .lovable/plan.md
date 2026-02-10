

## Session History on the Dashboard

Add a "Past Sessions" section to the Dashboard showing the last 5 completed sessions. Each entry displays the date and duration, and can be expanded to read through the conversation.

### What the user will see

- A new card below the Sessions card titled "Past Sessions"
- Each past session shows the date (e.g. "3 days ago") and duration (e.g. "22 min")
- Clicking a session navigates to a new read-only page (`/history/:sessionId`) that displays the full decrypted conversation in a clean, scrollable format
- If no past sessions exist, a subtle message like "No sessions yet" is shown

### Technical Details

**1. Update the backend function (`supabase/functions/encrypt-messages/index.ts`)**

Add a new action `"load-session-readable"` that:
- Takes a `sessionId`
- Verifies the user owns the conversation
- Returns the decrypted messages for display

The existing `"load"` action already does this, so we can reuse it from the frontend.

**2. New page: `src/pages/SessionHistory.tsx`**

- A read-only conversation viewer
- Fetches messages via `useEncryptedMessages().loadSessionMessages(sessionId)`
- Displays messages in a chat-like layout (user messages right-aligned, AI messages left-aligned)
- Back button to return to Dashboard
- Styled consistently with the app (font-serif headings, muted colors)

**3. Update `src/pages/Dashboard.tsx`**

- Fetch the last 5 completed sessions from the existing `sessions` state (already loaded by `useSessions`)
- Filter to `is_active === false` and take the first 5
- Display each as a clickable row with date and duration
- Link each row to `/history/{sessionId}`

**4. Add route in `src/App.tsx`**

- Add `<Route path="/history/:sessionId" element={<SessionHistory />} />`

**Files changed:**
- `src/pages/Dashboard.tsx` -- add Past Sessions card
- `src/pages/SessionHistory.tsx` -- new read-only conversation viewer page
- `src/App.tsx` -- add new route

No database or backend function changes needed -- the existing `load` action and sessions data already support this.

