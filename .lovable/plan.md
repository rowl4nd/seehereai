

# Fix Guest Flow: Add T&C Acknowledgment + End Session Button

## Issues Found

1. **Missing T&C acknowledgment**: The `GuestGuidance.tsx` page only shows guidance cards but never asks the user to acknowledge the Terms & Conditions and Privacy Policy before entering the chat. The authenticated flow (`Onboarding.tsx`) has explicit checkboxes -- the guest flow needs equivalent gates.

2. **Missing End Session button**: After signing up via the modal on `/try`, the `GuestChat.tsx` page transitions to authenticated mode with a timer, but it never renders an "End session" button. The Mirror page (lines 694-702) has this button, but `GuestChat.tsx` was built without it.

---

## Changes

### 1. `src/pages/GuestGuidance.tsx` -- Add T&C acknowledgment step

After the last guidance card, instead of immediately showing "Begin your reflection", add an acknowledgment step with:
- A checkbox for Terms & Conditions (links to `/terms`)
- A checkbox for Privacy Policy (links to `/privacy`)
- The "Begin your reflection" button only enables once both are checked
- Store acknowledgment in `sessionStorage` alongside `guest_onboarding_complete`

This mirrors the `Onboarding.tsx` pattern but uses `sessionStorage` instead of the database.

### 2. `src/pages/GuestChat.tsx` -- Add End Session button

In the footer, when in authenticated mode (`authenticated === true`), add an "End session" / "Return to Dashboard" button below the timer bar -- matching the Mirror page's layout:
- When session is active: shows "End session" button that saves messages, ends the session via the database, and sets `sessionEnded = true`
- When session has ended: shows "Return to Dashboard" button that navigates to `/cooldown`
- Button has `min-h-[44px]` for mobile accessibility
- Before the 5-minute mark, ending early triggers an AI wrap-up message (matching Mirror behavior)

---

## Technical Details

### GuestGuidance.tsx changes
- Import `Checkbox` and `Label` from UI components
- Add state: `termsAccepted`, `privacyAccepted`
- After the last guidance card, show the acknowledgment UI (checkboxes + links)
- "Begin your reflection" button disabled until both checked
- On continue, store `guest_onboarding_complete` in `sessionStorage`

### GuestChat.tsx changes
- Add `showEndWarning` state (triggers at 5 min remaining, matching Mirror)
- Add the timer/end-session footer section when `authenticated === true`, containing:
  - Progress bar + time display (already exists)
  - "End session" / "Return to Dashboard" button
- Add `handleEndSession` function that:
  - If past 5-min warning: immediately ends session and saves messages
  - If before 5-min warning: sends `[EARLY_END]` to AI for wrap-up, then ends session
  - Sets `sessionEnded = true` so user stays on page in read-only mode
- Add 5-minute warning message injection in the timer effect (matching Mirror)

