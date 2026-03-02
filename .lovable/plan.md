
# Prevent Mobile Keyboard When Disclosure Modal Opens

## Problem
On mobile, tapping the chat textarea triggers two things simultaneously: the disclosure modal opens AND the keyboard appears (because the textarea gets focus). The keyboard obscures the modal, making it hard for users to read and accept the T&Cs.

## Solution
Make the textarea `readOnly` until the disclosure has been accepted. This prevents the keyboard from appearing on tap while still allowing the focus event to fire and trigger the modal. Once the user clicks "I understand", the `readOnly` attribute is removed and the textarea is focused programmatically (which is already handled in `handleDisclosureAccept`).

## Technical Detail

### Index.tsx -- Add `readOnly` to the textarea

Add `readOnly={!disclosureAccepted}` to the textarea element (around line 294). This way:
- First tap: focus fires, modal opens, but no keyboard (because readOnly)
- User taps "I understand": `disclosureAccepted` becomes true, textarea gets focused via the existing `setTimeout(() => textareaRef.current?.focus(), 50)`, keyboard opens normally
- All subsequent visits (sessionStorage flag set): textarea is editable immediately
