

## Replace Homepage with Updated Version

Replace `src/pages/Index.tsx` with your updated code. Since the JSX tags were stripped during paste, I'll reconstruct them using the existing file as a base and apply the specific differences from your version:

### Changes to apply

1. **Background shapes comment** -- "Flowing background shapes" becomes "Flowing background shapes - more subtle"
2. **Safety notice** -- Reworded from "If you're in crisis, please contact the Samaritans on 116 123 or text SHOUT to 85258" to the shorter "In crisis? Contact Samaritans: 116 123 or text SHOUT to 85258"
3. **Step cards comment** -- "Step cards" becomes "Step cards - modernized"
4. **Scroll hint text** -- "scroll" capitalized to "Scroll"
5. **"Who this is for" list** -- Refactored from four individual `<li>` elements to a `.map()` over an array of strings
6. **Footer link opacity** -- `text-muted-foreground/70` changed to `text-muted-foreground/60` on both Terms and Privacy links

### Technical details

- File: `src/pages/Index.tsx`
- All imports, data arrays, component structure, and styling remain identical
- No new dependencies needed
- Changes are minor refinements to copy, comments, code style, and opacity values

