

# Remove Guidance Pages and Add New Opening Message with Linked Terms

## Overview
Remove the guidance step from both guest and authenticated flows, so users go straight into the chat. Replace the greeting message with your new opening text that includes clickable links to Terms & Conditions and Privacy Policy.

## Changes

### 1. GuestChat.tsx -- Remove guidance redirect, update greeting
- Remove the redirect to `/try/guidance` (the `sessionStorage` check for `guest_onboarding_complete`)
- Replace the greeting text with your new multi-paragraph opening message
- Since the greeting contains links (Terms & Conditions, Privacy Policy), render the greeting message using a special component instead of plain text. The greeting message (id `"greeting"`) will render as JSX with `<a>` tags linking to `/terms` and `/privacy`

### 2. Mirror.tsx -- Remove guidance redirect, update greeting
- Remove the redirect to `/onboarding` for users who haven't completed onboarding
- Update `getGreeting()` to return the new opening message (same text, but personalised with the user's name if known)
- Add the same special rendering for the greeting message to support clickable links

### 3. Both chat pages -- Message rendering
- Add a helper function (or inline logic) that checks if a message id is `"greeting"` and renders it with embedded links rather than plain text
- The links will be styled to stand out (underlined, slightly lighter) within the purple assistant bubble
- All other messages continue to render as plain text

### 4. Index.tsx -- Update CTA navigation
- Change the "Start your first free session" button to navigate directly to `/try` instead of `/try/guidance`

### 5. Auth.tsx -- Update try-it navigation
- Change the "Try without an account" button to navigate to `/try` instead of `/try/guidance`

### 6. Dashboard.tsx -- Skip guidance for authenticated users
- Change the "Start Session" flow to navigate directly to `/mirror` instead of `/guidance`

### 7. Onboarding.tsx -- Skip guidance redirect
- Change the post-onboarding redirect from `/guidance` to `/mirror`

### 8. App.tsx -- Remove guidance routes (optional cleanup)
- Remove the `/guidance` and `/try/guidance` routes
- Remove the imports for `Guidance` and `GuestGuidance`

## Opening Message Text
The greeting bubble will display:

> Welcome to See Here. I'm a warm, AI-powered space for you to share whatever is on your mind.
>
> Before we begin, please know that I am a listening companion, not a therapist, and I don't diagnose, treat, or give medical advice.
>
> Your privacy is held safely here. By continuing our chat, you acknowledge that you've read and agree to our [Terms & Conditions](/terms) and [Privacy Policy](/privacy). If you are in immediate danger or distress, please stop here and call 116 123 (Samaritans) or 999.
>
> Take a breath. When you're ready, what's been on your mind?

"Terms & Conditions" and "Privacy Policy" will be clickable links that open in a new tab.

## Technical Detail: Rendering Links in Chat Bubbles
A `renderMessageContent` helper will check if the message is the greeting (by id). For the greeting, it returns JSX with `<a>` tags. For all other messages, it returns the plain text in a `<p>` tag as before. This avoids using `dangerouslySetInnerHTML` and keeps things safe.

