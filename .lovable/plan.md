

## Plan: Fix Stripe checkout redirect on /credits

**Problem:** `window.open(url, "_blank")` fires after an `await`, so it's not in the same call stack as the user's click. Browsers (especially Safari/mobile) block this as an unrequested popup, leaving the button stuck on "Redirecting...".

**Fix:** In `src/pages/Credits.tsx`, replace the post-async `window.open(..., "_blank")` with a same-tab redirect using `window.location.href = url`. Same-tab navigation is not subject to the popup blocker, so it works reliably after an async call. This is also the pattern already used elsewhere in the codebase.

### Change

**File:** `src/pages/Credits.tsx` (inside `handlePurchase`)

Replace:
```ts
if (response.data?.url) {
  window.open(response.data.url, "_blank");
}
```

With:
```ts
if (response.data?.url) {
  window.location.href = response.data.url;
}
```

### What stays the same
- All styling, layout, packages, copy, analytics tracking, error handling, and the `purchasingId` loading state are untouched.
- The `create-checkout` edge function is not modified — it's already returning the URL correctly.
- Stripe `success_url` (`/payment-success`) and `cancel_url` (`/credits`) already handle return navigation, so same-tab redirect is safe.

### Notes
- Trade-off: the user leaves the app tab instead of opening checkout in a new tab. Stripe redirects them back to `/payment-success` or `/credits` on completion/cancel, so the flow remains intact.
- No changes to auth, DB, or backend logic.

