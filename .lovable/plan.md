
## Early "End Session" with Wrap-Up and Read-Only State

### What will change

When a user presses "End session" before the timer runs out, the app will behave differently depending on whether the 5-minute warning has already been shown:

1. **Before the 5-minute warning**: The chatbot will send one final wrap-up message summarising the conversation, then the session ends. The user stays on the page in read-only mode with a "Return to Dashboard" button.

2. **After the 5-minute warning** (or if the session just expires): The session ends immediately (the AI is already in wrap-up mode). The user stays on the page in read-only mode with a "Return to Dashboard" button.

In both cases the user can scroll back and read the full conversation before choosing to leave.

### Technical Details

**File: `src/pages/Mirror.tsx`**

Modify `handleEndSession`:

- If `showEndWarning` is false (before the 5-minute mark):
  1. Disable the input immediately (set `sessionEnded = true`).
  2. Show a loading indicator while the AI generates its wrap-up.
  3. Send a final request to the `chat` edge function with a `[EARLY_END]` prefix on a system-like message, prompting the AI to summarise the session.
  4. Display the AI's wrap-up response as the final message.
  5. Save all messages to the database.
  6. Call `endSession()` to close the session server-side.
  7. Button changes to "Return to Dashboard".

- If `showEndWarning` is true (already past the 5-minute mark):
  1. Set `sessionEnded = true`.
  2. Save messages and call `endSession()`.
  3. Button changes to "Return to Dashboard".
  4. User stays on the page (no navigation).

**File: `supabase/functions/chat/index.ts`**

Add handling in the system prompt for `[EARLY_END]`:

- Add a new section to the system prompt: when the AI receives a message starting with `[EARLY_END]`, it should provide a brief, warm wrap-up of the conversation themes discussed, similar to the 5-minute warning wrap-up mode but as a single closing message.

### Summary of behaviour changes

| Scenario | Current behaviour | New behaviour |
|---|---|---|
| User presses "End session" before 5-min warning | Navigates to cooldown immediately | AI sends wrap-up message, user stays on page in read-only mode |
| User presses "End session" after 5-min warning | Navigates to cooldown immediately | Session ends, user stays on page in read-only mode |
| Timer expires naturally | User stays on page (already implemented) | No change |
| "Return to Dashboard" button | Shown when timer expires | Also shown after early end |
