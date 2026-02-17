

# Switch Stripe from Test to Live Mode

There are 3 things that need updating to go live:

## 1. Update the STRIPE_SECRET_KEY secret
Your current secret key is likely a test key (starting with `sk_test_`). You need to replace it with your **live secret key** (starting with `sk_live_`).

You can find your live secret key at: **Stripe Dashboard > Developers > API Keys**

## 2. Create live products and prices + update the code
Products and prices created in test mode do NOT carry over to live mode. We need to create 4 new products with prices in live mode:

| Package | Price (GBP) |
|---------|-------------|
| 1 Session | 5.00 |
| 4 Sessions | 12.00 |
| 8 Sessions | 20.00 |
| 16 Sessions | 32.00 |

I will create these using the Stripe tools, then update the price IDs in `supabase/functions/create-checkout/index.ts`.

## 3. Update the STRIPE_WEBHOOK_SECRET
You need to create a **new webhook endpoint** in Stripe's live mode dashboard:

- **URL**: `https://ntmcghgamswdygvnnsrc.supabase.co/functions/v1/stripe-webhook`
- **Event**: `checkout.session.completed`

Then update the `STRIPE_WEBHOOK_SECRET` with the new signing secret from that live webhook.

## Steps in order
1. I will ask you to update the `STRIPE_SECRET_KEY` to your live key
2. I will create the 4 live products and prices in Stripe
3. I will update the price IDs in the checkout function code
4. I will ask you to set up the live webhook and update `STRIPE_WEBHOOK_SECRET`

---

### Technical detail
Only one file changes: `supabase/functions/create-checkout/index.ts` -- the 4 `priceId` values in the `PACKAGES` map get replaced with the new live-mode price IDs.
