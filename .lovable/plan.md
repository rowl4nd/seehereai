

## Plan: Admin Analytics Dashboard

### 1. Database Migration

Create `admin_users` table and RLS:

```sql
CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check own admin status"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### 2. Edge Function: `supabase/functions/admin-analytics/index.ts`

- Extracts JWT from authorization header, verifies user exists in `admin_users`
- Accepts optional query params: `start_date`, `end_date`, `event_name`
- Queries `analytics_events` using service role, returns:
  - `counts`: array of `{ event_name, count }` sorted by count descending
  - `daily`: array of `{ date, count }` for the date range
- `verify_jwt = false` in config.toml (manual auth check inside)

### 3. Admin Page: `src/pages/Admin.tsx`

- On mount: checks auth → checks admin status via `supabase.from('admin_users').select().eq('user_id', user.id)` → redirects to `/` if either fails
- **Date range picker**: Two date inputs defaulting to last 7 days
- **Funnel summary**: Horizontal flow of the 10 funnel steps with counts and drop-off percentages between each
- **Event table**: All events with total counts, sorted descending
- **Daily trend chart**: Line chart using Recharts (already in project via chart.tsx) showing events per day
- Minimal styling with existing shadcn components (Card, Table, Button)

### 4. Route Addition: `src/App.tsx`

Add `<Route path="/admin" element={<Admin />} />` — no nav link needed.

### Files Created/Modified

| File | Action |
|------|--------|
| DB migration | Create `admin_users` table + RLS |
| `supabase/config.toml` | Add `[functions.admin-analytics] verify_jwt = false` |
| `supabase/functions/admin-analytics/index.ts` | New edge function |
| `src/pages/Admin.tsx` | New dashboard page |
| `src/App.tsx` | Add `/admin` route |

