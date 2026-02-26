

# Fix Guest Chat: End Session Button + OAuth Redirect

## Overview
Two bugs to fix: (1) no way for guests to leave the chat gracefully, and (2) Google/Apple OAuth signup redirects to the homepage instead of back into the chat.

## Changes

### 1. SecureSessionModal.tsx -- Fix OAuth redirect URL
- Change `redirect_uri` from `window.location.origin` to `window.location.origin + "/try"` for both Google and Apple OAuth buttons
- This ensures that after OAuth completes, the user lands back on `/try` where the auth state change triggers the migration logic and continues the session

### 2. GuestChat.tsx -- Add guest "End Session" / exit option
- Add a visible "End session" button in the footer area that shows for guests (when `!authenticated`)
- Clicking it will discard guest data from sessionStorage and navigate to the homepage
- This gives guests a clear, graceful way to leave the chat
- The button will sit below the input area, styled consistently with the authenticated end-session button

## Technical Details

**SecureSessionModal.tsx (lines 126-127 and 147-148):**
Change `redirect_uri: window.location.origin` to `redirect_uri: window.location.origin + "/try"` in both OAuth handlers.

**GuestChat.tsx (footer area, around line 456):**
Add a guest exit button before the authenticated timer/end-session block. When not authenticated, show a subtle "End session" link that clears sessionStorage and navigates home.

