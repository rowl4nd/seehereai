

## Update "How SeeHere Works" and "What This Space Offers" Sections

### Changes

**1. "How SeeHere Works" section becomes "SeeHere"**
- Title changes from "How SeeHere works" to "SeeHere"
- Subtitle changes from "Three simple steps to a calmer mind" to "Is a private space..."
- Replace the 3 step cards with 4 new cards:
  - **To talk** -- a relevant explanation about having a space to express yourself
  - **To be heard** -- a relevant explanation about being listened to
  - **To be understood** -- a relevant explanation about receiving empathic understanding
  - **Not to be judged** -- a relevant explanation about freedom from judgement
- Grid changes from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4`
- Remove the step numbering (the "01", "02", "03" indicators)

**2. "What this space offers" becomes "What you will get"**
- Title text changes from "What this space offers" to "What you will get"

**3. Remove gap between the two sections**
- Remove the `WaveDivider` component that sits between these two sections
- Remove bottom padding from the first section and top padding from the second section (or merge them visually) so they flow directly into each other with no visible gap

### Files modified
- `src/pages/Index.tsx` -- all changes are in this single file

