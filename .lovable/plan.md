

# Add Free Sessions Line Below "How It Works"

## What Changes

A single line of reassurance text will be added at the bottom of the "How it works" section, just after the three step cards.

**Text:** "Your first two sessions are free. No commitment."

## Placement

The line sits inside the "How it works" section, below the 3-card grid — acting as a natural follow-up to "here's how it works." It answers the unspoken question ("what does it cost?") at the moment the user is most likely thinking it.

```text
How it works
Three simple steps to a calmer mind

[ Step 1 ]  [ Step 2 ]  [ Step 3 ]

Your first two sessions are free. No commitment.   <-- NEW
```

## Technical Detail

- **File:** `src/pages/Index.tsx`
- A `<ScrollSection>` wrapping a `<p>` tag will be inserted after the step cards grid (after line 167, inside the `max-w-5xl` container)
- Styling: `text-center text-sm text-muted-foreground mt-10` — subtle, warm, and consistent with the page tone
- Wrapped in `ScrollSection` so it fades in with the rest of the content
- No new files, no new dependencies
