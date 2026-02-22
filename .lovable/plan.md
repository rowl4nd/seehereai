

# Align Guest Chat with Mirror + Homepage Entry Flow

## Overview

Two areas of work: (1) bring GuestChat.tsx in line with Mirror's conversation-saving and AI context rules so that guest-session conversations are properly available to the AI in future sessions, and (2) rework the homepage CTA so users enter their email, get added to the allowlist, and flow into the guest trial -- or get redirected to log in if they already have an account.

---

## 1. GuestChat.tsx -- Mirror Parity (Post-Authentication)

Once the user creates their account and the guest session is migrated, the chat should behave identically to the Mirror. The following features are currently missing from GuestChat and need to be added:

**Missing from GuestChat (present in Mirror):**
- `pastConversations` -- load history via `loadHistory()` after auth, pass to AI calls
- `userName` / `nameDeclined` -- pass `profile.display_name` and `profile.name_declined` to the chat edge function
- Name detection -- handle `detectedName` and `nameDeclined` in AI responses, update profile
- `endSession` flag -- handle `[END_SESSION]` from AI (crisis detection) to end session
- `pendingSaveRef` queue -- buffer saves when `conversationId` isn't set yet, flush when available
- `saveMessagesToDb` helper -- centralised save function with the pending queue pattern
- 5-minute warning message -- inject the "We have about 5 minutes left..." assistant message when timer hits 300s
- `[5 MINUTE WARNING]` tag -- prepend to user messages sent during wrap-up mode
- `addSessionToState` -- not used (GuestChat manages its own session state, so this is fine)

**Changes to `src/pages/GuestChat.tsx`:**
- Add `pastConversations` state, load via `loadHistory()` after migration completes
- Add `pendingSaveRef` and `saveMessagesToDb` helper matching Mirror's pattern
- In `handleSend` (authenticated path): pass `pastConversations`, `userName`, `nameDeclined` to the chat function body
- In `handleSend` (authenticated path): handle `detectedName`, `nameDeclined`, and `endSession` from response
- In `handleSend` (authenticated path): prepend `[5 MINUTE WARNING]` to user messages when `showEndWarning` is true
- In timer effect: inject 5-minute warning assistant message when `remaining <= 300`
- In `handleEndSession`: pass `pastConversations`, `userName`, `nameDeclined` to the wrap-up AI call
- Replace direct `saveMessages` calls with `saveMessagesToDb` throughout

---

## 2. Homepage CTA -- "Request Early Access and Try for Free"

**Current behaviour:** Two separate CTAs -- "Try a free reflection" links to `/try/guidance`, and the email form calls `grant-beta-access` then shows a confirmation.

**New behaviour:** Merge into a single flow. The email input + button become the sole entry point:

1. User enters email and clicks "Request early access & try for free"
2. System checks if the email belongs to an existing user (new DB function)
3. If **existing user**: show message inviting them to log in instead
4. If **on allowlist but not a user**: store email in `sessionStorage`, navigate to `/try/guidance`
5. If **not on allowlist**: call `grant-beta-access` to add them, store email, navigate to `/try/guidance`

**New database function: `check_email_status`**
- A `SECURITY DEFINER` function that checks both `allowed_testers` and `auth.users`
- Returns: `{ is_allowed: boolean, is_existing_user: boolean }`
- This avoids needing two separate calls and keeps the logic server-side

**Changes to `src/pages/Index.tsx`:**
- Remove the separate "Try a free reflection" button
- Modify `handleEarlySubmit` to:
  - Call `check_email_status` RPC
  - If existing user: show "already have an account" message with login link
  - If allowed but not user: store email in sessionStorage, navigate to `/try/guidance`
  - If not allowed: call `grant-beta-access`, store email, navigate to `/try/guidance`
- Change button text to "Request early access & try for free"

**Changes to `src/components/SecureSessionModal.tsx`:**
- On mount, pre-fill the email field from `sessionStorage` (key: `guest_email`)
- This way the user doesn't have to type their email again

**Changes to `src/pages/GuestGuidance.tsx`:**
- No changes needed -- it already stores `guest_onboarding_complete` in sessionStorage

---

## 3. Database Migration

Create one new RPC function:

```sql
CREATE OR REPLACE FUNCTION public.check_email_status(_email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _is_allowed boolean;
  _is_existing_user boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_testers WHERE lower(email) = lower(_email)
  ) INTO _is_allowed;

  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE lower(email) = lower(_email)
  ) INTO _is_existing_user;

  RETURN jsonb_build_object(
    'is_allowed', _is_allowed,
    'is_existing_user', _is_existing_user
  );
END;
$$;
```

---

## Summary of Files Changed

| File | Change |
|------|--------|
| `src/pages/GuestChat.tsx` | Add pastConversations, name context, warning message, pending save queue, endSession flag -- full Mirror parity for authenticated mode |
| `src/pages/Index.tsx` | Merge CTAs into single email-entry flow with user status check |
| `src/components/SecureSessionModal.tsx` | Pre-fill email from sessionStorage |
| Database migration | Add `check_email_status` RPC function |

