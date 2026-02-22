

# Add Decorative Fern Leaves to Hero Section

## Overview
Add several SVG fern/tropical leaf silhouettes scattered around the hero section background at different sizes, angles, and positions. These will be subtle (low opacity, dark green) to reinforce the calm, therapy-room / safe-space aesthetic without competing with the main content.

## Approach
Create a new component `FernLeaves.tsx` containing 5-6 SVG fern leaf shapes, each positioned absolutely with varying:
- **Sizes**: ranging from ~120px to ~350px
- **Rotation angles**: different tilts (-30deg, 15deg, 45deg, etc.)
- **Positions**: corners and edges of the hero section
- **Opacity**: very low (3-8%) so they feel like wallpaper texture, not foreground elements

Then render this component inside the existing `absolute inset-0 overflow-hidden pointer-events-none` div in the hero section of `Index.tsx`.

## Changes

### 1. Create `src/components/FernLeaves.tsx`
- Contains 5-6 absolutely-positioned SVG fern/monstera leaf silhouettes
- Each leaf uses a dark green fill (`#2d5a3f` or similar) at low opacity
- Different `transform: rotate()` and sizing per leaf
- All wrapped in a fragment for easy insertion

### 2. Update `src/pages/Index.tsx`
- Import `FernLeaves` component
- Place `<FernLeaves />` inside the existing background shapes div (lines 143-146) alongside the blurred circles

## Technical Details

Each leaf SVG will use a botanical fern/tropical leaf path. Leaves will be placed at positions like:
- Top-left corner, rotated -25deg, ~280px, opacity 5%
- Bottom-right corner, rotated 40deg, ~320px, opacity 4%
- Top-right, rotated -60deg, ~180px, opacity 6%
- Bottom-left, rotated 20deg, ~240px, opacity 5%
- Mid-left edge, rotated 10deg, ~150px, opacity 3%

This keeps the leaves visible but very understated, adding organic texture without distracting from the hero content.
