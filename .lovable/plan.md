

# Update tab labels in Auth page

## Changes in `src/pages/Auth.tsx`

Two small edits to the custom tab buttons (lines 137-157):

1. **Line 144**: Change "Nice to See you again" to bold by adding `fontWeight: 700` to the parent `<span>` (keeping the green "See" styling)
2. **Line 155**: Change "First time Here?" to **"New Here?"** and make it bold, keeping the purple "Here" styling

Specifically:
- Line 144: `<span>Nice to <span style=...>See</span> you again</span>` becomes `<span className="font-bold">Nice to <span style=...>See</span> you again</span>`
- Line 155: `<span>First time <span style=...>Here</span>?</span>` becomes `<span className="font-bold">New <span style=...>Here</span>?</span>`

Only `src/pages/Auth.tsx` is touched. No other files affected.

