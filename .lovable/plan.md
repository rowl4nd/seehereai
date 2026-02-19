
# Misty Sanctuary -- Index Page Transformation

## Overview

Replace the current section-by-section gradient backgrounds with a single fixed "sanctuary" backdrop featuring animated organic shapes, grain texture, and glassmorphic content blocks. The page will feel like looking through a misty window into a calm, tactile space.

## New Component: `SanctuaryBackground`

Create `src/components/SanctuaryBackground.tsx` -- a fixed, viewport-filling layer rendered once at the top of the Index page.

Contents:
- **Base fill**: `bg-[#f8f6f3]` (soft off-white), `fixed inset-0`
- **Monstera leaf silhouette** (top-left): An inline SVG path of a simplified Monstera deliciosa leaf, coloured `#3d3a35` at `opacity-[0.04]`, `blur-[12px]`, with a slow floating/rotating animation (`animate-sanctuary-float`, 20s infinite)
- **Vesica Piscis** (bottom-right): Two overlapping `div` circles in `bg-[#af9cd3]`, each ~400px, offset to form a lens/vesica shape, `blur-[120px]`, `opacity-[0.07]`, with a slower breathing animation (`animate-sanctuary-breathe`, 25s infinite)
- **Grain overlay**: A full-viewport div with a CSS `background-image` using a tiny inline SVG noise pattern at very low opacity (0.03), `mix-blend-mode: multiply`

## Tailwind Config Updates (`tailwind.config.ts`)

Add new keyframes and animation utilities:
- `sanctuary-float`: subtle translateX/Y + rotate over 20s
- `sanctuary-breathe`: gentle scale oscillation (1 to 1.04) over 25s
- `sanctuary-fade-in`: blur-xl + scale-95 to blur-0 + scale-100 over 700ms (for section transitions)

## Index Page Changes (`src/pages/Index.tsx`)

### Structure
- Render `<SanctuaryBackground />` as the first child inside the root div
- Remove all section-specific background classes (`bg-gradient-to-r`, `bg-[#f5e6d0]/25`, `bg-[#f8f6f3]`, etc.) -- sections become transparent, sitting over the fixed sanctuary layer

### Hero Section
- Remove the gradient background and the two blurred circle divs
- Make the section `bg-transparent`
- Style the beta email input and confirmation card with the misty glass treatment

### How It Works Cards
- Replace current card classes with: `bg-white/40 backdrop-blur-md rounded-[60px] border-0 shadow-none`
- Remove `border border-border/30` and hover border effects; keep subtle `hover:shadow-lg` and `hover:-translate-y-1`

### Split Content Sections (Origin + Benefits)
- Remove gradient backgrounds from the text-side divs
- Text panels get a subtle `bg-white/30 backdrop-blur-sm` if needed for legibility, otherwise transparent

### Quote Cards, FAQ, Beta Signup, Footer
- Remove solid `bg-[#f8f6f3]` backgrounds -- all transparent
- FAQ accordion items: soften borders to `border-white/20`

### Typography Colour Adjustments
- Primary headings: `text-[#3d3a35]` (soft charcoal) instead of `text-foreground`
- Body/paragraph text: `text-[#6b665f]` (warm taupe) instead of `text-muted-foreground`
- Keep CTA buttons unchanged (`bg-[#4a7a4f]`)

### Section Transition Animation
- Update `ScrollSection` component: change the hidden state from `opacity-0 translate-y-8` to `opacity-0 translate-y-4 blur-xl scale-95`, and the visible state to `opacity-100 translate-y-0 blur-0 scale-100`
- Increase transition duration to 900ms for a dreamier feel

### Inputs (Misty Glass)
- Hero email input and beta signup form inputs: add `bg-white/40 backdrop-blur-md border-white/30 shadow-sm rounded-2xl` classes
- Textarea in beta signup section: same treatment

## CSS Updates (`src/index.css`)

Add the grain noise pattern as a utility class `.sanctuary-grain` if not handled inline.

## Files Modified

1. **`src/components/SanctuaryBackground.tsx`** -- new component (fixed background layer)
2. **`src/pages/Index.tsx`** -- remove section backgrounds, apply glass styles, update typography colours, refine ScrollSection transitions
3. **`tailwind.config.ts`** -- add `sanctuary-float`, `sanctuary-breathe`, `sanctuary-fade-in` keyframes and animations
4. **`src/index.css`** -- add grain overlay utility if needed

## What Stays the Same

- Header and banner structure/classes (sticky header behaviour unchanged)
- All images, logos, and asset imports
- Beta form logic and all interactivity
- CTA button colours and behaviour
- Footer links and safety notice content
- No new dependencies required
