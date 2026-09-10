# WCAG 2.1 AA fix pass — reds first

No visual redesign, no changes to session defaults, credits, or routing beyond the extension feature.

## What I found before planning

- The homepage hero submit button in `Index.tsx` (line ~330) is icon-only with no accessible name.
- `DisclosureModal.tsx` is the older raw-div implementation (`fixed inset-0` + `bg-black/40`, no Radix). It needs refactoring, not just confirming.
- Colour hex sweep across `src/`:
  - `#af9cd3` — `Guidance.tsx`, `GuestGuidance.tsx`, `Cooldown.tsx` (many uses: blurred blobs, borders at /10–/30 opacity, focus rings, one solid button + link text)
  - `#b9a3e0` — `SecureSessionModal.tsx` (line 140 button), `Auth.tsx` (line 207 button)
  - `#89ae8c` — no occurrences anywhere in `src/`
  - Dashboard has none of these values — the "Purchase sessions" button referenced in the brief no longer exists there (it was replaced during the access-model change).
- Session length: Mirror uses 45 min paid / 25 min free, GuestChat 25 min; both compute remaining time from session start and fire a 5-minute warning message.

## Red items

**1. Send button name** — add `aria-label="Send message"` to the hero submit button in `Index.tsx`.

**2. Disclosure modal** — refactor `DisclosureModal.tsx` to use `Dialog`/`DialogContent` from `@/components/ui/dialog`, matching `SecureSessionModal.tsx`. Keep the same copy, links, and accept/close behaviour. This gives dialog role, modal semantics, focus trap, Escape, and focus restoration for free. Add a `DialogTitle` (visually hidden if the current design has no visible heading) so the dialog has an accessible name.

**3. One-time +10 minute extension (2.2.1)** — persisted server-side so it survives a refresh or dropped connection:
   - Migration: add a nullable `extended_until timestamptz` column to `sessions`.
   - Add a `extend_session` security-definer function that, for the caller's own active session, sets `extended_until = <normal end time> + 10 minutes` only when it is still null (one use per session).
   - A single shared helper computes a session's effective end time: `extended_until` when set, otherwise `started_at + 45/25 minutes`. Mirror's timer, GuestChat's timer, `useSessions`, and the Dashboard auto-end effect all use that one helper instead of three separate calculations.
   - `auto_end_expired_sessions()` is updated to respect `extended_until` so a server sweep cannot cut short an extended session.
   - UI: an "Add 10 more minutes" button appears in the timing-warning area once the 5-minute warning fires, and disappears after use. Plus the line "Need more time because of a disability? Email hello@seehere.ai" in the warning, matching existing signposting style.
   - Default 25/45-minute durations and daily-session rules are unchanged; the extension is purely additive.


## Moderate items

- Replace the low-contrast hex values where they carry meaning against light backgrounds: solid buttons and link/body text using `#af9cd3` / `#b9a3e0` become the darker `#7c68a8` (verified ≥4.5:1 on `#f8f6f3` and for white-on-purple button text), with hover one step darker. Decorative uses (blur blobs, `/10`–`/30` borders, selection highlight) and focus rings are left as-is — they are non-text and changing them would be a restyle. I will report the exact list of changed lines.
- Per-route `<title>` (plus matching meta description) for `/try`, `/mirror`, `/auth`, `/dashboard`, `/credits`, `/cooldown`, following the existing per-page pattern used on the content pages.
- Distinct `aria-label` on each of the three Purchase buttons on `/credits`.
- Add `focus-visible` ring and make the Dashboard delete-session icon button visible on focus (not hover-only), with an `aria-label`.
- Chat message list in `Mirror.tsx` / `GuestChat.tsx`: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`, and each message prefixed with a visually hidden speaker name.
- "Skip to main content" link: added once in `App.tsx` above the routes, targeting a `#main` landmark; ensure the main pages wrap content in `<main id="main">`.
- Accessible names for the hero textarea and both chat inputs.
- `autocomplete="email"` / `"current-password"` on the `Auth.tsx` fields.
- Login errors: `aria-invalid` + `aria-describedby` pointing at an inline error element with `role="alert"`.
- Heading order on `Dashboard.tsx` and `Credits.tsx`: keep the single `<h1>`, set card titles to `h2`/`h3` so no level is skipped.

## Not in this pass

Screen-reader testing by a human, and accessibility settings (text size/contrast) in the dashboard.
