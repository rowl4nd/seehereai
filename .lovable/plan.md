

# Modern Homepage Redesign for "See Here"

## The Problem

The current homepage is sparse -- a background image, a single line of text, and a button. It doesn't communicate what the product does, why someone should trust it, or what the experience feels like. It reads more like a placeholder than a landing page.

## What the New Homepage Will Look Like

A clean, modern single-page layout that flows vertically with distinct sections. No background image -- instead, the warmth comes from the colour palette, typography, and subtle animations. The design will feel calm, intentional, and premium.

### Section-by-Section Breakdown

**1. Hero Section (full viewport height)**
- The "see here" logo top-left, "Log in" / "Dashboard" button top-right (same as now)
- Centred: large serif headline "a psychologically informed listening ear" with a softer subheading beneath explaining the product in one line
- A gentle animated decorative element (a soft, pulsing circle or gradient orb) to add visual warmth without a photo
- The CTA button "when you're ready, let's proceed" -- styled with the sage green, slightly larger, with a subtle hover animation

**2. How It Works (3 steps)**
- Three simple cards side-by-side (stacked on mobile):
  1. "Share what's on your mind" -- a safe space, no judgment
  2. "Receive thoughtful reflections" -- informed by psychology
  3. "Build self-awareness" -- at your own pace
- Clean icons (from lucide-react), minimal text, gentle fade-in animations on scroll

**3. What This Space Offers**
- Two or three short feature highlights in a staggered layout:
  - "Person-centred listening" -- unconditional positive regard, empathic understanding
  - "Gentle, practical support" -- CBT-informed techniques offered as invitations, never prescriptions
  - "Your pace, your space" -- sessions that respect your time, with no pressure
- Uses the warm cream/sage colour palette with subtle card backgrounds

**4. A Gentle Reassurance Section**
- A centred quote-style block: "This is not therapy. It's a companion for reflection -- a space to think out loud, at your own pace."
- Warm, italic serif font, with a decorative horizontal line above and below

**5. Footer**
- Minimal: "A space for reflection" tagline, same as current
- Optionally a small "Begin" CTA link

## What Stays the Same
- All existing functionality: auth-aware header (Log in vs Dashboard), CTA linking to /auth
- The "see here" branding, lowercase, serif font
- The warm colour palette (sage, cream, accent greens)
- The fonts (Cormorant Garamond for headings, Nunito for body)

## What Changes
- The lake background image is removed in favour of a cleaner, more modern aesthetic
- The page goes from a single centred block to a flowing multi-section layout
- More content to explain what "See Here" actually is, building trust before the user signs up
- Subtle scroll-based fade-in animations for each section
- The overall feel shifts from "template" to "considered product"

## Technical Details

**Single file change:** `src/pages/Index.tsx`

- Replace the current single-section layout with a multi-section scroll page
- Each section uses existing Tailwind utilities and the project's colour tokens (no new dependencies)
- Icons from `lucide-react` (already installed) for the "How It Works" cards
- Scroll animations using an Intersection Observer hook (built inline or as a small utility) to trigger fade-in-up effects as sections enter the viewport
- Fully responsive: cards stack vertically on mobile, side-by-side on desktop
- The lake background image import is removed (the file stays in assets, just unused)
- No new CSS needed -- everything uses existing utility classes and design tokens

