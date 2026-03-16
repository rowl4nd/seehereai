

## Plan: Add Homepage Analytics Events and Funnel Branch

### 1. `src/pages/Index.tsx` — Add two events

**`homepage_viewed`**: Fire `trackEvent('homepage_viewed')` in a `useEffect` on mount (empty deps array).

**`login_from_homepage`**: Add `onClick` handlers that call `trackEvent('login_from_homepage')` on:
- The header "Log in" button (line ~185, `<Link to="/auth">`)
- The "Have an account? Log in" link (line ~282, `<Link to="/auth">`)

Both links navigate to `/auth` as before — just add tracking before navigation. Since these are `<Link>` elements, wrap them or use `onClick` on the parent/link.

### 2. `src/pages/Admin.tsx` — Update funnel visualization

**Update `FUNNEL_STEPS`**: Add `"homepage_viewed"` as the first entry, and add `"login_from_homepage"` to the array (for count lookup).

**Replace the funnel rendering** with a two-part layout:

1. **First box**: `homepage_viewed` count
2. **Three-way branch** (displayed as three stacked rows between `homepage_viewed` and the rest):
   - "Started chatting" → count of `disclosure_shown` (% of `homepage_viewed`)
   - "Logged in" → count of `login_from_homepage` (% of `homepage_viewed`)
   - "No interaction" → `homepage_viewed - disclosure_shown - login_from_homepage` (% of `homepage_viewed`)
3. **Arrow from "Started chatting"** continues into the existing funnel from `disclosure_shown` → `disclosure_accepted` → onward

### Files Modified

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add `homepage_viewed` on mount, `login_from_homepage` on login clicks |
| `src/pages/Admin.tsx` | Add `homepage_viewed` to funnel, render three-way branch UI |

No database or edge function changes needed — the events use the existing tracking infrastructure.

