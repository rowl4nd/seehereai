

# Add Privacy Policy and GDPR Compliance

## Overview

Create a comprehensive Privacy Policy page, simplify onboarding to two checkboxes (terms and privacy -- folding the AI disclosure into the terms), add a new database column to track privacy acknowledgement, and add footer links on the landing page.

## What Changes

### 1. Update Terms & Conditions -- fold in AI disclosure
**File:** `src/pages/Terms.tsx`

The existing "AI Disclosure" section (section 2) already covers this well. We will add a stronger, clearer line to it so that by accepting the terms, the user is explicitly acknowledging they are speaking with an AI. The updated wording will read:

> "By using See Here, you acknowledge and accept that you are interacting with an artificial intelligence system, not a human."

This replaces the need for a separate AI checkbox.

### 2. New page -- Privacy Policy
**File:** `src/pages/Privacy.tsx` (new)

A comprehensive, GDPR-compliant privacy policy page styled identically to the Terms page. Sections will include:

1. **Who we are** -- data controller details
2. **What data we collect** -- email, conversation messages, session history, payment info (via Stripe)
3. **Why we collect it (lawful basis)** -- contractual necessity for service delivery, consent for optional data
4. **How data is stored and protected** -- encrypted, row-level security, only you can access your own data
5. **Who can access your data** -- only you; nominated admin for service administration only; no third-party marketing access
6. **Data retention** -- how long data is kept
7. **Your rights under GDPR** -- access, rectification, erasure ("right to be forgotten"), restrict processing, data portability, objection
8. **How to exercise your rights** -- clear instructions
9. **Cookies** -- what cookies are used (authentication only)
10. **Third-party services** -- Stripe for payments, AI model for conversations
11. **Children's privacy** -- service is for users 18+
12. **Changes to this policy** -- notification process
13. **Contact** -- how to reach the data controller

### 3. Simplify onboarding -- remove AI checkbox, add privacy checkbox
**File:** `src/pages/Onboarding.tsx`

- Remove the "I understand I am speaking with an AI" checkbox entirely
- Remove the `aiDisclosureAccepted` state variable
- Add a new `privacyAccepted` state variable and checkbox: "I have read and accept the privacy policy" (with a link opening `/privacy` in a new tab)
- The Continue button requires both `termsAccepted` and `privacyAccepted` to be ticked
- On submit, set `has_acknowledged_terms: true`, `has_acknowledged_ai_disclosure: true` (kept true for backward compatibility), and `has_acknowledged_privacy_policy: true`

### 4. Database -- add privacy acknowledgement column
**Migration:**

```sql
ALTER TABLE public.profiles
ADD COLUMN has_acknowledged_privacy_policy boolean NOT NULL DEFAULT false;
```

No new RLS policies needed -- the existing policies already restrict users to their own profile row.

### 5. Update profile hook
**File:** `src/hooks/useProfile.tsx`

Add `has_acknowledged_privacy_policy: boolean` to the `Profile` interface.

### 6. Register the route
**File:** `src/App.tsx`

Add `<Route path="/privacy" element={<Privacy />} />` and import the new page.

### 7. Add footer links to landing page
**File:** `src/pages/Index.tsx`

Update the footer to include links to both "Terms & Conditions" and "Privacy Policy", keeping the existing warm styling.

