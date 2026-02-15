

## Fix Mobile Zoom on Text Input Focus

Mobile browsers (especially iOS Safari) automatically zoom in when a user taps on an input field with a font-size smaller than 16px. This makes the send button inaccessible.

### The Fix

Set the font-size of the chat input textarea to 16px (or `text-base` in Tailwind) on mobile. This tells the browser there's no need to zoom in, keeping the full page width visible including the send button.

### Technical Details

**File: `src/pages/Mirror.tsx`**

- Locate the `<textarea>` (or `<Textarea>`) element used for message input in the chat footer
- Add `text-base` (16px) to its className to ensure the font size is at least 16px on all devices
- This is the standard solution for preventing unwanted mobile zoom on focus

