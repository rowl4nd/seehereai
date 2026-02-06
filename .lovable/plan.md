

# Update Chatbot Message Bubble Colors

## Overview
Change the assistant (chatbot) message bubbles in the Mirror page to use a custom purple-mauve background (#806e84) with warm peach text (#ffedd5).

## What Changes

**File:** `src/pages/Mirror.tsx`

Update the assistant message bubble styling (around line 207) from:

```
bg-card border border-border/50 text-foreground rounded-bl-md
```

to:

```
rounded-bl-md
```

with inline styles for the custom colors:
- `backgroundColor: '#806e84'`
- `color: '#ffedd5'`

The border will be removed since the solid background color provides enough visual distinction. User message bubbles remain unchanged.

