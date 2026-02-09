

## Increase Chat Text Size on Mirror Page

The message text currently uses Tailwind's `text-sm` class (14px). The change is to increase it to `text-base` (16px) -- a slight, readable bump.

### What Changes

In `src/pages/Mirror.tsx`, line 393, change:

```
text-sm leading-relaxed
```

to:

```
text-base leading-relaxed
```

This affects both user and assistant message bubbles. No other files need changing.

