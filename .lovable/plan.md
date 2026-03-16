

## Plan: Add user_type metadata to shared events and split counts in admin dashboard

### 1. Add `session_started` and `cooldown_page_viewed` to New User Journey steps

**`src/pages/Admin.tsx`**: Update `NEW_USER_STEPS` to include `session_started` and `cooldown_page_viewed` at the end.

### 2. Add `user_type` metadata to shared events

**`src/pages/Mirror.tsx`** (line ~257): When firing `session_started`, determine `user_type` by checking if `user.created_at` is less than 24 hours ago → `'new'`, otherwise `'returning'`. Add to existing metadata.

**`src/pages/Cooldown.tsx`** (line ~32): Same logic for `cooldown_page_viewed` — check `user.created_at` against 24 hours, add `user_type` to metadata.

Both pages already have access to `user` via `useAuth()`.

### 3. Update `admin-analytics` edge function

**`supabase/functions/admin-analytics/index.ts`**: Add a second query that fetches `session_started` and `cooldown_page_viewed` events with their metadata. Return an additional `filtered_counts` object in the response:

```
filtered_counts: {
  "session_started:new": number,
  "session_started:returning": number,
  "cooldown_page_viewed:new": number,
  "cooldown_page_viewed:returning": number,
}
```

Query these by filtering `metadata->>'user_type'` for the two event names within the date range.

### 4. Update Admin.tsx to use filtered counts

**`src/pages/Admin.tsx`**: 
- Store `filteredCounts` from the API response
- In the funnel rendering, for `session_started` and `cooldown_page_viewed` steps, use the filtered count matching the journey's user type (`new` for New User Journey, `returning` for Returning User Journey) instead of the global count.

### Files modified

| File | Change |
|------|--------|
| `src/pages/Mirror.tsx` | Add `user_type` to `session_started` metadata |
| `src/pages/Cooldown.tsx` | Add `user_type` to `cooldown_page_viewed` metadata |
| `supabase/functions/admin-analytics/index.ts` | Return filtered counts for shared events by `user_type` |
| `src/pages/Admin.tsx` | Add steps to New User Journey, consume filtered counts |

