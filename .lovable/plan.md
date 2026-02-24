

# Update Cooldown Page to Match Misty Sanctuary Aesthetic

## Overview

Restyle `src/pages/Cooldown.tsx` to match the meditative, glass-morphism aesthetic of `src/pages/Guidance.tsx`.

---

## Changes (single file: `src/pages/Cooldown.tsx`)

### 1. Background and Decorative Blobs
- Change outer `div` from `bg-background` to `bg-[#f8f6f3]`
- Add two decorative misty blobs (identical to Guidance):
  - Top-left: `absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px]`
  - Bottom-right: `absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#af9cd3]/10 rounded-full blur-[120px]`

### 2. Header
- Match Guidance header: `p-6 md:px-12 opacity-40 hover:opacity-100 transition-opacity z-20`
- Remove the sticky header with border styling

### 3. Glass-Morphism Card
- Wrap the main content area in a glass card container using relative positioning:
  - Outer: `relative p-10 md:p-16 rounded-[60px] min-h-[280px]`
  - Glass background layer: `absolute inset-0 bg-white/40 backdrop-blur-md rounded-[60px] shadow-[0_4px_24px_-1px_rgba(0,0,0,0.02)] border border-white/60`
  - Content sits on top with `relative` class

### 4. Soften Language and Typography
- Title: Change from "Time to reflect" to "The mirror is resting"
- Body text: Replace with more poetic copy, using `text-[#5f5a53] font-light italic` styling
- Countdown card: Replace "Your next session is available" / "Tomorrow" with "We can speak again in..." and the time value styled in `font-serif italic text-[#3d3a35]`
- Journaling prompt: Style with `font-serif italic text-[#5f5a53]` to match Guidance cards
- Use Guidance color tokens (`text-[#3d3a35]`, `text-[#5f5a53]`, `text-[#857f77]`) instead of theme variables

### 5. Loading State
- Match Guidance loading: `bg-[#f8f6f3]` background with `text-[#857f77] font-serif italic` loading text ("Entering the quiet...")

### 6. Footer / Dashboard Link
- Remove the `Button` component entirely
- Replace with a subtle footer link matching Guidance's style:
  ```
  text-xs uppercase tracking-[0.25em] text-[#857f77] hover:text-[#3d3a35] transition-colors
  ```
- Move to a `footer` element at the bottom of the page, outside `main`
- Include the crisis service notice below the link (matching Guidance)

### 7. Pulsing Circle
- Replace the current double-circle with a single softened animation using `bg-[#af9cd3]/20` tones to match the lavender palette

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Cooldown.tsx` | Full restyle to match Guidance.tsx misty sanctuary aesthetic |

