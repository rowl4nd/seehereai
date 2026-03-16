

## Plan: Lightweight Analytics Tracking System

### 1. Database Migration

Create `analytics_events` table with RLS:

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  session_id TEXT,
  user_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_events_event_name ON public.analytics_events (event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (including anonymous)
CREATE POLICY "Anyone can insert events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read (no select for anon/authenticated)
CREATE POLICY "Service role can read events"
  ON public.analytics_events FOR SELECT
  TO service_role
  USING (true);
```

### 2. Edge Function: `supabase/functions/track-event/index.ts`

- Accepts `{ event_name, session_id?, user_id?, metadata? }`
- Inserts into `analytics_events` using the service role client
- Returns `{ success: true }` or error
- `verify_jwt = false` in config.toml

### 3. React Hook: `src/hooks/useAnalytics.ts`

- Generates a random `analyticsSessionId` in `sessionStorage` on first call
- Gets `user?.id` from `useAuth()`
- Exposes `trackEvent(eventName, metadata?)` that fire-and-forgets a call to the edge function
- Catches all errors silently

### 4. Event Integration (all additions are fire-and-forget, no existing logic modified)

**`src/pages/Index.tsx`** — 2 events:
- `disclosure_shown`: when `setShowDisclosure(true)` is called (in both `handleTryForFree` and `handleHeroSubmit`)
- `disclosure_accepted`: inside `handleDisclosureAccept`

**`src/components/DisclosureModal.tsx`** — No changes needed (no dismiss button exists; the modal only has "I understand" and "Log in")

**`src/pages/GuestChat.tsx`** — 4 events:
- `guest_message_sent`: in `handleSend`, with `{ message_number }` (count of user messages)
- `signup_modal_shown`: when `setShowModal(true)` fires (message limit reached)
- `signup_modal_dismissed`: in `SecureSessionModal` discard handler

**`src/components/SecureSessionModal.tsx`** — 2 events:
- `signup_modal_dismissed`: in `handleDiscard`
- `account_created`: in `handleSubmit` on success, with `{ method: 'email' }`. For Google/Apple OAuth buttons, with `{ method: 'google' }` / `{ method: 'apple' }`

**`src/pages/Mirror.tsx`** — 4 events:
- `session_started`: after session creation succeeds, with `{ session_number, session_type }`
- `session_message_sent`: in `handleSend`, with `{ session_id, message_number }`
- `session_ended_naturally`: when timer hits 0
- `session_ended_early`: in `handleEndSession` before 5-minute warning
- `session_completed`: on any session end, with `{ session_id, session_number, session_type, duration_seconds }`

**`src/pages/GuestChat.tsx` (authenticated section)** — Same session events for the post-signup session within guest chat

**`src/pages/Cooldown.tsx`** — 1 event:
- `cooldown_page_viewed`: on mount, with `{ sessions_completed }`

**`src/pages/Credits.tsx`** — 2 events:
- `credits_page_viewed`: on mount
- `purchase_started`: in `handlePurchase`, with `{ package }`

**`src/pages/PaymentSuccess.tsx`** — 1 event:
- `purchase_completed`: after successful verification, with `{ package, amount, currency: 'GBP' }` (extracted from response data if available, otherwise just the event name)

### Files Created/Modified

| File | Action |
|------|--------|
| DB migration | Create `analytics_events` table + indexes + RLS |
| `supabase/config.toml` | Add `[functions.track-event] verify_jwt = false` |
| `supabase/functions/track-event/index.ts` | New edge function |
| `src/hooks/useAnalytics.ts` | New hook |
| `src/pages/Index.tsx` | Add `disclosure_shown`, `disclosure_accepted` |
| `src/components/SecureSessionModal.tsx` | Add `signup_modal_dismissed`, `account_created` |
| `src/pages/GuestChat.tsx` | Add `guest_message_sent`, `signup_modal_shown`, session events |
| `src/pages/Mirror.tsx` | Add `session_started`, `session_message_sent`, session end events |
| `src/pages/Cooldown.tsx` | Add `cooldown_page_viewed` |
| `src/pages/Credits.tsx` | Add `credits_page_viewed`, `purchase_started` |
| `src/pages/PaymentSuccess.tsx` | Add `purchase_completed` |

All tracking calls are wrapped in try/catch with no user-facing error handling. The analytics system is entirely passive.

