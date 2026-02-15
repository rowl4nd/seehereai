
## Align Messages to Bottom of Chat Area

Currently, messages start at the top of the chat area and grow downward. This change will make messages anchored to the bottom, so the first message appears near the input field and subsequent messages push earlier ones upward — similar to how most modern chat apps work.

### What will change

**File: `src/pages/Mirror.tsx`**

The `<main>` element (line 619) and its inner message container (line 620) will be updated to use flexbox with `justify-end` so content is pushed to the bottom of the available space.

### Technical details

- On the `<main>` element (line 619), add `flex flex-col` to make it a flex container
- On the inner `<div>` wrapping messages (line 620), add `mt-auto` so the message list is pushed to the bottom of the scrollable area
- This ensures that when there are few messages, they appear near the bottom (close to the input). As more messages arrive, the list naturally grows upward and scrolling still works correctly via the existing `scrollIntoView` logic
