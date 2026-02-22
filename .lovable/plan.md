

# Restrict OAuth to Sign-In Only on Auth Page + Add OAuth to Secure Session Modal

## Problem
Currently, the Google and Apple OAuth buttons on the Auth page will automatically create a new account if one doesn't exist. New users should only be able to create accounts through the SecureSessionModal (the popup on the try/mirror page).

## Solution

### 1. Auth Page -- Detect and reject new sign-ups via OAuth

After an OAuth sign-in completes on the Auth page, check whether the user was just created (i.e., `created_at` is within the last 60 seconds). If so:
- Sign the user out immediately
- Show a toast: "No account found. Please try SeeHere for free first to create your account."

This is done by enhancing the existing `useEffect` that watches for `user` changes. When a user appears, we compare their `created_at` timestamp to now. If the account is brand new, we know it was just auto-created by the OAuth flow and we reverse it.

### 2. SecureSessionModal -- Add Google and Apple sign-up buttons

Add an "or" divider and the same Google/Apple OAuth buttons below the "Create Account" form button. These will use `lovable.auth.signInWithOAuth()` which will create the account if it doesn't exist (the desired behavior here). After OAuth completes, call `onSuccess()` to continue the flow.

## Changes

### `src/pages/Auth.tsx`
- In the `useEffect` that checks for `user`, add logic to detect if the user's `created_at` is within the last 60 seconds
- If newly created, call `signOut()`, show an error toast, and return early (don't navigate to dashboard)

### `src/components/SecureSessionModal.tsx`
- Import `lovable` from `@/integrations/lovable/index`
- Add an "or" divider after the "Create Account" button
- Add Google Sign-in button (same SVG icon and style as Auth page)
- Add Apple Sign-in button (same SVG icon and style as Auth page)
- Both buttons call `lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin })` and call `onSuccess()` on completion

## Technical Details

**Detecting new accounts on Auth page:**
```typescript
useEffect(() => {
  if (user) {
    const createdAt = new Date(user.created_at);
    const now = new Date();
    const isNewAccount = (now.getTime() - createdAt.getTime()) < 60000;
    
    if (isNewAccount) {
      signOut();
      toast.error("No account found. Please try SeeHere for free first to create your account.");
      return;
    }
    navigate("/dashboard");
  }
}, [user, navigate]);
```

This approach works because:
- Existing users signing in via OAuth will have a `created_at` well in the past -- they proceed normally
- New users auto-created by OAuth will have a `created_at` within seconds -- they get signed out with a helpful message
- On the SecureSessionModal, there's no such check, so OAuth freely creates accounts there
