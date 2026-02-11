
## Consolidate Middle Sections into One

Currently the homepage has these separate sections between hero and FAQ:
1. "SeeHere" cards section (lines 148-180)
2. "What you will get" features section with CTA button (lines 182-227)
3. WaveDivider (line 229)
4. Reassurance/quote section (lines 231-253)

### What changes

**Merge everything into a single `<section>`** containing:
- "SeeHere" heading + subtitle + 4 cards
- "What you will get" heading + subtitle + 3 feature cards
- "When you're ready" CTA button
- Quote/blockquote with decorative lines

**Remove:**
- The separate Features section element (lines 182-227)
- The WaveDivider between features and quote (line 229)
- The separate Reassurance section element (lines 231-253)

**Result:** Only one `<section>` wraps all this content, with a single background gradient and decorative orbs. The flow goes: SeeHere cards, then "What you will get" cards, then CTA button, then quote -- all inside one continuous section.

The page structure becomes:
- Header
- Hero section
- WaveDivider
- **Combined middle section** (SeeHere cards + features + button + quote)
- WaveDivider
- FAQ section
- WaveDivider
- Footer

### Technical details

**File:** `src/pages/Index.tsx`

- Remove the closing `</section>` at line 180 and the opening `<section>` at line 183, merging them into one block
- Remove the WaveDivider at line 229
- Remove the `<section>` wrapper around the Reassurance quote (lines 232-253), keeping only the inner quote content
- Move the quote content (blockquote with decorative lines) inside the same `<div className="relative z-10 max-w-5xl mx-auto">` container, after the CTA button
- Use a single background gradient that covers the full merged section
- Keep decorative orbs but consolidate to avoid overlap
