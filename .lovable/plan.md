

# Fix: Stripe Checkout Page Not Loading

## Problem
The `create-checkout` backend function works correctly and returns valid Stripe URLs. However, the app uses `window.location.href` to redirect, which fails because the app runs inside a preview iframe that blocks navigation to external domains (like `checkout.stripe.com`).

## Solution
Change the redirect method from `window.location.href` to `window.open(url, '_blank')` so the Stripe checkout opens in a new browser tab instead.

## Changes Required

**File: `src/pages/Credits.tsx`**
- Replace `window.location.href = response.data.url` with `window.open(response.data.url, '_blank')`
- This is a single-line change

## Why This Works
- `window.open` with `_blank` opens a new browser tab, bypassing the iframe's navigation restrictions
- The Stripe checkout will load normally in its own tab
- After payment, Stripe redirects the user back to your `/payment-success` page

## Technical Note
This is a known limitation of iframe-based preview environments. Once you publish the app to its own domain (not inside an iframe), `window.location.href` would also work. But using `window.open` is the recommended approach regardless, as it provides a better user experience.

