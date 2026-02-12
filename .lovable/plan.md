

## Auth Page Tabs with Branded Copy

### What Changes

Replace the subtle toggle link on the auth page with two clear tabs using the branded copy:

- **Tab 1 (Login):** "Nice to **See** you again" -- where "See" is bold and colored `#709474` (sage green)
- **Tab 2 (Signup):** "First time **Here**?" -- where "Here" is bold and colored `#8775aa` (lavender purple)

### How It Will Look

```text
+---------------------------------------------+
|                                              |
|  [Nice to See you again] [First time Here?]  |
|                                              |
|  Email: ___________________________          |
|  Password: ________________________          |
|                                              |
|  [          Sign In / Create       ]         |
|                                              |
|  Forgot your password?                       |
+---------------------------------------------+
```

- Active tab is visually highlighted
- "See" and "Here" keep their brand colors in both active and inactive states
- Switching tabs clears the password field
- "Forgot your password?" only shows on the login tab
- The old bottom toggle link is removed

### Technical Details

**File changed:** `src/pages/Auth.tsx`

- Import `Tabs`, `TabsList`, `TabsTrigger` from `@/components/ui/tabs`
- Wrap the form in a `Tabs` component with values `"login"` and `"signup"`
- Each `TabsTrigger` renders inline JSX with `<span>` elements for the colored/bold words:
  - `<span style={{ color: '#709474', fontWeight: 700 }}>See</span>`
  - `<span style={{ color: '#8775aa', fontWeight: 700 }}>Here</span>`
- The `mode` state updates via `onValueChange` on the `Tabs` component
- Keep the `"forgot"` sub-mode accessible from the login tab
- Remove the old bottom toggle button
- No backend or database changes

