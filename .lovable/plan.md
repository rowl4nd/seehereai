

## Sticky Headers on All Pages

### 1. Fix Index Page (1 change)

In `src/pages/Index.tsx`, change `overflow-x-hidden` to `overflow-x-clip` on the outer wrapper div. The header already has sticky classes but they're broken by the overflow property.

### 2. Add Sticky Headers to 12 Other Pages

For each page below, replace the `<header>` classes -- swapping `relative z-10` for `sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40`:

| Page | File |
|------|------|
| Dashboard | src/pages/Dashboard.tsx |
| Mirror | src/pages/Mirror.tsx |
| Auth | src/pages/Auth.tsx |
| Credits | src/pages/Credits.tsx |
| Cooldown | src/pages/Cooldown.tsx |
| Guidance | src/pages/Guidance.tsx |
| Session History | src/pages/SessionHistory.tsx |
| Onboarding | src/pages/Onboarding.tsx |
| Payment Success | src/pages/PaymentSuccess.tsx |
| Reset Password | src/pages/ResetPassword.tsx |
| Terms | src/pages/Terms.tsx |
| Privacy | src/pages/Privacy.tsx |

### What the sticky header looks like

- Pinned to top on scroll
- Semi-transparent background with blur effect
- Subtle bottom border for separation from content

### Technical Detail

Each header gets these Tailwind classes:
- `sticky top-0` -- pins to top
- `z-50` -- stays above content
- `bg-background/95 backdrop-blur-sm` -- blurred semi-transparent background
- `border-b border-border/40` -- subtle divider

