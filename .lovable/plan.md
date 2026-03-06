

## Plan: Add Login Button to Disclosure Modal

Add a "Log in" link/button to the `DisclosureModal` component in `src/pages/Index.tsx` so existing users can go to `/auth` instead of starting a new trial.

### Changes

**`src/pages/Index.tsx`** (lines 46-98, `DisclosureModal` component):
- Add a secondary button or text link below the "I understand — continue" button that reads "Already have an account? Log in" and navigates to `/auth`
- Use `Link` from react-router-dom (already imported) styled as a subtle text link, consistent with the modal's existing design

