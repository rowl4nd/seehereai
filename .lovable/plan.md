

## Update Confirmation Email Branding to "SeeHere"

### What's happening
The confirmation emails sent to users (for signup verification, password reset, etc.) currently show "kindred-connect" as the sender/project name. This is confusing for users who signed up for "SeeHere".

### How to fix it
The email templates and sender name are configured in the backend's authentication settings. I'll use the auth configuration tool to update:

1. **Site name** -- Change from "kindred-connect" to "SeeHere" so emails display the correct app name
2. **Email subject lines** -- Update confirmation, password reset, and other email subjects to reference "SeeHere"

### Technical Details

**Tool used:** `configure-auth` to update the mailer settings including:
- `MAILER_SITE_URL` or site name to "SeeHere"  
- Email template subjects (e.g., "Confirm your SeeHere account", "Reset your SeeHere password")

No code file changes are needed -- this is purely a backend configuration update.

