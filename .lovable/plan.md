

# Remove Disclosure Greeting from Guest Chat

## What's changing
Since the homepage now shows a disclosure modal (T&Cs, privacy, AI disclaimer) before the user can even type, the guest chat no longer needs to repeat all that legal text as its first message. We'll replace the four-paragraph disclosure greeting with a short, warm opening line.

## Changes

### 1. GreetingMessage.tsx -- Simplify to a warm opener
Replace the current multi-paragraph legal disclosure with a simple, inviting message like:
> "Welcome to See Here. I'm here to listen -- share whatever's on your mind."

Remove the Terms/Privacy links and emergency contact info (already covered by the homepage modal). Remove the unused `Link` import.

### 2. GuestChat.tsx -- Remove greeting from sessionStorage seeding
Currently, when no saved messages exist, the code seeds a `greeting` placeholder message. This still makes sense (to show the welcome), but we should also ensure that if the user arrives with an `initialMessage` from the homepage, the greeting appears before their message rather than being skipped. No structural change needed here -- the existing logic already handles this correctly since the greeting is added on mount and the initial message is sent after a 300ms delay.

## Summary
- One file changed: `GreetingMessage.tsx`
- The greeting becomes a brief, warm welcome (no legal text)
- All legal acknowledgment is handled by the homepage disclosure modal before the user reaches the chat

