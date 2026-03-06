

## Plan: Apply End-Session Cleanup Rules to "Not Now (Discard Session)"

### Problem
When a guest declines to sign up after 6 messages ("Not Now — Discard Session" in `SecureSessionModal.tsx`), it only clears `guest_messages` and `guest_onboarding_complete`. The "End session" button in `GuestChat.tsx` also clears `guest_email` and `sh_disclosure_accepted`. These should match.

### Change

**`src/components/SecureSessionModal.tsx`** — update `handleDiscard` (lines 23-27) to also remove `guest_email` and `sh_disclosure_accepted`:

```ts
const handleDiscard = () => {
  sessionStorage.removeItem("guest_messages");
  sessionStorage.removeItem("guest_onboarding_complete");
  sessionStorage.removeItem("guest_email");
  sessionStorage.removeItem("sh_disclosure_accepted");
  navigate("/");
};
```

One file, two additional lines.

