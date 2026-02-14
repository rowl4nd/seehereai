
## Consistent Header Padding Across All Pages

The homepage header uses compact padding (`px-4 py-2 md:px-8`) while all 12 other pages use larger padding (`p-6 md:p-8`). This makes headers look different widths.

### The Fix

Update all other pages to match the Index page's padding: `px-4 py-2 md:px-8`.

### Pages to Update (12 files)

| Page | Current Padding | New Padding |
|------|----------------|-------------|
| Dashboard.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Mirror.tsx | `px-4 md:px-6 py-[10px]` | `px-4 py-2 md:px-8` |
| Auth.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Credits.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Cooldown.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Guidance.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| SessionHistory.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Onboarding.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| PaymentSuccess.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| ResetPassword.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Terms.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |
| Privacy.tsx | `p-6 md:p-8` | `px-4 py-2 md:px-8` |

This ensures every page header has the same compact look as the homepage.
