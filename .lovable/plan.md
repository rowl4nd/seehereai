

# Update STRIPE_WEBHOOK_SECRET

Update the `STRIPE_WEBHOOK_SECRET` with the live webhook signing secret you just provided (`whsec_rcz6t2F...`).

This is the final step to complete the Stripe live mode transition. After this update, your payment flow will be fully live.

## What happens
- The existing `STRIPE_WEBHOOK_SECRET` secret will be updated with your new signing secret
- The `stripe-webhook` edge function will use this to verify incoming webhook events from Stripe
- No code changes are needed -- only the secret value update

## After this
You should test the full payment flow end-to-end:
1. Go to the Credits page
2. Purchase a session package
3. Complete payment with a real card
4. Verify credits are added to your account

