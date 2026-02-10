

## Gradient Section Backgrounds to Match Wave Dividers

The wave dividers currently have their own tone (e.g. sage-soft, background), but the sections above and below them have different background colours, creating a visible clash at the join. The fix is to adjust each section's gradient so that its edge colour matches the wave it touches.

### What changes

**Only file modified: `src/pages/Index.tsx`** -- updating the background gradient `div` inside each section so the top and bottom edges blend into the adjacent wave colour.

Here is the mapping of each section and what its gradient needs to transition between:

1. **Hero section** (line 93)
   - Top: keep `accent/20` (existing)
   - Bottom: fade to `sage-soft/40` to match the wave below it (variant 1, sage-soft/0.4)
   - Change: `bg-gradient-to-b from-accent/20 via-background to-sage-soft/40`

2. **How It Works section** (line 140)
   - Top: start from `sage-soft/40` to match wave above
   - Bottom: fade toward `background` to match wave below (variant 2, background)
   - Change: `bg-gradient-to-b from-sage-soft/40 via-accent/15 to-background`

3. **Features section** (line 177)
   - Top: start from `background` to match wave above
   - Bottom: fade to `sage-soft/30` to match wave below (variant 3, sage-soft/0.3)
   - Change: `bg-gradient-to-b from-background via-warm-cream/20 to-sage-soft/30`

4. **Reassurance section** (line 213)
   - Top: start from `sage-soft/30` to match wave above
   - Bottom: fade to `background` to match wave below (variant 1, background)
   - Change: `bg-gradient-to-b from-sage-soft/30 via-accent/20 to-background`

5. **Final CTA section** (line 239)
   - Top: start from `background` to match wave above
   - Bottom: fade to `sage-soft/20` to match footer wave (variant 2, sage-soft/0.2)
   - Change: `bg-gradient-to-b from-background via-background to-sage-soft/20`

6. **Footer** (line 262)
   - Already starts with `sage-soft/20` which matches -- no change needed.

### Result

Each section will smoothly gradient into the colour of the wave touching it, eliminating the two-tone clash. The waves themselves stay exactly as they are.
