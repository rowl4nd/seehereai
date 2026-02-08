

## Reduce Header Height

Adjust the header to use a 60px logo and 10px vertical padding (top and bottom).

### Changes

1. **`src/components/Logo.tsx`** -- Change the logo height class from `h-20` (80px) to a custom height of 60px using Tailwind's arbitrary value syntax: `h-[60px]`.

2. **`src/pages/Index.tsx`** -- Change the header vertical padding from `py-5` (20px each side) to a custom 10px using: `py-[10px]`.

This brings the total header height to approximately 80px (60px logo + 10px top + 10px bottom).

