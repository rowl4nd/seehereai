# See Here — Implementation Plan

## ✅ Completed

### Phase 1: Foundation
- [x] **Warm Design System** - Cream, amber, peach color tokens in index.css
- [x] **Typography** - Cormorant Garamond (headings) + Nunito (body)
- [x] **Subtle Animations** - fade-in, fade-in-up utilities
- [x] **Custom Tailwind Config** - warm.* color tokens

### Phase 2: Database
- [x] **Profiles table** - user_id, onboarding flags, free_sessions_used
- [x] **Sessions table** - session tracking with start/end times
- [x] **Credits table** - credit balance per user  
- [x] **Credit Purchases table** - purchase history
- [x] **RLS Policies** - users only see their own data
- [x] **Helper Functions** - has_cooldown_passed, get_next_session_time
- [x] **Auto-creation Trigger** - profile + credits on user signup

### Phase 3: Frontend Pages
- [x] **Homepage** (/) - Serene welcome with warm border frame
- [x] **Auth** (/auth) - Email signup/login with gentle messaging
- [x] **Dashboard** (/dashboard) - Session/credit overview
- [x] **Onboarding** (/onboarding) - Terms & AI disclosure acknowledgement
- [x] **Guidance** (/guidance) - Timed pre-session cards (10s each)
- [x] **Mirror** (/mirror) - AI chat with visual timer
- [x] **Credits** (/credits) - Purchase options (Stripe placeholder)
- [x] **Cooldown** (/cooldown) - 12-hour rest screen

### Phase 4: Core Features
- [x] **Auth Hook** - useAuth with session management
- [x] **Profile Hook** - useProfile with update function
- [x] **Credits Hook** - useCredits balance fetching
- [x] **Sessions Hook** - useSessions with start/end, cooldown check
- [x] **Chat Edge Function** - Lovable AI with therapeutic prompt

---

## 🔲 Remaining (Stripe Integration)

### Phase 5: Payments
- [ ] Enable Stripe integration
- [ ] Create checkout session edge function
- [ ] Create Stripe webhook for credit granting
- [ ] Connect Credits page to Stripe checkout

---

## Architecture Notes

### Session Flow
1. User signs up → auto-creates profile + credits record
2. First visit → Onboarding (acknowledge terms/AI disclosure)
3. Start session → Guidance sequence (6 cards, 10s each)
4. Chat → Mirror with visual timer (25min free / 45min paid)
5. Session ends → Cooldown screen (12hr wait)

### Credit Logic
- 2 free sessions for new users
- Paid sessions consume 1 credit
- Credits never expire
- One session per calendar day (UTC)

### Design Tokens
- --background: warm cream (40 40% 97%)
- --primary: amber (32 80% 50%)
- --accent: peach (20 60% 85%)
- Serif headings, sans body text
