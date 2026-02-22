

# Improve Fern Leaf SVG Quality

## What's changing
Replace the current simple SVG leaf paths with more detailed, realistic botanical shapes that have more curves, veins, and natural-looking edges. The positioning, sizes, opacities, and angles will stay the same.

## Changes

### `src/components/FernLeaves.tsx`
- Replace the `fernPath` with a more detailed fern frond that includes individual leaflets (pinnae) branching off a central stem, with smoother curves and more points to create a realistic compound leaf shape
- Replace the `monsteraPath` with a broader, more detailed tropical leaf shape featuring the characteristic splits/fenestrations and a more natural rounded outline
- Adjust the `viewBox` if needed to accommodate the new, more detailed paths

Everything else (positions, sizes, rotations, opacities, colors) remains unchanged.

