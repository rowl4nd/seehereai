

## Plan: Fix CompleteRegistration pixel with localStorage + page-load fallback

### Single file change: `src/hooks/useAuth.tsx`

**Extract a helper function** `fireCompleteRegistrationOnce(user)` that:
1. Checks `localStorage` for key `sh_pixel_reg_fired_{userId}` — if present, skip
2. Checks `typeof window.fbq === "function"` — if not loaded, skip
3. Checks if `last_sign_in_at` is within 60 seconds of `created_at` (first login indicator)
4. If all pass: fires `fbq('track', 'CompleteRegistration', ...)` and sets the localStorage flag

**Call it in two places:**
1. **In `onAuthStateChange`** when `event === "SIGNED_IN"` — catches the signup moment
2. **In `getSession()` callback** when a session already exists on page load — catches the case where fbq wasn't loaded during signup

This ensures the event fires exactly once per new user, regardless of timing.

