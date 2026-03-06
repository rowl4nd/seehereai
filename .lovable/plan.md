

## Plan: Add Disclosure Modal to Blog Pages

### What
Extract the `DisclosureModal` into a shared component. On every blog/content page, replace the CTA `<Link to="/">` buttons with a button that opens this modal. The modal's "I understand — continue" navigates to `/try`, and the "Log in" link goes to `/auth`.

### Changes

1. **Create `src/components/DisclosureModal.tsx`**
   - Extract the existing modal from `src/pages/Index.tsx` into a standalone component
   - Props: `open: boolean`, `onAccept: () => void`, `onClose: () => void`
   - Same design, same content, includes the "Log in" link to `/auth`

2. **Update `src/pages/Index.tsx`**
   - Import and use the new shared `DisclosureModal` instead of the inline one

3. **Update all 7 blog/content pages** to use the modal:
   - `Blog.tsx` (header CTA + bottom CTA)
   - `AffordableMentalHealth.tsx`
   - `AIEmotionalSupport.tsx`
   - `AnxietySupport.tsx`
   - `TalkingToSomeone.tsx`
   - `NHSWaitingList.tsx`
   - `MentalClarity.tsx`

   In each page:
   - Add `useState` for `showDisclosure`
   - Replace `<Link to="/">` CTA buttons with `<button onClick={() => setShowDisclosure(true)}>` (same styling)
   - Render `<DisclosureModal>` when open; on accept, set `sessionStorage` flag and navigate to `/try`

### Affected files: 9 total (1 new component + 8 page updates)

