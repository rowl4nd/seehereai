

# See Here — Full MVP Plan

## Vision
A warm, psychologically-informed AI listening companion. Users know they're speaking with an AI, and the experience prioritizes calm, reflection, and ethical boundaries.

---

## 1. Homepage
**A serene welcome**
- Centered "See Here" title with soft typography
- Subtitle: *"A psychologically informed listening ear"*
- Subtle warm border framing the page
- Cozy background (soft gradient or warm abstract imagery)
- Single "Log in" link in top-right header
- Gentle fade-in animation on load

---

## 2. Authentication Flow
**Email-based signup with intentional onboarding**
- Email + password signup/login
- First-time users must acknowledge:
  - Terms & Conditions
  - AI Disclosure (clearly stating this is an AI)
  - Usage rules
- Returns users go straight to their dashboard

---

## 3. Reflective Guidance Sequence
**A timed, mindful onboarding before each session**
- Appears before accessing the chat
- Center-screen cards with calming messages
- First card: *"Some important notes before we begin"*
- Each card displays for 10 seconds, fading between
- 5-7 guidance cards covering: AI nature, privacy, session limits, pacing
- Final button: *"Continue to the Reflective Mirror"*

---

## 4. The Mirror (Chat Experience)
**Warm, conversational AI chat**
- Modern messaging-style interface
- Rounded chat bubbles (user right, AI left)
- Soft, cozy color palette (cream, warm whites, gentle amber accents)
- AI responses are bite-sized and reflective, never clinical
- Subtle fade-in for new messages
- Markdown support for formatted responses
- Connected to the existing AI chatbot or Lovable AI

---

## 5. Session Timer
**Mindful, non-stressful time awareness**
- Visual timer without numbers (subtle progress indicator)
- Free sessions: 25 minutes
- Paid sessions: 45 minutes
- Session ends automatically when time expires
- Gentle warning as session nears end

---

## 6. Cool-Down System
**12-hour mandatory rest period**
- After any session ends, 12-hour wait required
- Beautiful "rest" screen during cool-down
- Shows when next session is available
- Calm messaging: *"Give yourself time to reflect..."*
- Cannot be bypassed with credits

---

## 7. Credit System & Dashboard
**Simple credit management**
- Users get 2 free sessions total
- After free sessions, purchase credits to continue
- User dashboard showing:
  - Credit balance
  - Sessions used
  - Next available session time
  - Purchase options

---

## 8. Payment Integration (Stripe)
**Secure credit purchases**
- Pricing tiers:
  - 1 session — £5
  - 4 sessions — £12 (40% off)
  - 8 sessions — £20 (50% off)
  - 16 sessions — £32 (60% off)
- Server-side credit granting via Stripe webhooks
- Credits never expire

---

## 9. Database (Lovable Cloud)
**Secure user data management**
- Users table (email, auth)
- Sessions table (timestamps, duration, type)
- Credits table (balance, purchase history)
- Last session end time (for cool-down calculation)
- Row-level security ensuring users only see their own data

---

## 10. End-of-Session Flows
**Thoughtful session conclusions**
- Gentle message when session ends
- Progress saved automatically
- After 2nd free session: invitation to purchase credits
- Cool-down timer begins

---

## Design Language
- **Colors**: Cream, soft white, warm amber, gentle peach accents
- **Typography**: Soft, readable serif or rounded sans-serif
- **Animations**: Very subtle fades and transitions only
- **Tone**: Calm, warm, transparent, non-judgemental
- **Phrases**: "When you're ready", "Take your time", "You're in control"

