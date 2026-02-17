
## Update Homepage Buttons and Add Hero Email Form

### Changes

**1. Rename buttons to "Request beta access"**
- Hero button (line 169): Change "Start your first session (free)" to "Request beta access"
- "Built by people who understand" section button (line 219): Change "Begin a free conversation" to "Request beta access"
- "What you will get" section button (line 344): Change "Begin a free conversation" to "Request beta access"

**2. Make the two section buttons scroll to the beta form instead of linking to /auth**
- "Built by people who understand" button (lines 214-221): Replace `<Link to="/auth">` with an `onClick` handler that smooth-scrolls to `#beta-signup`
- "What you will get" button (lines 339-346): Same change -- smooth-scroll to `#beta-signup`

**3. Add a mini email form in the hero section**
- Place a compact inline form just above the hero "Request beta access" button (around line 164)
- The form will have a single email input and the submit button side by side
- It will share the same state and submission logic (`handleBetaSubmit`, `betaEmail`, `betaSending`, `betaSent`) as the full beta form at the bottom
- On success, show the same thank-you message inline
- The hero button becomes the submit button for this mini form (no separate link)

### Technical Details

**File: `src/pages/Index.tsx`**

- Replace the hero `<Link to="/auth">` block (lines 164-171) with a mini form containing:
  - An email `<Input>` field (same validation rules: required, type email, maxLength 255)
  - A submit `<Button>` labeled "Request beta access"
  - Wrapped in a `<form>` using the existing `handleBetaSubmit` handler
  - If `betaSent` is true, show a brief confirmation instead of the form

- For the two section buttons, replace the `<Link to="/auth">` wrapper with a plain `<button>` or anchor that calls `document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' })`
