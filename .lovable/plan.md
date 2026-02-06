

# Fix: Credits Not Loading After Stripe Purchase

## What Happened
After completing payment on Stripe, the credits weren't added to your account. This is because the current setup relies entirely on you landing on a specific "payment success" page to verify and credit your account. Since Stripe checkout opened in a new tab, your login session wasn't available in that tab, so the verification step was skipped entirely.

## The Fix
We'll add a **Stripe webhook** -- a secure server-side endpoint that Stripe calls automatically whenever a payment succeeds. This means credits will be added to your account reliably, regardless of whether you close the tab, lose internet, or anything else.

We'll also update the Dashboard to automatically check for and apply any unprocessed payments when you visit it.

## What Will Change

### 1. New backend function: `stripe-webhook`
A new server-side function that Stripe calls directly when a payment completes. It will:
- Verify the request is genuinely from Stripe using a webhook secret
- Extract the user ID and session count from the payment metadata
- Add the credits to your account
- Record the purchase (with duplicate protection so credits are never added twice)

### 2. Update the Dashboard
When you return to the dashboard after a purchase, it will also attempt to verify any recent unprocessed checkout sessions as a fallback.

### 3. Update the Payment Success page
Make it work better when opened in a new tab by handling the case where the user isn't logged in -- it will show a simple "Payment received" message and suggest returning to the dashboard.

## Setup Required From You
After I implement this, you'll need to:
1. Go to your **Stripe Dashboard** > Developers > Webhooks
2. Add a new endpoint URL: `https://ntmcghgamswdygvnnsrc.supabase.co/functions/v1/stripe-webhook`
3. Select the event: `checkout.session.completed`
4. Copy the **Webhook Signing Secret** (starts with `whsec_`) and provide it to me so I can add it as a secret

---

## Technical Details

### New file: `supabase/functions/stripe-webhook/index.ts`
- Listens for `checkout.session.completed` events from Stripe
- Verifies the webhook signature using `STRIPE_WEBHOOK_SECRET`
- Extracts `user_id`, `sessions`, and `package_id` from session metadata
- Uses the admin client to upsert credits and record the purchase
- Idempotent: checks `credit_purchases.stripe_payment_id` to prevent double-crediting
- JWT verification disabled (Stripe calls this directly, not a browser)

### Config: `supabase/config.toml`
- Add `[functions.stripe-webhook]` with `verify_jwt = false` since Stripe sends the request directly (not a logged-in user)

### Updated: `src/pages/PaymentSuccess.tsx`
- If the user is authenticated, verify payment as before
- If not authenticated (new tab scenario), show a friendly message: "Payment received! Return to your dashboard to see your updated credits."
- This handles the case where the Stripe redirect lands in a tab without an active session

### New secret required: `STRIPE_WEBHOOK_SECRET`
- This is the signing secret from Stripe's webhook configuration
- Used to verify that incoming webhook requests are genuinely from Stripe
