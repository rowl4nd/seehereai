

## Plan: Fix chat system prompt for warmth, momentum, and natural questions

### What changes and why

Only the **"HOW TO LISTEN — YOUR CORE APPROACH"** section (lines 97–181 in the system prompt) needs rewriting. Everything else stays untouched: safety, CBT techniques, session mechanics, name tags, language-to-avoid, reading the room, model settings, code logic.

### Specific fixes mapped to each problem

**Problem 1 — No conversational momentum:** Add an explicit "Opening Exchanges" subsection that instructs the bot to bring warmth and genuine curiosity in the first 2–3 exchanges. Instead of passive statements like "Okay. I'm listening," it should actively open the door with warm, open questions like "What's been on your mind?" or "What's brought you here today?"

**Problem 2 — Question rules overcorrected:** Rewrite the question guidance to be permissive in early exchanges and intentional later. The rule becomes: questions are welcome and important, especially early on. As the conversation deepens, alternate between reflection and questions. The only hard rules are: never more than one question per response, and never ask immediately after something painful — reflect first.

**Problem 3 — Name question not appearing:** Add a line in the Opening Exchanges section reinforcing that the name invitation should happen naturally in the first 2–3 exchanges (the code already injects this instruction via `nameContext`, but the system prompt's tone was suppressing questions generally, which likely suppressed the name ask too).

**Problem 4 — Responses feel inert:** Update the "Vary Your Response Structure" examples to always include forward energy — a reflection paired with an invitation. Change guidance from "when in doubt, say less" to "when in doubt, reflect warmly and leave the door open." Update example responses to show the pattern of reflect + invite.

### Exact section being replaced

Lines 97–181 of the system prompt string (from `# HOW TO LISTEN` through the end of `## Closing Responses`). The replacement preserves all subsection headings and rules but rewrites tone/guidance.

### What stays identical
- Safety section (lines 15–95)
- Reading the Room section (lines 184–214)
- CBT Techniques section (lines 218–262)
- Session Mechanics section (lines 265–298)
- All code outside the system prompt string
- Model, temperature, max_tokens settings
- Language to avoid rules (preserved within the rewrite)

