

# Open Up SeeHere -- Remove Allowlist, Simplify CTAs

## Overview

Remove the `allowed_testers` gating concept entirely. The site becomes open -- anyone can try for free or create an account. All "early access" / "request access" language is replaced with simple "Try for free" buttons that go directly to `/try/guidance`. The banner becomes a beta disclaimer rather than an invitation gate.

---

## Changes

### 1. `src/pages/Index.tsx` -- Simplify homepage

- **Banner**: Change from "Early Access Phase -- We're limiting early access..." to "Beta Testing Phase -- SeeHere is in beta. Your feedback helps us improve."  Remove the link to scroll to early-access section.
- **Hero CTA**: Replace the email input form with a simple "Try for free" button that navigates to `/try/guidance`. Add a check: if user is already logged in, redirect to `/dashboard` instead.
- **Mid-page buttons** (lines 336-342, 460-466): Change "Request early access" to "Try for free", navigate to `/try/guidance` instead of scrolling to early-access section.
- **Bottom "Early Access Signup" section** (lines 592-663): Remove entirely -- no more email collection form, no more `earlyEmail`/`earlyReason`/`earlySent`/`alreadyApproved` state.
- **Remove** the `#early-access` hash scroll effect, and all related state variables.
- **Remove** the `handleEarlySubmit` function and `supabase`/`toast` imports if no longer needed.

### 2. `src/pages/Auth.tsx` -- Remove allowlist check

- **Banner** (lines 101-109): Change to "Beta Testing Phase -- SeeHere is in beta. Your feedback helps us improve." Remove the "Join our first 50 testers" link.
- **Sign-up flow** (lines 50-56): Remove the `is_email_allowed` RPC check. Allow anyone to sign up directly without allowlist verification.

### 3. `src/components/SecureSessionModal.tsx` -- Remove allowlist check

- **Lines 32-37**: Remove the `is_email_allowed` RPC call and the "invite-only" error. Allow the user to sign up directly.

### 4. `src/pages/SupportAlternative.tsx` -- Minor text update

- Change "Free Early Access" to "Free to try" or "2 free sessions" (line 80).

---

## What is NOT being removed

- The `allowed_testers` table and `is_email_allowed` / `check_email_status` DB functions stay in the database (no destructive migration). They simply won't be called anymore.
- The `grant-beta-access` edge function stays deployed but won't be invoked from the frontend.
- The `send-welcome-email` edge function remains -- it's still called on sign-up from `SecureSessionModal` and `Auth`.

---

## Technical Details

### Index.tsx state cleanup
- Remove: `earlyEmail`, `earlyReason`, `earlySending`, `earlySent`, `alreadyApproved`
- Remove: `handleEarlySubmit` function
- Remove: `#early-access` hash scroll `useEffect`
- Remove: `Textarea` import, `supabase` import, `toast` import (if unused elsewhere)
- Keep: `useAuth` (for checking logged-in state on "Try for free" button)

### Index.tsx hero replacement
Replace the email form with:
```
<Button onClick={() => user ? navigate('/dashboard') : navigate('/try/guidance')}>
  Try for free
</Button>
```

### Auth.tsx sign-up change
Remove lines 50-56 (the `is_email_allowed` check). The sign-up just calls `signUp` directly.

### SecureSessionModal.tsx change
Remove lines 32-37 (the `is_email_allowed` check). Sign-up proceeds directly.

---

## Summary of Files Changed

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove early access forms, simplify all CTAs to "Try for free" linking to `/try/guidance`, update banner to beta disclaimer |
| `src/pages/Auth.tsx` | Remove allowlist check on sign-up, update banner text |
| `src/components/SecureSessionModal.tsx` | Remove allowlist check on sign-up |
| `src/pages/SupportAlternative.tsx` | Update "Free Early Access" text |

