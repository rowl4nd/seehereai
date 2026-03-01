
# Reset T&C Acknowledgment on Guest Session End

## What's changing
When a guest clicks "End session" in the chat, the disclosure acknowledgment (`sh_disclosure_accepted` in sessionStorage) needs to be cleared so they must re-acknowledge T&Cs if they start again from the homepage.

## Change

### GuestChat.tsx -- Add `sh_disclosure_accepted` to the session cleanup
In the "End session" button's `onClick` handler (around line 310), add one line to also remove the disclosure flag:

```typescript
sessionStorage.removeItem("sh_disclosure_accepted");
```

This sits alongside the existing `removeItem` calls for `guest_messages`, `guest_onboarding_complete`, and `guest_email`.

One file, one line.
