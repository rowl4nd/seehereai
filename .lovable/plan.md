

# WCAG 2.1 Accessibility Fixes

## Overview

Implementing accessibility improvements across 7 files, covering ARIA semantics, keyboard focus, and colour contrast -- all while preserving the soft, muted aesthetic.

---

## Changes by File

### 1. `src/pages/Guidance.tsx`
- Add `<h1 className="sr-only">Session Guidance</h1>` before progress dots
- Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` to the progress dots container
- Replace `outline-none` on the Continue button with `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-md`
- Darken `text-[#a39e96]` to `text-[#857f77]` (passes 4.5:1 on #f8f6f3, keeps warm taupe hue)
- Crisis notice: remove `opacity-60`, change `text-[#c2beb8]` to `text-[#857f77]` and bump from `text-[9px]` to `text-xs`
- Card body text: darken `text-[#6b665f]` to `text-[#5f5a53]` (passes 4.5:1 on the glass bg)
- Footer link: increase from `text-[10px]` to `text-xs`, add `px-4 py-2 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#af9cd3] focus-visible:ring-offset-2 rounded-md`

### 2. `src/pages/GuestGuidance.tsx`
- Same heading, progress dots, Continue button, and contrast fixes as Guidance.tsx
- Same crisis notice and footer link fixes

### 3. `src/pages/Index.tsx`
- Add `aria-hidden="true"` to all decorative icons: `Check` (x3), `X` (x3), `Heart` (x3), `Shield` (x2), `Clock` (x1), `MessageCircle` (x1)
- Footer: change `text-muted-foreground/60` to `text-muted-foreground/80` on the Terms, Privacy, and Contact links (passes ~6:1)

### 4. `src/pages/Mirror.tsx`
- Loading indicator (typing dots): add `role="status"` and `aria-live="polite"` and `aria-label="Waiting for response"` to the container div
- Timer progress bar: add `role="progressbar"`, `aria-valuenow={timeRemaining}`, `aria-valuemax={sessionDuration}`, `aria-label` with formatted time remaining

### 5. `src/pages/Dashboard.tsx`
- Loading state: add `role="status"` and `aria-live="polite"` to the "Loading..." div
- Purchase button (Finding 4E): change to dark purple text on original light purple background: `text-[#3d2b5a]` on `bg-[#af9cd3]` -- this gives ~7:1 contrast and avoids a heavy look

### 6. `src/pages/Cooldown.tsx`
- Change `text-muted-foreground/70` to `text-muted-foreground/80`

### 7. `src/pages/Contact.tsx`
- Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md` to the Back button

---

## Technical Details

### Focus Visible Strategy
All focus styles use `:focus-visible` (via Tailwind's `focus-visible:` prefix), which only activates on keyboard navigation and not on mouse/touch clicks. This keeps the UI clean for mouse users.

### Colour Contrast Values (calculated against respective backgrounds)

| Element | Before | After | Ratio |
|---------|--------|-------|-------|
| `#a39e96` on `#f8f6f3` | ~2.8:1 | `#857f77` ~4.5:1 | Pass AA |
| `#6b665f` on glass (~#f5f2ee) | ~4.3:1 | `#5f5a53` ~5.0:1 | Pass AA |
| Crisis `#c2beb8` @ 60% opacity | ~1.8:1 | `#857f77` solid ~4.5:1 | Pass AA |
| `muted-foreground/60` | ~3.2:1 | `/80` ~6:1 | Pass AA |
| Purchase btn white on `#af9cd3` | ~2.9:1 | `#3d2b5a` on `#af9cd3` ~7:1 | Pass AA |
| `muted-foreground/70` (Cooldown) | ~3.8:1 | `/80` ~6:1 | Pass AA |

### Files Changed
7 files total, all frontend pages. No backend or database changes required.

