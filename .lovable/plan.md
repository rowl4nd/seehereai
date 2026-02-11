

## Fix: AI Voice Responses Not Playing

### Root Cause

The TTS backend function works correctly (confirmed by testing it directly -- it returns valid MP3 audio). The problem is entirely on the client side, with **two bugs**:

**Bug 1 - Stale closure (main issue):**
In `Mirror.tsx`, `sendMessageFromVoice` (line 453) references `voiceMode.playTTS` (line 509), but the `voiceMode` hook is defined *after* `sendMessageFromVoice` (line 535). Since `voiceMode` is not in the dependency array of `sendMessageFromVoice`, the callback captures a stale/undefined reference. This means `voiceMode.playTTS()` either calls an old version or fails silently.

**Bug 2 - Audio unlock timing:**
The `unlockAudio()` function is called inside `startListening()`, but this happens during an `async` function after `await navigator.mediaDevices.getUserMedia()`. Some browsers may have already lost the gesture context by then.

### ElevenLabs Configuration
No changes needed on the ElevenLabs side. The API key is working, the TTS endpoint returns valid audio.

### Fix Details

**1. Mirror.tsx - Fix stale closure by using a ref for playTTS**

- Move `voiceMode` hook declaration **before** `sendMessageFromVoice`, OR
- Use a ref (`voiceModeRef`) to always have the latest `voiceMode` reference available inside the callback
- The simplest fix: use a ref pattern for `voiceModeEnabled` and `playTTS` so the callback always sees current values

```text
Before (broken):
  sendMessageFromVoice (line 453) -- references voiceMode.playTTS
  voiceMode hook (line 535)       -- defined AFTER the callback
  voiceMode NOT in dependency array

After (fixed):
  voiceModeEnabledRef -- always has latest value
  playTTSRef          -- always has latest playTTS function
  sendMessageFromVoice reads from refs, not stale closure
```

**2. useVoiceMode.ts - Move unlockAudio() to run synchronously**

- Call `unlockAudio()` before the `await getUserMedia()` call so it runs while still in the direct gesture context
- This is already done in the current code but worth confirming the order is correct

### Files Changed

1. `src/pages/Mirror.tsx` -- fix stale closure by using refs for voice mode state and playTTS function
2. `src/hooks/useVoiceMode.ts` -- minor: add more debug logging to confirm playTTS is reached

### No ElevenLabs changes needed
The API key, voice ID, and edge function are all working correctly. This is purely a React closure bug.

