

# Fix: Send Welcome Email for All Signup Methods

## Problem
The welcome email is only triggered during email/password signup in the SecureSessionModal. Google and Apple OAuth signups skip it because the OAuth flow redirects the user away, and when they return, the migration logic runs but never sends the email.

## Solution
Move the welcome email trigger into the **migration logic** in `GuestChat.tsx`, which runs for all signup paths (email/password, Google, Apple). Remove the duplicate call from the modal.

## Changes

### 1. GuestChat.tsx -- Add welcome email to migration logic
- Inside the `migrateGuestData` function (around line 224, after migration completes successfully), add a fire-and-forget call to send the welcome email using `user.email`
- This ensures every new user gets the email regardless of how they signed up

### 2. SecureSessionModal.tsx -- Remove duplicate welcome email call
- Remove the `send-welcome-email` invocation from the email/password signup handler (line 49), since it will now be handled by the migration logic in GuestChat

## Technical Details

**GuestChat.tsx (inside migrateGuestData, after line 224):**
```typescript
// Fire-and-forget welcome email
if (user.email) {
  supabase.functions.invoke("send-welcome-email", { body: { email: user.email } }).catch(() => {});
}
```

**SecureSessionModal.tsx (line 48-49):**
Remove:
```typescript
// Fire-and-forget welcome email
supabase.functions.invoke("send-welcome-email", { body: { email } }).catch(() => {});
```
