

# Add Terms & Privacy Links to Landing Page Footer

## Overview

The footer on the landing page is missing the links to "Terms & Conditions" and "Privacy Policy" that were part of the original plan. Currently, the footer only shows "A space for reflection".

## What Changes

### Update the footer in `src/pages/Index.tsx`

Replace the current simple footer with one that includes links to both pages, keeping the warm styling consistent with the rest of the page.

The updated footer will contain:
- The existing "A space for reflection" tagline
- A row of links below it: **Terms & Conditions** (linking to `/terms`) and **Privacy Policy** (linking to `/privacy`)
- Both links will open in a new tab so users don't lose their place on the landing page
- Links styled subtly with `text-muted-foreground` and a hover effect, matching the page's gentle aesthetic

No other files need to change -- the `/terms` and `/privacy` routes and pages already exist.

