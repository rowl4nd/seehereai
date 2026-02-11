

## Add Flowing Background Shapes

### What we'll do
Add soft, organic SVG shapes that float behind the content throughout the page. These will use the three specified colours (#cbb7ef lavender, #b1cfac sage green, #fae5da warm peach) as large, blurred, semi-transparent blobs positioned at different points down the page. They'll feel like gentle watercolour washes drifting behind the text.

### Approach
Create a dedicated background layer (a single absolute-positioned div spanning the full page height) containing 5-7 organic SVG blob shapes. Each blob will:
- Use one of the three colours at low opacity (10-20%)
- Have a large blur filter applied (80-120px)
- Be positioned at staggered vertical and horizontal positions so they create gentle colour shifts as you scroll
- Use soft, irregular border-radius values to look organic rather than circular
- A couple will have a very slow, subtle CSS animation (gentle floating/drifting) to add life without distraction

### Technical detail

**File: `src/pages/Index.tsx`**

Add a background shapes container immediately inside the root div, before the header:

```tsx
{/* Flowing background shapes */}
<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
  <div className="absolute -top-20 -left-32 w-[500px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#cbb7ef]/15 blur-[100px]" />
  <div className="absolute top-[20%] -right-20 w-[450px] h-[350px] rounded-[40%_60%_70%_30%/40%_70%_30%_60%] bg-[#b1cfac]/15 blur-[90px]" />
  <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-[#fae5da]/20 blur-[100px]" />
  <div className="absolute top-[55%] right-[15%] w-[350px] h-[300px] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] bg-[#cbb7ef]/12 blur-[110px]" />
  <div className="absolute top-[75%] -left-10 w-[500px] h-[350px] rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-[#b1cfac]/12 blur-[100px]" />
  <div className="absolute top-[90%] right-[5%] w-[400px] h-[400px] rounded-[50%_40%_60%_50%/40%_60%_50%_40%] bg-[#fae5da]/18 blur-[90px]" />
</div>
```

- All existing content elements get `relative z-10` (most already have this) so they sit above the shapes.
- Remove or reduce the existing decorative orbs inside individual sections since these new page-level shapes replace them, keeping the design clean rather than doubling up on background effects.
- The `fixed inset-0` positioning means the shapes stay in place as you scroll, creating a parallax-like depth effect where content glides over the soft colour washes.

**File: `src/index.css`**

Add a gentle floating animation for optional use on 1-2 of the blobs:

```css
@keyframes gentleFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, -20px) scale(1.03); }
}
```

Two of the blobs will use `animate-[gentleFloat_20s_ease-in-out_infinite]` to add very slow, barely perceptible movement.

### Result
The page will have a watercolour-like quality with soft lavender, sage, and peach washes floating behind the content. The shapes are large enough to feel atmospheric but transparent and blurred enough to stay well in the background. The overall effect is gentle, organic, and calming -- adding visual richness without competing with the content.

