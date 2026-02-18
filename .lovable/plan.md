
# Replace quote section with side-by-side images

## What changes

### 1. Add images to assets
Copy the 3 uploaded images into `src/assets/`:
- `quote-card-1.png` (the purple/reflective space quote)
- `quote-card-2.png` (the founder quote)
- `quote-card-3.png` (the anonymous user quote)

### 2. Update the quote section in `src/pages/Index.tsx`

Replace the current blockquote text (lines 394-404) with a new layout showing the 3 images side by side:
- Import the 3 new images at the top of the file
- Replace the `<blockquote>` with a responsive grid (`grid grid-cols-1 md:grid-cols-3 gap-6`)
- Each image gets `rounded-xl` for slightly rounded corners
- Add `shadow-lg` to lift them off the page
- Widen the container from `max-w-3xl` to `max-w-6xl` to give the 3 images room
- On mobile, they stack vertically; on desktop they sit side by side

## Technical details

- Images are imported as ES6 modules from `@/assets/` for proper bundling
- The section background (`bg-[#f8f6f3]`) stays the same -- it complements the image colours
- Each image uses `w-full h-auto object-cover` to scale responsively within its grid cell
