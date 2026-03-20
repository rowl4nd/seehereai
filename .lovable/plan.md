
# Show Disclosure Modal on All "Try for Free" Buttons

## Problem
The legal disclosure modal only appears when tapping the chat textarea in the hero section. The several "Try for Free" buttons on the page bypass this check and navigate directly to `/try` without showing the disclosure first.

## Solution
Update `handleTryForFree` to check whether the disclosure has been accepted. If it hasn't (and the user isn't logged in), show the disclosure modal instead of navigating. Once accepted, navigate to `/try`.

## Technical Detail

### Index.tsx -- Update `handleTryForFree`

Change the function (around line 172) from:
```typescript
const handleTryForFree = () => {
  if (user) navigate("/dashboard");
  else navigate("/try");
};
```

To:
```typescript
const handleTryForFree = () => {
  if (user) {
    navigate("/dashboard");
  } else if (!disclosureAccepted) {
    setShowDisclosure(true);
  } else {
    navigate("/try");
  }
};
```

### Index.tsx -- Update `handleDisclosureAccept`

Modify the accept handler (around line 183) so that after accepting, if the textarea doesn't have a value typed in, navigate to `/try` instead of just focusing the textarea. This handles the case where the user clicked a "Try for Free" button:

```typescript
const handleDisclosureAccept = () => {
  sessionStorage.setItem("sh_disclosure_accepted", "true");
  setDisclosureAccepted(true);
  setShowDisclosure(false);

  // If the user was typing in the hero input, focus it
  // Otherwise (clicked a Try for Free button), navigate to /try
  if (document.activeElement === textareaRef.current || heroInput.trim()) {
    setTimeout(() => textareaRef.current?.focus(), 50);
  } else {
    navigate("/try");
  }
};
```

This ensures all three "Try for Free" buttons and the chat textarea all go through the same disclosure gate, with no other changes needed.
