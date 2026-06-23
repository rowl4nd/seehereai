# Organisation access via a shared promo code

Goal: let an organisation (e.g. the local charity) hand a single shared code to their staff. Each staff member creates their own normal account, enters the code once, and from then on gets **free, unlimited** access. The code stops working after 10 people have redeemed it.

This sits alongside the existing private-user flow (free trial → paid credits) without changing it.

## How it works for the charity's staff

```text
1. Staff member signs up / logs in as normal
2. Goes to a "Have an access code?" entry on the dashboard
3. Enters the shared code  ──►  validated server-side
4. If valid AND fewer than 10 redemptions used:
      • their account is marked as "organisation access"
      • the code's redemption count goes up by 1
5. From now on that account has free, unlimited sessions
```

The 11th person to try the code is politely told it has reached its limit.

## Decisions baked in (from your answers + earlier "free and unlimited")

- **One shared code, capped at 10 redemptions.** You can create more codes later, each with its own cap.
- **Unlimited access** — org accounts skip the 1-session-per-day cooldown so testers can run sessions back-to-back.
- **45-minute sessions** — org users get the full-length experience (same length as paid).
- **No charge** — sessions never touch credits or the free-session counter.
- **Manual control** — codes stay active until you switch them off (an optional expiry date field is included so you can set one later if wanted).

If any of these four aren't what you want, tell me and I'll adjust before building.

## What gets built

### 1. Database (migration)
- New table `access_codes`: the code text, a label (e.g. "Charity name – staff test"), max redemptions (default 10), how many have been used, active flag, optional expiry date.
- New table `code_redemptions`: records which user redeemed which code and when (one redemption per user). Lets you see exactly who used the code.
- Add `org_access` flag to `profiles` to mark an account as having organisation access.
- A secure `redeem_access_code(code)` database function that does the whole check-and-claim atomically: verifies the code is active, not expired, and under its cap; records the redemption; bumps the count; and flips the user's `org_access` on. Returns a clear success / "code full" / "invalid code" / "already redeemed" result.
- Update the existing session-start logic so org accounts are treated as free, unlimited, 45-minute sessions, and update the cooldown check so org accounts are never blocked by the daily limit.
- Proper access rules: users can read their own redemption and profile; only the backend manages the codes themselves.

### 2. Frontend
- A small "Have an access code?" section on the **Dashboard** (and reuse it on the Credits page) with an input + redeem button, showing success/error toasts.
- Once redeemed, the dashboard shows an "Organisation access — unlimited sessions" state instead of the credits/quota messaging, and always offers "Begin a session".
- Hide the purchase / "out of sessions" prompts for org accounts.

### 3. Creating codes (admin)
- Codes are created directly in the database (I'll insert your first charity code as part of setup, or generate it on request). Since you already have an Admin page, I can optionally add a simple "Access codes" panel there in a follow-up so you can create and monitor codes yourself without me — say the word and I'll fold it in.

## Out of scope (for now)
- A full multi-tenant "organisation dashboard" where the charity logs in to manage their own staff and see usage. This plan is the lightweight version that gets the charity testing quickly. We can grow into per-org admin accounts later if the pilot goes well.
- No changes to pricing, the private free-trial flow, or existing paid sessions.

## Technical notes
- `sessions.session_type` keeps its existing `'free' | 'paid'` constraint; org sessions are stored as `'paid'` (so they get the 45-min length everywhere that already checks for `'paid'`) but are created through the org branch that charges nothing.
- Redemption and all validation happen in a `SECURITY DEFINER` function so the cap can't be bypassed from the client; the count increment is atomic to prevent two people slipping past the 10-user limit at once.
- Session creation continues to flow through the `start_paid_session` RPC, extended with an org branch (free, no credit deduction, no free-counter increment).
