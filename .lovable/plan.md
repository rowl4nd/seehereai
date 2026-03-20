

## Plan: Integrate disclosure and signup into the chat flow

### Overview

Remove all disclosure modals and the signup popup. Replace with an in-chat conversational flow: 3 opening messages, name-ask after first user message, email collection at 5-message limit, and gentle close on refusal. All "Try for Free" buttons go directly to `/try`.

---

### 1. Remove DisclosureModal everywhere

**Files:** `src/components/DisclosureModal.tsx` (delete), `src/pages/Index.tsx`, `src/pages/Blog.tsx`, `src/pages/MentalClarity.tsx`, `src/pages/WorkStress.tsx`, `src/pages/SupportAlternative.tsx`, `src/pages/NHSWaitingList.tsx`, `src/pages/AffordableMentalHealth.tsx`, `src/pages/AIEmotionalSupport.tsx`, `src/pages/AnxietySupport.tsx`, `src/pages/TalkingToSomeone.tsx`, `src/pages/FounderStory.tsx`

- Remove all `DisclosureModal` imports, state, and rendering
- Remove `sh_disclosure_accepted` sessionStorage logic
- All "Try for Free" buttons navigate directly to `/try` (or `/dashboard` if logged in)
- Keep analytics: track `disclosure_accepted` implicitly when user sends first message in chat

**File:** `src/pages/Index.tsx` — simplify `handleTryForFree` to just `navigate(user ? "/dashboard" : "/try")`. Same for `handleHeroSubmit`.

---

### 2. Remove SecureSessionModal

**File:** `src/components/SecureSessionModal.tsx` — delete.

Remove import and usage from `GuestChat.tsx`.

---

### 3. Rewrite GuestChat opening messages

**File:** `src/pages/GuestChat.tsx`

Replace the single greeting with 3 sequential assistant messages on load:

1. **Welcome + disclosure:** "Welcome to SeeHere. I'm a warm, AI-powered listening companion — not a therapist. By continuing, you acknowledge our [Terms & Conditions](/terms) and [Privacy Policy](/privacy). If you're in immediate distress, please call 116 123 (Samaritans) or 999."
2. **Returning user nudge:** "Been here before? [Log in](/auth) to pick up where you left off."
3. **Opening invitation:** "When you're ready, what's been on your mind?"

Messages 1 and 2 will have special IDs (`welcome-disclosure`, `returning-user`) so they render with clickable links (using a small inline renderer for markdown-style links).

Track `disclosure_accepted` when the user sends their first message (replaces old modal tracking).

---

### 4. In-chat email collection at 5-message limit

**File:** `src/pages/GuestChat.tsx`

When `userMessageCount >= MAX_GUEST_MESSAGES` (after the AI responds to the 5th user message):

- Instead of showing `SecureSessionModal`, inject an assistant message: "You've shared some really meaningful things. I'd love for you to be able to come back and continue. If you'd like to save this conversation and unlock your 2nd free session, just type your email address below. If you'd prefer not to, that's completely okay — but I won't be able to save what we've talked about, and our conversation will end here."
- Set a new state `awaitingEmail: true`
- Track `signup_prompt_shown`

**Next user input handling (when `awaitingEmail` is true):**

- If input looks like an email (basic regex): 
  - Call `supabase.auth.signUp({ email, password: crypto.randomUUID() })` with auto-generated password (email-only signup)
  - On success: trigger welcome email (with password reset link so they can set their password), migrate guest data (same logic as current), continue chat
  - Track `account_created { method: "email_in_chat" }`
  - Inject assistant message: "Your session is saved. I've sent a welcome email to [email] — you can set your password there anytime. Let's keep going."
  - Set `authenticated = true`, continue session

- If input is refusal (not an email — e.g. "no", "no thanks", any non-email text):
  - Track `signup_modal_dismissed`
  - Inject assistant message: "I understand. Thank you for sharing with me today — what you said matters, even if it isn't saved. Take care of yourself." 
  - Disable input (`sessionEnded = true`)
  - Clean up sessionStorage

---

### 5. Welcome email with password creation link

**File:** `supabase/functions/send-welcome-email/index.ts`

Update the welcome email HTML to include a prominent "Set your password" button/link. This will be a standard password reset link generated via `supabase.auth.resetPasswordForEmail(email)` called server-side, or simply instruct the user to use the password reset flow from the login page.

Simpler approach: after signup, the edge function sends the existing welcome email but adds a "Set your password" CTA that links to `https://seehere.ai/auth` with a note to use "Forgot password" to create one. Or better: trigger a password reset email separately so they get two emails (welcome + set password).

**Recommended:** After the auto-signup, call `supabase.auth.resetPasswordForEmail(email)` from the client to send a password reset email. The welcome email stays as-is. User gets both.

---

### 6. Name-ask timing

**File:** `supabase/functions/chat/index.ts` — No changes needed. The system prompt's "Opening Exchanges" section already instructs the AI to ask for the user's name in the first 2-3 exchanges. Since the 3 opening messages are hardcoded (not from the AI), the AI's first actual response will be after the user's first message — that's when the name ask will naturally happen.

---

### 7. Analytics tracking preservation

| Old trigger | New trigger | Event name |
|---|---|---|
| Disclosure modal shown | (removed — disclosure is now message 1) | `disclosure_shown` → removed |
| Disclosure accepted | User sends first message | `disclosure_accepted` |
| Signup modal shown | Email prompt injected at 5 messages | `signup_prompt_shown` (was `signup_modal_shown`) |
| Signup modal dismissed | User types non-email refusal | `signup_modal_dismissed` |
| Account created | Email accepted in chat | `account_created` |

---

### 8. Link rendering in chat messages

**File:** `src/pages/GuestChat.tsx`

For the special welcome messages (IDs `welcome-disclosure` and `returning-user`), render content with basic link support. Use a small helper that converts `[text](/path)` markdown links to `<a>` tags, or use special message IDs to render custom JSX inline.

---

### Files changed summary

- **Delete:** `src/components/DisclosureModal.tsx`, `src/components/SecureSessionModal.tsx`
- **Major rewrite:** `src/pages/GuestChat.tsx`
- **Minor edits (remove modal):** `src/pages/Index.tsx`, `src/pages/Blog.tsx`, + 9 blog pages
- **Minor edit:** `supabase/functions/send-welcome-email/index.ts` (optional — add "set password" CTA)
- **Edge function config:** May need to enable auto-confirm for email signups so user can continue immediately

### Database change

- Need to enable auto-confirm for email signups via `cloud--configure_auth` so the email-only signup doesn't require email verification before the session can continue. The password reset email will serve as the verification step.

