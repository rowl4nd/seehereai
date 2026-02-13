

# Update Contact Email to hello@seehere.ai

## Summary
Replace all instances of `cecilia@seehere.ai` with `hello@seehere.ai` across the website's public-facing pages.

## Changes

### 1. `src/pages/Terms.tsx`
- Update the contact email in Section 9 (1 occurrence)

### 2. `src/pages/Privacy.tsx`
- Update the contact email in Section 1 "Who We Are" (1 occurrence)
- Update the contact email in Section 8 "How to Exercise Your Rights" (1 occurrence)
- Update the contact email in Section 13 "Contact" (1 occurrence)

### Not Changed
- Migration files in `supabase/migrations/` reference `cecilia@seehere.ai` as an **allowed tester email / admin account** -- these are user account references, not contact info, so they stay as-is.

**Total: 4 email replacements across 2 files.**
