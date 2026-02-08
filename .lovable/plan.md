

# Auto-Focus Chat Input After AI Reply

## Overview

On the Mirror page, automatically place the cursor in the chat input box after the AI responds, so the user can immediately start typing without needing to click into the text area first.

## Changes

### `src/pages/Mirror.tsx`

- Add a `ref` to the `Textarea` component using `useRef`
- After the AI response is received (in the `handleSend` function, inside the `try` block after setting the assistant message), call `.focus()` on the textarea ref
- Also focus the textarea after the error case so the user can retry
- Add `autoFocus` to the `Textarea` so it is focused when the page first loads as well
- Focus the textarea after session initialization (when the greeting message appears)

## Technical Details

1. Create a `textareaRef` using `useRef<HTMLTextAreaElement>(null)`
2. Pass it to the `Textarea` component via the `ref` prop (the Textarea component already uses `forwardRef`, so this works out of the box)
3. Add `autoFocus` prop to the `Textarea` for initial page load focus
4. In `handleSend`, after `setIsLoading(false)` in the `finally` block, call `textareaRef.current?.focus()` -- this covers both success and error cases in one place

