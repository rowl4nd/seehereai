# Add a "delete code" option to the access codes admin

## Goal
In the admin Access Codes tab, let admins permanently delete a code, not just toggle it active/inactive.

## What changes

### 1. Backend: add a `delete` action to the `admin-access-codes` edge function
- New `action === "delete"` branch that:
  - Requires `id` (returns 400 if missing).
  - Keeps the same admin check already used by the other actions (caller must be in `admin_users`).
  - Before deleting, checks whether the code has any redemptions (`code_redemptions.code_id = id`). If it has been redeemed, **block the hard delete** and return a clear message ("This code has already been redeemed and can't be deleted — deactivate it instead."). This protects redemption history and avoids foreign-key errors.
  - If there are no redemptions, delete the row from `access_codes` and return success.

### 2. Frontend: add a delete control to each row in `AccessCodesAdmin.tsx`
- Add a new "Actions" column (or a trash icon button next to the Active switch) on each table row.
- Clicking it opens a confirmation dialog (shadcn `AlertDialog`) so deletes aren't accidental — showing the code being deleted.
- On confirm: call `callAdminCodes({ action: "delete", id })`, then remove the row from local state on success and show a toast.
- On the "already redeemed" error, surface the returned message via a toast and leave the row in place.

## Out of scope
- No database/schema changes (uses the existing `access_codes` and `code_redemptions` tables).
- No change to redeem logic, the toggle behaviour, or unlimited-access rules.
- Deactivating (toggle) remains the recommended path for codes that have already been used.

## Technical notes
- `supabase/functions/admin-access-codes/index.ts`: add the `delete` branch; reuse the existing `admin` service-role client. Query `code_redemptions` count for the `id`; if `> 0`, return `{ error: "..." }` with status 400; otherwise `admin.from("access_codes").delete().eq("id", id)`.
- `src/components/AccessCodesAdmin.tsx`: import `AlertDialog` components and a trash icon (`lucide-react`), add a confirm-on-delete flow, and a `handleDelete(c)` that calls the new action and updates `codes` state.
- Edge function will be redeployed after the change.
