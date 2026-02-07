
# Add Forgot Password Flow

## Overview
Add a "Forgot password?" link on the login page that lets users reset their password via email. This uses the built-in password reset feature from the authentication system — no extra email services needed.

## What Changes

### 1. Auth page — Add "Forgot password?" link and reset mode
**File:** `src/pages/Auth.tsx`

Add a third mode to the auth page: "forgot password". When clicked:
- The form changes to show just the email field (no password)
- The title changes to "Reset your password"
- The button says "Send reset link"
- It calls the password reset function, which sends an email with a link
- After sending, it shows a success message telling the user to check their email
- A "Back to sign in" link lets them return to the login form

### 2. Auth hook — Add `resetPassword` function
**File:** `src/hooks/useAuth.tsx`

Add a `resetPassword(email)` function to the auth context that calls the built-in password reset method. The reset email will contain a link that brings the user back to the app.

### 3. New page — Reset Password form
**File:** `src/pages/ResetPassword.tsx` (new)

When the user clicks the link in their email, they arrive at `/reset-password`. This page:
- Detects the reset token from the URL (handled automatically by the auth system)
- Shows a simple form with "New password" and "Confirm password" fields
- Updates the password and redirects to the dashboard

### 4. App routes — Add the new route
**File:** `src/App.tsx`

Add a route for `/reset-password` pointing to the new ResetPassword page.

## User Flow

1. On the login page, user clicks "Forgot your password?"
2. They enter their email and click "Send reset link"
3. They see a message: "Check your email for a reset link"
4. They click the link in the email, which brings them to `/reset-password`
5. They enter a new password and confirm it
6. They're logged in and redirected to the dashboard
