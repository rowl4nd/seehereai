

# Update Privacy Policy and Terms & Conditions

## Overview

Update both legal pages to reflect the new encryption-at-rest implementation and replace all generic "contact us through the application" references with the email address cecilia@seehere.ai.

## Privacy Policy Changes

### Section 1 (Who We Are)
- Replace "please contact us through the application" with "please contact us at cecilia@seehere.ai"

### Section 4 (How Your Data Is Stored and Protected)
- Add specific mention of **AES-256-GCM encryption-at-rest** for conversation data
- Clarify that conversations are encrypted before being written to the database, meaning they cannot be read in their raw stored form -- even by database administrators
- Retain existing mentions of row-level security and HTTPS/TLS

### Section 5 (Who Can Access Your Data)
- Update the "Nominated administrator" bullet to clarify that while an administrator has access to the database for service administration, **conversation content is encrypted and cannot be read** at the database level
- This is an important distinction: admin can see metadata (timestamps, session IDs) but not message content

### Section 8 (How to Exercise Your Rights)
- Replace "please contact us through the application" with "please contact us at cecilia@seehere.ai"

### Section 13 (Contact)
- Replace "please reach out through the application" with the email address cecilia@seehere.ai

## Terms and Conditions Changes

### Section 4 (Privacy and Data)
- Add mention that conversations are **encrypted at rest** using industry-standard encryption
- Clarify that even at the database level, conversation content is not stored in a readable format

### Section 9 (Contact)
- Replace "please reach out through the application" with "please contact us at cecilia@seehere.ai"

## Technical Details

Both files are React components rendering static content. The changes are text-only updates to `src/pages/Privacy.tsx` and `src/pages/Terms.tsx`. The email address will be rendered as a clickable `mailto:` link styled consistently with the existing ICO and Stripe links in the Privacy Policy.

