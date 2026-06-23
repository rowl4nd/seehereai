# Fix admin access + add Access Codes admin tab + header link

## Why the admin page bounces to the homepage

The admin page isn't broken — it's an **access check**. On load it looks up your account in the `admin_users` list and, if it's not there, redirects to the homepage.

Right now the only admin account is **rowland.jack@outlook.com**. You're currently signed in as **rowland101@hotmail.co.uk**, which isn't on the admin list — so it bounces you home every time.

Two ways to fix, and I'll do whichever you prefer:
- **Add `rowland101@hotmail.co.uk` as an admin too** (so both accounts work), or
- Leave it as-is and you sign in with `rowland.jack@outlook.com` to reach `/admin`.

My default for this plan: **add `rowland101@hotmail.co.uk` to the admin list** so the account you're using works.

## What gets built

### 1. Restore admin access
- Add `rowland101@hotmail.co.uk` to the `admin_users` list (data change). After this, `/admin` loads for that account.

### 2. Access Codes tab on the Admin page
The Admin page becomes tabbed: **Analytics** (everything that's there today) and **Access Codes** (new).

The Access Codes tab lets you:
- See every code in a table — code, label, used / max (e.g. "3 / 10"), active status, and expiry if set.
- See how many people redeemed each one.
- **Create a new code** — enter a label (e.g. "Rasa staff pilot"), a max number of redemptions, and an optional expiry date. Code text can be typed or auto-suggested.
- **Turn a code on/off** with a toggle, without deleting it.

Because access codes are deliberately backend-only (no direct client access, so the redemption cap can't be tampered with), this tab talks to a new secure admin-only backend function that verifies you're an admin before reading or changing any codes.

### 3. "Admin" link in the top-right header
- Add an **Admin** link next to **FAQs / Blog** in the homepage header.
- It only appears for admin accounts — regular users and logged-out visitors never see it. It links to `/admin`.

## Out of scope
- No change to how staff redeem codes or to the unlimited-access behaviour already shipped.
- No public-facing UI changes beyond the admin-only header link.

## Technical notes
- Root cause confirmed via the `admin_users` table: it contains only `rowland.jack@outlook.com` (id `65f0a12b…`), while the active session is `rowland101@hotmail.co.uk` (id `3185233f…`). The redirect in `Admin.tsx` fires because the `admin_users` lookup returns no row.
- New edge function `admin-access-codes`: validates the caller's JWT, confirms membership in `admin_users` server-side, then performs list/create/toggle against `access_codes` (and a redemption count per code) using the service role. Mirrors the existing `admin-analytics` admin-gating pattern. Keeps `access_codes` free of client-facing RLS policies.
- Header link: `Index.tsx` runs a lightweight `admin_users` self-check (RLS already allows a user to read their own row) and conditionally renders the Admin link. The same check can power showing/hiding the link without exposing anything to non-admins.
- `Admin.tsx` refactor: wrap current content in a Tabs component; the existing analytics stays in the first tab unchanged.
