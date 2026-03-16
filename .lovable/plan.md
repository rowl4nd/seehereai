

## Plan: Add headline metrics section and second-session count

### 1. Update edge function to count second free sessions

**`supabase/functions/admin-analytics/index.ts`**: In the existing loop over events, add a counter for `session_started` events where `metadata.session_number === '2'` and `metadata.session_type === 'free'`. Return this as `second_free_session_count` in the response JSON alongside `counts`, `daily`, and `filtered_counts`.

### 2. Add summary metrics section to Admin.tsx

**`src/pages/Admin.tsx`**:
- Store `secondFreeSessionCount` from the API response
- Between the funnel cards grid and the Event Counts card, add a simple `div` with three text lines spaced apart:
  - **New user conversion**: `(account_created / disclosure_shown) × 100` — e.g. "New user conversion: 8.3% (1 of 12)"
  - **Returned for second session**: `(secondFreeSessionCount / account_created) × 100` — e.g. "Returned for second session: 25.0% (3 of 12)"
  - **Account to purchase**: `(purchase_completed / account_created) × 100` — e.g. "Account to purchase: 4.2% (1 of 24)"
- Style: small muted text, no cards/borders, just clean spaced text
- Remove the existing `conversionLabel`/`conversionFrom`/`conversionTo` props from the New User Journey FunnelCard (since the conversion is now in the summary section)

### Files modified

| File | Change |
|------|--------|
| `supabase/functions/admin-analytics/index.ts` | Count `session_started` with `session_number=2` + `session_type=free`, return as `second_free_session_count` |
| `src/pages/Admin.tsx` | Add headline metrics section, consume new field, remove duplicate conversion from funnel card |

