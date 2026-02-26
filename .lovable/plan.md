

# Separate Greeting Messages for Guest Chat vs Mirror Chat

## Overview
The Mirror chat (for authenticated, returning users) currently shows the same full disclaimer greeting as the guest chat. Since Mirror users have already acknowledged the Terms & Conditions and Privacy Policy during onboarding, they should see a warmer, simpler "welcome back" message instead.

## Changes

### 1. Create a new `WelcomeBackMessage` component
- New file: `src/components/WelcomeBackMessage.tsx`
- A simple, warm greeting for returning users
- Personalised with the user's name if available
- Example text:
  > Welcome back[, Name]. I'm here whenever you're ready to talk.
  >
  > Take a breath. When you're ready, what's been on your mind?

### 2. Update `Mirror.tsx` to use the new component
- Replace the `GreetingMessage` import/usage with `WelcomeBackMessage`
- In the message rendering block (around line 642), change:
  - `<GreetingMessage userName={profile?.display_name} />` to `<WelcomeBackMessage userName={profile?.display_name} />`

### 3. No changes to `GuestChat.tsx`
- The guest chat keeps the full disclaimer greeting with linked Terms and Privacy Policy as-is.

## Welcome Back Message Text
> Welcome back. I'm here whenever you're ready to talk.
>
> Take a breath. When you're ready, what's been on your mind?

If the user's name is known:
> Welcome back, [Name]. I'm here whenever you're ready to talk.
>
> Take a breath. When you're ready, what's been on your mind?

