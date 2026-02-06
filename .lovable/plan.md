

# Add Stripe Webhook Secret

## What We'll Do
1. **Store the webhook signing secret** (`STRIPE_WEBHOOK_SECRET`) securely in your backend so the webhook can verify that incoming requests are genuinely from Stripe.
2. **Manually add 4 credits** to your account from your earlier purchase that wasn't processed.

## That's It
Everything else is already implemented -- the webhook function, the config, and the updated payment success page are all in place. Once the secret is stored, future purchases will automatically credit your account.

