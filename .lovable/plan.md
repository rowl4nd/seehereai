

## Plan: Move "Two free sessions" label to hero section, revert disclosure modal

### 1. Revert disclosure modal (`src/components/DisclosureModal.tsx`)
Remove the "Two free sessions" label, divider, and flex wrapper from the lavender box. Restore it to just the "Have an account? Log in" link with the lavender background styling.

### 2. Add "Two free sessions" to hero badges (`src/pages/Index.tsx`)
Insert a bold "Two free sessions" label to the left of the existing badge row (lines 249–261), separated by the same vertical divider style already used between badges. The label will use `font-bold` to stand out while matching the existing `text-xs text-[#5f5a53]` style of the row.

Result: the badges row reads **Two free sessions** | Encrypted & private | Available 24/7 | No subscriptions.

