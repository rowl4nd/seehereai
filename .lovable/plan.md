# Add access code entry to the sign-up modal

## Goal
Let people enter their access code while signing up — right inside the "Save Your Conversation" modal — so org access is unlocked immediately, instead of finding the code field later on the dashboard. The field stays **optional**: anyone can still sign up without a code.

## How it works today
- The guest tries the chat, then sees the **Save Your Conversation** modal (`SecureSessionModal`) to create an account (email/password, Google, or Apple).
- After sign-up, `GuestChat` detects the new signed-in user and runs its migration step: marks onboarding done, starts a session, saves the conversation, sends the welcome email.
- Access codes are redeemed **only afterwards**, from the Dashboard, via the secure `redeem_access_code` backend function (which needs the user to be signed in).

## What changes

### 1. Add an optional access code field to the sign-up modal
In `SecureSessionModal.tsx`:
- Add a small, optional "Access code (optional)" input near the bottom of the form, with a short helper line like "Have an organisation code? Enter it to unlock unlimited access."
- Keep it visually quiet so it doesn't distract regular sign-ups — it's a secondary field.
- Trim and lightly validate the value (non-empty after trim, reasonable max length); never block sign-up if it's empty.

### 2. Remember the code through sign-up
Because Google/Apple sign-up redirects the page (losing in-memory state), the code is stored in `sessionStorage` (`pending_access_code`) the moment the user submits — before the sign-up call. This works for email, Google, and Apple alike.

### 3. Redeem the code once signed in
In `GuestChat`'s post-sign-up migration step (the effect that runs when the new user appears):
- If a `pending_access_code` exists, call the existing `redeem_access_code` backend function **first**, before starting the session.
- On success: clear the stored code and show a brief confirmation ("Organisation access unlocked"). The session that then starts will already be an org (unlimited) session.
- On failure (invalid/expired/limit reached): clear the stored code, show a gentle message, and continue the normal free sign-up — they're not blocked, they just don't get org access. They can still try again later from the dashboard.

### 4. Keep the dashboard entry as a fallback
The existing `AccessCodeRedeem` on the Dashboard stays, so anyone who didn't enter a code at sign-up (or mistyped it) can still redeem later. No change to its behaviour.

## Out of scope
- No change to the `redeem_access_code` logic, the one-code-per-user rule, or unlimited-access behaviour.
- No change to the login page or admin tooling.
- No new database changes.

## Technical notes
- `SecureSessionModal.tsx`: new controlled `accessCode` state; write `sessionStorage.setItem("pending_access_code", code.trim())` in all three submit paths (email, Google, Apple) right before the auth call; clear it on the modal's "discard" path alongside the other guest keys.
- `GuestChat.tsx` `migrateGuestData`: at the top, read `pending_access_code`; if present, `await supabase.rpc("redeem_access_code", { _code })`, branch on `data?.[0]?.success`, then `sessionStorage.removeItem("pending_access_code")`. Run this before `start_paid_session` so an org account starts a full org session.
- No edge function or schema work needed — `redeem_access_code` already runs as the signed-in user.
