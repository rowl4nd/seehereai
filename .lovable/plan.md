

## Add Wavy SVG Dividers Between Homepage Sections

Replace the hard straight-line transitions between sections with soft, organic SVG wave shapes to create a more flowing, calming feel.

### Approach

Create a reusable `WaveDivider` component that renders an SVG wave shape. Place it between each major section on the homepage (Hero, How It Works, Features, Reassurance, Final CTA, Footer).

Each wave will:
- Span the full width of the page
- Use the background colors of the adjacent sections to blend seamlessly
- Be slightly varied in shape to avoid looking repetitive
- Sit in negative margin space so sections flow into each other naturally

### What will change

**New file: `src/components/WaveDivider.tsx`**
- A small component that accepts a `fill` color (defaulting to the background color) and a `variant` prop (1-3) for different wave shapes
- Uses inline SVG with `preserveAspectRatio="none"` for full-width responsiveness
- Height around 60-80px for a gentle curve

**Modified file: `src/pages/Index.tsx`**
- Import and place `WaveDivider` between each section
- Remove the `border-b` from the header and `border-t` from the footer (the straight lines)
- Add negative margins on the dividers so they overlap slightly with adjacent sections, creating a seamless transition

### Visual result

Instead of flat, abrupt section boundaries, the page will have gentle curved waves flowing between each section -- matching the warm, calming aesthetic of SeeHere.

