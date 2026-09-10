# Contact form — reason field + triageable subject lines

## Accessibility confirmation (no changes needed)

Verified directly in code — all three items from the earlier WCAG pass are already in place:

- Hero submit button (`Index.tsx:327`): `aria-label="Send message"` — present.
- Hero textarea (`Index.tsx:308–311`): real `<label>` ("Share what's on your mind") linked via `htmlFor`/`id="hero-message"` — present.
- Chat inputs (`Mirror.tsx:915`, `GuestChat.tsx:661`): both textareas have `aria-label="Share what's on your mind"` — present.

Nothing to add for these three.

## Contact form changes

**1. `src/pages/Contact.tsx`**
- Add a required "What's this about?" select (using the existing shadcn `Select` component, consistent with the rest of the form) with three options:
  - Offering SeeHere to my organisation
  - Personal access
  - Something else
- Include the selected reason in the `send-contact-email` invocation body.
- Validation: reason required alongside email and message before submit.

**2. `supabase/functions/send-contact-email/index.ts`**
- Accept the new `reason` field; validate it against the three allowed values (reject anything else).
- Build the subject from the reason instead of the generic "Contact Form: {name}":
  - Organisation inquiry → `Organisation inquiry: {name}`
  - Personal access → `Personal access request: {name}`
  - Something else → `General inquiry: {name}`
- Fallback to `{name}` → "Not provided" as now.
- Redeploy the function.

The rest of the form (name, email, message, confirmation state) stays as-is.
