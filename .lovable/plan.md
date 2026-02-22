

# Auth Page: Remove Sign-Up Tab, Add "Try for Free" Button

## Overview

Simplify the auth page to be login-only. Remove the tab switcher and sign-up form. Add a lavender "New here? Try for free" button below the sign-in button that navigates to `/try/guidance`.

## Changes to `src/pages/Auth.tsx`

### 1. Remove sign-up mode
- Lock `mode` to only `"login" | "forgot"` (remove `"signup"`)
- Remove `tabValue` variable
- Remove `signUp` from useAuth destructure
- Remove the `else` branch in `handleSubmit` that handles sign-up
- Remove `supabase` import (only used for welcome email on sign-up)

### 2. Remove the tab switcher
- Remove the entire tab bar (lines 117-157) -- the sliding pill with "Nice to See you again" / "New Here?" buttons
- The page just shows the sign-in form directly (or forgot-password form)

### 3. Add "New here? Try for free" button
- After the sign-in button, add a lavender-colored button (`bg-[#b9a3e0] hover:bg-[#a48fd0]`) that says "New here? Try for free"
- On click, navigate to `/try/guidance`

### 4. Simplify button label
- Remove the signup branch from `buttonLabel` -- it's now just "Sign in" or "Send reset link"

### 5. Update subtitle text
- Keep "Welcome" heading
- Update subtitle to remove mention of account requirement since we're directing new users to try first

## Result
The auth page becomes a clean sign-in page with two buttons:
1. **Sign in** (primary green) -- submits the login form
2. **New here? Try for free** (lavender) -- navigates to `/try/guidance`

Plus the "Forgot your password?" link and forgot-password flow remain unchanged.
