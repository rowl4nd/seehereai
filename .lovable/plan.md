

# Enhancing the AI Companion with CBT Techniques and Person-Centred Approaches

## What This Changes

Right now, the AI mostly reflects back what users say and asks open-ended questions. While this is supportive, it can feel repetitive. This update will allow the AI to also **gently suggest practical techniques** when appropriate -- things like breathing exercises, thought reframing, or sleep hygiene tips -- while staying true to its warm, non-clinical tone.

## What the AI Will Be Able to Do After This

- **Offer practical CBT-based techniques** when someone shares a specific struggle (e.g. sleep problems, anxiety spirals, negative self-talk)
- **Use person-centred principles** like unconditional positive regard, empathy, and respecting the user's autonomy
- **Balance reflection with action** -- still listen first, but follow up with gentle, optional suggestions
- **Frame techniques as invitations**, never prescriptions (e.g. "Some people find it helpful to..." rather than "You should...")

## Example Interactions

**Before (current behaviour):**
> User: "I can't sleep at night, my mind just races"
> AI: "That sounds really difficult. What feels heaviest about it right now?"

**After (with CBT techniques):**
> User: "I can't sleep at night, my mind just races"
> AI: "A racing mind at night can be exhausting. Something that helps some people is the 4-7-8 breathing technique -- breathe in for 4 seconds, hold for 7, and breathe out for 8. It can help calm the nervous system. Would you like to tell me more about what tends to keep you awake?"

## Technical Details

This is a single-file change to the backend chat function (`supabase/functions/chat/index.ts`). The system prompt will be updated to include:

### 1. Person-Centred Core Principles (added to Core Guidelines)
- Unconditional positive regard: accept the person without judgment
- Empathic understanding: reflect feelings accurately
- Congruence: be genuine and transparent
- Respect autonomy: never push -- always frame suggestions as optional invitations

### 2. New Section: Supportive Techniques (CBT-Informed)
A dedicated section teaching the AI when and how to offer techniques:

**When to offer techniques:**
- When someone describes a specific, recurring difficulty
- After first validating their feelings (reflect, then suggest)
- Only as gentle invitations, never instructions

**Technique categories to include:**
- **Sleep difficulties**: sleep hygiene tips, 4-7-8 breathing, body scan, stimulus control
- **Anxiety and worry**: grounding (5-4-3-2-1 senses), box breathing, worry time scheduling
- **Negative self-talk**: thought challenging ("What would you say to a friend?"), cognitive reframing
- **Overwhelm and stress**: breaking tasks down, prioritisation, progressive muscle relaxation
- **Low mood**: behavioural activation (small pleasurable activities), gratitude practice, routine building
- **Rumination**: mindful observation of thoughts, externalising ("naming the thought")

### 3. Updated Tone Examples
New examples showing the balance of reflection + technique suggestion, so the AI has concrete models to follow.

### 4. Important Boundaries
- Always frame as "some people find..." or "you might like to try..." -- never prescriptive
- Techniques are offered alongside empathic listening, not instead of it
- The AI still clearly states it is not a therapist if asked
- Crisis detection and safety guardrails remain unchanged and take priority over any technique suggestions

## What Stays the Same
- All safety guardrails and crisis detection (untouched)
- Session wrap-up mode behaviour
- Past conversation context handling
- The AI model, token limits, and temperature settings
- All frontend code -- no UI changes needed

