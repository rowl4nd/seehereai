
## Fix: Messages After 5-Minute Warning Not Saved

### The Problem

When the 5-minute warning fires, the warning message is added to the screen but never saved to the database. Additionally, messages sent after the warning may not save correctly because `handleSend` captures a stale copy of the `messages` array (a React closure issue), so subsequent saves can overwrite or lose messages.

### The Fix

**Modified file: `src/pages/Mirror.tsx`**

1. **Save the warning message to the database** -- After appending the warning message in the timer `useEffect`, call `saveMessagesToDb()` with the updated message list so the warning (and the full conversation up to that point) is persisted.

2. **Fix stale closure in `handleSend`** -- Change `handleSend` to read from a `useRef` that always holds the latest messages, rather than relying on the `messages` state variable captured at render time. This ensures that when a user sends a message after the warning, the save includes all prior messages (including the warning).

   Specifically:
   - Add a `messagesRef` that syncs with `messages` via a `useEffect`
   - In `handleSend`, build `updatedWithUser` from `messagesRef.current` instead of `messages`
   - This guarantees the save always reflects the true current conversation

### Why This Happened

React state updates inside `setMessages((prev) => [...prev, newMsg])` update the state correctly for rendering, but other functions like `handleSend` still see the old `messages` value from when they were last rendered. So the warning message (and anything after it) gets "lost" from the database perspective even though it appears on screen.

### Files Changed

- `src/pages/Mirror.tsx` -- two targeted fixes as described above
