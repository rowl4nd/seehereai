

## Reduce Gap Between Header and Hero Content

### Current Spacing
- Header has `py-5` (20px top/bottom padding) -- this is fine
- Hero section uses `min-h-[85vh]` which makes it take up 85% of the viewport, and `justify-center` places the content in the middle of that tall section -- this is what creates the large gap

### Changes (src/pages/Index.tsx)

1. **Reduce hero section height** from `min-h-[85vh]` to `min-h-[70vh]` -- this pulls all the content up by reducing the overall section height while still keeping a comfortable hero area
2. **Reduce header vertical padding** from `py-5` (20px) to `py-3` (12px) for a tighter header

These two changes together will noticeably move everything up without making it feel cramped.

