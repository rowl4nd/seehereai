

## Keep Users on Mirror After Session Ends

### What Changes

When the session timer reaches zero, instead of immediately redirecting to the cooldown page, the user stays on the Mirror page so they can re-read the conversation. The input area is disabled and the "End session" button changes to "Return to Dashboard", which navigates to the cooldown page when clicked.

### Behaviour

1. Timer hits zero -- session is ended in the database (as it does now), but no redirect happens
2. The text input and Send button become fully disabled
3. The "End session" button text changes to "Return to Dashboard"
4. Clicking "Return to Dashboard" navigates to `/cooldown`
5. The 5-minute warning message still appears as normal

### Technical Details (`src/pages/Mirror.tsx`)

- Add a `sessionEnded` state (`useState(false)`)
- In the timer effect, when `remaining <= 0`: call `endSession()` to close the session in the database, set `sessionEnded` to `true`, but do NOT call `navigate("/cooldown")`
- Disable the `Textarea` and `Send` button when `sessionEnded` is true (in addition to the existing `isLoading` check)
- Change the footer button: when `sessionEnded`, show "Return to Dashboard" (navigates to `/cooldown`); otherwise show "End session" (calls `handleEndSession` which redirects immediately as before)
- Update `handleEndSession` so it only calls `endSession` if the session hasn't already been ended (avoid double-ending)

