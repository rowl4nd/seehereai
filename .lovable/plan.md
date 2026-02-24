

# Fix Mobile Scrolling in Secure Session Modal

## Problem
The Radix `ScrollArea` component doesn't reliably support touch-based scrolling on mobile devices. Users can only see content down to the "or" divider -- the Google, Apple, and "Not Now" buttons are cut off with no way to scroll.

## Solution
Replace the Radix `ScrollArea` with a plain `div` using native CSS `overflow-y: auto`. Native overflow scrolling works reliably on all mobile browsers and supports touch/swipe gestures out of the box.

## Changes

### `src/components/SecureSessionModal.tsx`
- Remove the `ScrollArea` import (no longer needed)
- Replace `<ScrollArea className="max-h-[80vh] pr-4">` with `<div className="overflow-y-auto max-h-[75vh] pr-1 space-y-4">`
- Replace closing `</ScrollArea>` with `</div>`
- Add `space-y-4` to the wrapper div to maintain the vertical spacing between elements (since the content is no longer relying on the dialog's `gap-4`)

This approach uses the browser's native scrolling which handles touch events properly on mobile, unlike the Radix ScrollArea which relies on custom scroll behavior that can fail on touch devices.

