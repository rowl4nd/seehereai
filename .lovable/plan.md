

# Fix Guidance Card Size Consistency

## Problem
On both `Guidance.tsx` and `GuestGuidance.tsx`, the card container resizes as users navigate between cards because each card has different text lengths. This causes a jarring layout shift.

## Solution
Set a fixed `min-height` on the card content area so all cards occupy the same space regardless of text length. This keeps the layout stable while the text transitions.

## Changes

### 1. `src/pages/Guidance.tsx`
- Add a fixed `min-height` to the card wrapper div (the one with `rounded-[60px]` and transition classes)
- Use `min-h-[280px]` (or similar) to accommodate the tallest card's content
- Center the text content vertically within the fixed-height container using flexbox

### 2. `src/pages/GuestGuidance.tsx`
- Apply the same fixed `min-height` and vertical centering to the equivalent card wrapper

## Technical Detail
On the card container div:
```
className="relative p-10 md:p-16 rounded-[60px] min-h-[280px] flex items-center justify-center ..."
```
And wrap the inner content div to center within that fixed space. This ensures all 6 cards render in identically-sized containers.

