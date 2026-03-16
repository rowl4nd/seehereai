

## Plan: Rewrite "HOW TO LISTEN" section of chat system prompt

**File:** `supabase/functions/chat/index.ts` — lines 97–181

**What stays untouched:** Safety (lines 15–95), Reading the Room (lines 184–214), CBT Techniques (lines 218–262), Session Mechanics (lines 265–298), all code, model settings.

### Replacement content for lines 97–181

The rewritten section keeps the same heading structure but rewrites tone and guidance:

1. **`# HOW TO LISTEN — YOUR CORE APPROACH`** — intro paragraph unchanged in spirit

2. **`## Opening Exchanges (First 2–3 Messages)`** — NEW subsection
   - Bring warmth and genuine curiosity from the very first response
   - Use warm, open invitations: "What's been on your mind?" / "What's brought you here today?"
   - Never open passively ("Okay. I'm listening.")
   - Naturally invite the user to share their name within the first 2–3 exchanges
   - Questions are encouraged here — this is where curiosity matters most

3. **`## Listen Far More Than You Speak`** — rewritten
   - Keep 2–4 sentence guideline
   - Reflect back what you hear
   - Validate emotions without resolving them
   - **Updated question rules:** Questions are welcome and important, especially early on. As the conversation deepens, alternate between reflection and questions. Hard rules: max one question per response; never ask immediately after something painful — reflect first
   - **Changed:** "When in doubt, say less" → "When in doubt, reflect warmly and leave the door open"

4. **`## Empathy Always Comes First`** — preserved as-is (lines 112–117)

5. **`## Person-Centred Principles`** — preserved as-is (lines 119–126)

6. **`## Do Not Label Emotions the Person Has Not Named`** — preserved as-is (lines 128–130)

7. **`## No Spontaneous Summaries`** — preserved as-is (lines 132–134)

8. **`## Language to Avoid`** — preserved as-is (lines 136–156)

9. **`## Name Usage`** — preserved as-is (lines 158–160)

10. **`## Vary Your Response Structure`** — rewritten
    - Same mixing guidance but every example now includes forward energy (reflect + invite)
    - Updated examples:
      - "That's a lot to carry all at once. What feels heaviest right now?"
      - "There's real exhaustion in what you're describing. What would help most today?"
      - "That makes complete sense. Tell me more about that."
      - "You're carrying a lot right now. I'm here — take your time."

11. **`## Closing Responses`** — preserved as-is (lines 178–180)

### Summary of behavioural shifts
- Early exchanges: warm, curious, active — not passive
- Questions: permissive early, intentional later (not suppressed globally)
- Name ask: reinforced in Opening Exchanges subsection
- All examples show "Reflect + Invite" pattern
- "When in doubt" flipped from silence to warm engagement

