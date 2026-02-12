
## Speed Up Mobile Load Time

### Problem
The app loads **12 separate Google Fonts via CSS `@import`** -- each is a render-blocking network request. Only 3 of these fonts are actually used. On mobile, this can add 3-5 seconds of unnecessary load time.

### Changes

**1. Remove 9 unused font imports from `src/index.css`**

Remove these unused imports:
- Inter
- Lora
- Space Mono (imported twice)
- Space Grotesk
- Work Sans
- Inconsolata (imported twice)
- Montserrat
- Libre Caslon Text

Keep only:
- Cormorant Garamond (headings)
- Nunito (body text)
- Crimson Pro (serif variable)

**2. Switch remaining fonts from `@import` to `<link>` tags in `index.html`**

Move the 3 remaining font imports into `index.html` as `<link rel="preconnect">` and `<link>` tags. This allows the browser to start downloading fonts earlier and in parallel, rather than waiting for CSS to parse.

**3. Update CSS variable font stacks**

Clean up the `--font-sans` and `--font-mono` variables that reference removed fonts (Montserrat, Inconsolata) to use the actual fonts in use (Nunito, system monospace).

### Technical Details

**Files changed:**
- `src/index.css` -- remove 9 `@import` lines, convert remaining 3 to link tags in HTML
- `index.html` -- add preconnect and font link tags

**Expected impact:** Removing 9 render-blocking requests should noticeably improve first paint time, especially on mobile connections.
