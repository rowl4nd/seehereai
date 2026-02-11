

## Seamless Flowing Homepage

### The Problem
There are multiple colour clashes creating hard edges between sections:
- The header uses `bg-background` (HSL 20 55% 96.5% -- a pinkish cream)
- The hero gradient ends at the hard-coded `#ffedd5` (a distinctly different warm peach)
- Wave dividers try to bridge these mismatched tones but add their own contrast
- Each section starts its own gradient from scratch, creating visible "bands"

### The Solution
Remove the wave dividers entirely and replace them with a single, continuous full-page gradient that flows naturally from top to bottom. The sections themselves become transparent layers sitting on top of this unified background. Subtle decorative orbs provide gentle variation without hard edges.

### What changes

**1. Single full-page gradient background**
- Apply one continuous `bg-gradient-to-b` on the outermost wrapper div, flowing from the background colour through soft sage and accent tones to a warm finish at the footer.
- Remove all per-section background gradient divs (the `absolute inset-0 bg-gradient-to-b` elements inside each section).

**2. Remove all WaveDivider components**
- Delete the three WaveDivider instances between hero/middle, middle/FAQ, and FAQ/footer.
- These are the primary source of visual "jumps" between sections.

**3. Transparent sections with spacing**
- Each section becomes `bg-transparent` (or simply has no background), letting the page-level gradient show through.
- Keep the decorative blur orbs inside sections for subtle depth, but reduce their opacity slightly so they blend rather than contrast.

**4. Header blends with the page gradient**
- Change the header from `bg-background/80` to a more transparent treatment that picks up the gradient beneath it, e.g. `bg-background/60` with the existing backdrop blur. This prevents the header from looking like a separate "bar" floating over a different colour.

**5. Remove the hard-coded #ffedd5**
- Every instance of `#ffedd5` gets replaced with CSS variable references (e.g. `hsl(var(--peach-soft))` or similar) so the palette stays unified and maintainable.

### Technical detail

**File: `src/pages/Index.tsx`**

- Line 76: Change outermost div to carry the full-page gradient:
  `className="min-h-screen flex flex-col bg-gradient-to-b from-background via-[hsl(var(--sage-soft)/0.15)] via-60% to-[hsl(var(--peach-soft))] overflow-x-hidden"`

- Line 78: Soften header opacity: `bg-background/60 backdrop-blur-md`

- Line 104: Remove the hero's absolute gradient div entirely (the `bg-gradient-to-b from-accent/20 via-background to-[#ffedd5]` layer). Keep the orbs for atmosphere.

- Lines 146, 241, 307: Remove all three `<WaveDivider ... />` lines.

- Line 151: Remove the middle section's absolute gradient div.

- Line 244: Remove the FAQ section's absolute gradient div.

- Line 310: Remove the footer's absolute gradient div.

- All remaining orb elements: reduce opacity slightly (e.g. `bg-sage-soft/30` becomes `bg-sage-soft/20`) so they add gentle texture without creating contrast bands.

**File: `src/components/WaveDivider.tsx`**
- No changes needed (component stays for potential future use), but its import in Index.tsx is removed.

### Result
The page will feel like one continuous, gently shifting canvas. Scrolling down reveals content floating on a unified warm gradient that shifts very subtly from cream at the top through a whisper of sage in the middle to soft peach at the bottom -- no hard lines, no contrasting bands, just a smooth flow.
