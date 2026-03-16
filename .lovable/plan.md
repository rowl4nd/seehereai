

## Plan: Split Funnel into Two User Journeys

**Only file changed:** `src/pages/Admin.tsx` — layout change only, no tracking modifications.

### Structure

Replace the current single funnel card with:

1. **Homepage Viewed** — top-level count, centered
2. **Three-way branch** — same as current (Started chatting, Logged in, No interaction) with % of homepage_viewed
3. **Two journey cards side by side** (using a `grid grid-cols-1 lg:grid-cols-2 gap-4` layout):

**New User Journey** (flows from "Started chatting"):
`disclosure_shown → disclosure_accepted → guest_message_sent → signup_modal_shown → account_created`
Each step shows count + drop-off % from previous step.

**Returning User Journey** (flows from "Logged in"):
`login_from_homepage → session_started → cooldown_page_viewed → credits_page_viewed → purchase_started → purchase_completed`
Each step shows count + drop-off % from previous step.

### Implementation

- Replace `LINEAR_FUNNEL_STEPS` with two constants: `NEW_USER_STEPS` and `RETURNING_USER_STEPS`
- Replace the funnel Card content (lines 176–232) with the new layout: homepage count → branch → two side-by-side Cards
- Each journey card renders its steps vertically (cleaner than horizontal for 5-6 steps) with arrow indicators and drop-off percentages
- Reuse existing `getCount` and `pct` helpers

