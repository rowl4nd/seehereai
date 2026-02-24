

# Add Session Deletion to Dashboard

## Overview

Add trash icons to past sessions on the Dashboard so users can delete sessions. Deleted sessions (and their conversations) will be removed from the database, so the AI will no longer reference them.

---

## Changes

### 1. Database Migration: Add DELETE RLS Policies

Both `sessions` and `conversations` tables currently lack DELETE policies. We need to add them so users can delete their own records.

```sql
CREATE POLICY "Users can delete own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);
```

This ensures:
- Users can only delete their own data
- Deleting conversations removes the AI's ability to reference those sessions

### 2. `src/hooks/useSessions.tsx` -- Add `deleteSession` Method

Add a new function that:
1. Deletes all conversations linked to the session (`session_id` match)
2. Deletes the session record itself
3. Removes the session from local state

Returns `{ error: null }` on success or `{ error }` on failure.

### 3. `src/pages/Dashboard.tsx` -- Add Trash Icons

- Import `Trash2` from `lucide-react`
- Add a `deletingSessionId` state to track which session is being deleted
- For each past session row, add a trash icon button on the right side (next to the duration)
- The button uses `e.preventDefault()` + `e.stopPropagation()` to avoid navigating to the session history page
- On click, calls `deleteSession` and shows a success/error toast via `sonner`
- While deleting, the icon shows a brief loading state (opacity change)

The row layout changes from:

```text
[date]                    [duration]
```

to:

```text
[date]              [duration]  [trash icon]
```

The trash icon is styled subtly (`text-muted-foreground/50`, visible on hover via `opacity-0 group-hover:opacity-100`) to keep the soft aesthetic.

---

## Why This Fixes the AI Context Issue

The AI's past session context comes from the `conversations` table (loaded via the `encrypt-messages` edge function's `load-history` action). By deleting conversations when a session is deleted, those conversations will no longer appear in the `loadHistory` query, so the AI won't reference them.

---

## Files Changed

| File | Change |
|------|--------|
| Database migration | Add DELETE policies on `sessions` and `conversations` |
| `src/hooks/useSessions.tsx` | Add `deleteSession` method |
| `src/pages/Dashboard.tsx` | Add trash icon buttons, import Trash2 and toast |

