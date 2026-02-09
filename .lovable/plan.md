

## Simplify Dashboard: Replace Credits Card with a Simple Button

Currently the Dashboard has two cards: a **Sessions** card and a **Credits** card. The Credits card redundantly shows the credit count (which is the same as paid sessions) and a "Purchase credits" button.

### Changes

In `src/pages/Dashboard.tsx`:

1. **Remove the entire Credits Card** -- delete the second `<Card>` block that displays credits balance and the "Purchase credits" button.

2. **Add a standalone "Purchase credits" button** below the Sessions card, styled as a simple outline button linking to `/credits`.

3. **Remove the `useCredits` hook import and usage** since credits are no longer displayed anywhere on the dashboard. The session count from `useProfile` (free sessions) and `useSessions` is sufficient.

4. **Update `isLoading`** to no longer include `creditsLoading`.

5. **Update `totalAvailable` calculation** to use only `freeSessionsRemaining` (free sessions remaining) plus credits balance. Since we still need credits to know if paid sessions are available, we keep the `useCredits` hook but just stop displaying the balance separately.

Actually, on reflection, `paidSessions` (from credits) is used in `totalAvailable` to determine whether the user can start a session, so we still need the hook. We just remove the Credits card UI and add a simple button.

### Result

The dashboard will show:
- The Sessions card (unchanged)
- A simple "Purchase credits" link/button underneath
- No separate credits display

