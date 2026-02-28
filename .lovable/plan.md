

# Fix: Wire Up the Install Prompt Trigger

## Problem
The install prompt component is mounted in `App.tsx` and the `useInstallPrompt` hook exposes a `triggerPrompt()` function, but nothing in the app ever calls it. So the prompt never appears.

## Solution
Per the original plan, the prompt should appear after a user completes their first session. The simplest approach: call `triggerPrompt()` when a session ends (in both `Mirror.tsx` and `GuestChat.tsx`), or show it automatically on the homepage/dashboard after the user has at least one completed session.

Since `InstallPrompt` is a standalone component mounted at the App level, the cleanest fix is to **remove the `triggerPrompt` gating** and instead have the component self-trigger on mount — showing itself automatically once the user has completed at least one session (checked via a `localStorage` flag like `has-completed-session`).

### Changes

**1. Mirror.tsx and GuestChat.tsx — Set a "session completed" flag**
- When the user ends a session (clicks "End session" or the session completes), set `localStorage.setItem("has-completed-session", "true")`.

**2. useInstallPrompt.ts — Auto-show after first session**
- Remove the need for an external `triggerPrompt()` call.
- On mount, check if `localStorage.getItem("has-completed-session")` is truthy, the user hasn't dismissed it previously, and the app isn't already in standalone mode.
- If all conditions pass, set `showPrompt` to `true` automatically.
- On iOS, show even without the `beforeinstallprompt` event (since iOS doesn't fire it).

**3. No changes needed to InstallPrompt.tsx or App.tsx** — the component already renders based on `showPrompt`.

## Technical Details

### useInstallPrompt.ts
Add to the existing `useEffect`:
```typescript
// After detecting standalone mode
const hasSession = localStorage.getItem("has-completed-session");
const dismissed = localStorage.getItem("pwa-install-dismissed");
if (hasSession && !dismissed && !standalone) {
  setShowPrompt(true);
}
```
Remove or keep `triggerPrompt` for manual use, but the prompt will now self-trigger.

### Mirror.tsx (end session handler)
Add before navigation:
```typescript
localStorage.setItem("has-completed-session", "true");
```

### GuestChat.tsx (end session handler)
Same addition in the guest end-session logic.
