

## Fix: Remove User UPDATE Policy on Credits Table

### Problem

The `credits` table currently has an RLS policy called "Users can update own credits" that allows any authenticated user to directly modify their own credit balance via the API. This means a technically savvy customer could grant themselves unlimited credits by making direct API calls, bypassing the payment flow entirely.

### Solution

1. **Remove the UPDATE policy** on the `credits` table so customers cannot modify their balance directly
2. **Verify that all legitimate credit modifications already go through server-side functions** (edge functions using the service role key), which bypass RLS entirely

### Technical Details

**Database migration:**
- Drop the policy `Users can update own credits` from the `credits` table
- The `handle_new_user` trigger already creates credits server-side
- The Stripe webhook edge function (which processes payments) uses the service role key, so it is unaffected by RLS and will continue to work

**No code changes needed** -- the frontend never calls `supabase.from("credits").update(...)` directly. Credit balance changes are handled by the `stripe-webhook` and `verify-payment` edge functions, which use the service role key.

### What stays the same

- Users can still **read** their own credit balance (SELECT policy remains)
- Users can still **insert** their own credits row (INSERT policy remains, used by the signup trigger)
- Server-side functions continue to modify credits using the service role key, which bypasses RLS

