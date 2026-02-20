

# New "Mental Clarity" SEO Content Page

Create a new page at `/mental-clarity` that adapts the provided content into the same layout and styling used by the Terms and Privacy pages (sticky header with Logo + close button, centered content column, footer).

## New file: `src/pages/MentalClarity.tsx`

- **Header**: Same sticky header with `<Logo />` and `X` close button as Terms/Privacy
- **Main content**: Wrapped in the same `max-w-2xl mx-auto` container with `animate-fade-in`
- **Styling**: Uses existing Tailwind theme classes (`bg-background`, `text-foreground`, `font-serif`, etc.) instead of hardcoded hex values like `#FDFCFB` or `#1A1A1A`, keeping it consistent with the rest of the app
- **SEO meta injection**: Uses a `useEffect` to inject `<title>` and `<meta name="description">` into `document.head` (same pattern as the Organization schema on Index), rather than adding `react-helmet` as a new dependency
- **Content preserved**: All sections from the provided code -- hero heading, blockquote, "What is Reflective Dialogue", numbered steps, and CTA box -- will be included with styling adapted to match the app's design tokens
- **CTA link**: The "Start a Reflective Session" button will link to `/` (homepage)
- **Footer**: Same minimal footer as Terms/Privacy

## Updated file: `src/App.tsx`

- Import the new `MentalClarity` component
- Add route: `<Route path="/mental-clarity" element={<MentalClarity />} />`
- No navigation link added anywhere (as requested)

## No new dependencies

Uses existing project patterns and Tailwind classes only.

