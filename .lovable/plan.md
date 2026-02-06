

# Fix: Credit Purchases Not Being Applied

## The Problem

When a user completes a Stripe checkout, credits are never added because:

1. Checkout opens in a **new browser tab** (needed to work around iframe restrictions)
2. The new tab has **no authenticated session**, so `verify-payment` is skipped
3. The Stripe webhook has **no logs** -- it's likely not registered in your Stripe Dashboard, so the fallback never fires

## The Fix (Two Parts)

### Part 1: Make verify-payment work without authentication

Currently, `verify-payment` requires an authenticated user to call it. Instead, it should use the **Stripe session ID** to look up the payment and get the `user_id` from the session metadata -- no login needed.

**Changes to `supabase/functions/verify-payment/index.ts`:**
- Remove the authentication requirement
- Use the Stripe Checkout Session ID to retrieve payment details directly from Stripe
- Get the `user_id` from the session's metadata (which was set during checkout creation)
- Keep all the same idempotency checks and credit-updating logic

### Part 2: Fix the payment success page

**Changes to `src/pages/PaymentSuccess.tsx`:**
- Remove the check that skips verification when unauthenticated (lines 26-29)
- Always call `verify-payment` when a `session_id` is present, regardless of auth state
- Remove the auth-dependent logic since verify-payment no longer needs it

### Part 3: Manually credit your account

Run a database update to add the 1 credit you already paid for, since that payment was processed by Stripe but never reflected in the app.

## What About the Webhook?

The webhook is still good to have as a safety net, but it requires you to register the endpoint URL in your Stripe Dashboard. That's a separate step you can do later. With the fix above, the primary path (verify-payment on the success page) will work reliably without it.

## Technical Summary

```text
BEFORE:
  User pays --> New tab opens --> No auth session --> verify-payment skipped
                                                  --> Webhook not configured --> Credits never added

AFTER:
  User pays --> New tab opens --> verify-payment called (no auth needed)
                              --> Uses Stripe session ID to verify + credit user
                              --> Webhook remains as backup safety net
```

## Files Changed

1. `supabase/functions/verify-payment/index.ts` -- Remove auth requirement, use Stripe session metadata for user identification
2. `src/pages/PaymentSuccess.tsx` -- Always call verify-payment regardless of auth state
3. Database -- One-time manual credit for the missed purchase

