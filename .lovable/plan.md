

# Privacy-First Guest Conversion Flow

## What You'll Get

Visitors can try the chat without creating an account first. They'll go through guidance cards, chat for 3 messages, then see an inline sign-up modal (no page navigation). Once they create an account, the chat continues seamlessly with a timer and their first free credit.

## User Journey

1. Visitor clicks a CTA on the homepage -> goes to `/try/guidance`
2. Sees the same guidance cards (stored in sessionStorage so it's forgotten if they leave)
3. After guidance, arrives at `/try` -- the guest chat
4. Below the input: "By sending a message, you agree to our Terms and Privacy Policy"
5. Guest sends up to 3 messages with AI responses
6. After the 3rd AI response: input disables, **"Secure Your Session" modal appears as an overlay on the same page**
7. Modal contains a sign-up form (email + password) -- **no navigation to /auth**
8. On successful sign-up: modal closes, profile is created with onboarding marked complete, a free session starts, guest messages are persisted, and the **chat continues right there** with the timer now running
9. "Not Now" discards sessionStorage and returns to homepage

## Technical Changes

### New Files

**`src/pages/GuestGuidance.tsx`**
- Reuses the same `guidanceCards` data from Guidance.tsx
- No auth required
- Stores `guest_onboarding_complete = true` in `sessionStorage` on completion
- Navigates to `/try`

**`src/pages/GuestChat.tsx`**
The core of this feature. A self-contained chat page that:
- Checks sessionStorage for `guest_onboarding_complete` on mount; redirects to `/try/guidance` if missing
- Renders the same chat UI (message bubbles, textarea, send button)
- Shows consent text below the input: "By sending a message, you agree to our [Terms] and [Privacy Policy]"
- Tracks user message count; after 3rd user message + AI response, disables input
- Shows "Secure Your Session" **Dialog overlay** with:
  - Built-in sign-up form (email + password fields) -- NOT a redirect to /auth
  - Calls `is_email_allowed` RPC, then `supabase.auth.signUp()`
  - On success: closes modal, transitions to authenticated mode:
    - Updates profile (onboarding complete, terms/privacy acknowledged)
    - Calls `start_paid_session` RPC with `_session_type: 'free'`
    - Increments `free_sessions_used`
    - Creates encrypted conversation with the guest messages
    - Starts the session timer
    - Chat continues seamlessly on the same page
  - "Not Now (Discard Session)" button clears sessionStorage and navigates to `/`
- Stores guest messages in `sessionStorage` (key: `guest_messages`)
- Calls the `chat` edge function with anon key (no auth needed for the AI call)

**`src/components/SecureSessionModal.tsx`**
The sign-up overlay component:
- Uses the existing Dialog component from the UI library
- Contains email + password inputs, "Create Account" button, and "Not Now" link
- Handles sign-up logic including the allowlist check
- Fires welcome email on successful sign-up
- Returns the new user to the parent component on success

### Modified Files

**`src/App.tsx`**
- Add two new route imports and routes:
  - `/try/guidance` -> `GuestGuidance`
  - `/try` -> `GuestChat`

**`src/pages/Index.tsx`**
- Add a CTA button (e.g. "Try a free reflection") that links to `/try/guidance`

### No Database Changes Required

The existing tables (profiles, sessions, credits, conversations) and RPC functions (`start_paid_session`, `is_email_allowed`, `handle_new_user`) already support everything needed. The `handle_new_user` trigger creates the profile and credits row on sign-up, and the guest migration code updates those rows immediately after.

### Edge Function

No changes needed to `supabase/functions/chat/index.ts` -- it already works without auth context. Guest calls will simply omit `pastConversations` and `userName`.

### Key Design Decisions

- **sessionStorage** (not localStorage) ensures guest data is discarded when the tab closes -- privacy-first
- **Inline sign-up modal** keeps the user on the chat page so the transition feels seamless
- After sign-up, the page transitions from "guest mode" to "authenticated mode" without any navigation -- the timer starts, messages are persisted, and the chat continues
- The guest guidance completion is only remembered in sessionStorage -- if they don't create an account, it's as if it never happened
