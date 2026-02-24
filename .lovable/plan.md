

# Make Secure Session Modal Scrollable

## Problem
The Google and Apple sign-up buttons are present in the modal code but are hidden because the modal content is taller than the viewport. The dialog is centered with `fixed` positioning and has no scroll capability, so the bottom buttons (Google, Apple, "Not Now") are clipped off-screen.

## Solution
Wrap the `DialogContent` inner content in a `ScrollArea` component so users can scroll to see all options. Also add a `max-h-[85vh]` constraint to the `DialogContent` to ensure it stays within the viewport and triggers the scroll when needed.

## Changes

### `src/components/SecureSessionModal.tsx`
- Import `ScrollArea` from `@/components/ui/scroll-area`
- Add `max-h-[85vh] overflow-hidden` to the `DialogContent` className
- Wrap all content inside `DialogContent` (header, form, OAuth buttons, discard button) in a `ScrollArea` with `className="max-h-[80vh] pr-4"` so it scrolls naturally when the content overflows
- This ensures the modal stays within the viewport and all buttons are accessible via scrolling on any screen size

