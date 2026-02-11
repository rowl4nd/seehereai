

## Add TTS to Early-End Wrap-Up Message

### Current Behavior
- **5-minute warning responses**: Already work with voice. The warning tag is added to the user's message, and the AI response flows through the normal send path which includes the TTS call.
- **Early-end wrap-up**: Does NOT play through voice. It's handled in a separate code path (`handleEndSession`) that fetches the AI's wrap-up response but never calls `playTTS`.

### Fix

**File: `src/pages/Mirror.tsx`**

After the wrap-up message is created (around line 330-334), add a TTS call using the existing ref pattern:

```text
const wrapUpMessage = { ... content: response.data?.message ... };
setMessages(finalMessages);
saveMessagesToDb(finalMessages);

// NEW: Play wrap-up through voice if voice mode is active
if (voiceModeEnabledRef.current && playTTSRef.current) {
  playTTSRef.current(wrapUpMessage.content);
}
```

This is a small, single-location change. The 5-minute warning responses already work correctly with voice since they flow through the normal message-sending path.

### Files Changed
1. `src/pages/Mirror.tsx` -- add `playTTS` call after early-end wrap-up message
