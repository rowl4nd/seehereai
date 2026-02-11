

## Full Voice Conversation Mode for Mirror Sessions

### Overview
Add a voice conversation mode to the Mirror page where users can speak naturally and hear the AI respond with a warm, natural voice. This layers speech-to-text and text-to-speech on top of the existing chat infrastructure, preserving all current logic (crisis detection, session management, name detection, encrypted message storage).

### How it works

1. User taps a microphone button to start speaking
2. Their speech is transcribed to text (ElevenLabs Realtime STT)
3. The transcribed text is sent through the existing `chat` edge function (preserving all system prompt logic)
4. The AI's text response is converted to speech (ElevenLabs TTS) and played back
5. Both sides of the conversation still appear as text bubbles in the chat, so there's a visual record and messages are saved/encrypted as before

The user can toggle between voice mode and text mode at any time during the session.

### Architecture

```text
User speaks
   |
   v
ElevenLabs Realtime STT (via useScribe hook)
   |
   v
Transcribed text --> existing chat edge function --> AI text response
   |                                                       |
   v                                                       v
Displayed as user                              ElevenLabs TTS edge function
message bubble                                         |
                                                       v
                                              Audio played + displayed
                                              as assistant message bubble
```

### What gets built

**1. New edge function: `elevenlabs-scribe-token`**
- Generates a single-use token for realtime speech-to-text
- Calls `https://api.elevenlabs.io/v1/single-use-token/realtime_scribe`
- Uses the `ELEVENLABS_API_KEY` secret (already configured)

**2. New edge function: `elevenlabs-tts`**
- Converts AI response text to speech audio
- Calls `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
- Uses a warm, calm voice (e.g. "Laura" or "Lily" -- both have gentle, warm qualities that suit a listening companion)
- Returns audio as binary MP3

**3. Updated Mirror page (`src/pages/Mirror.tsx`)**
- Install `@elevenlabs/react` for the `useScribe` hook
- Add a microphone toggle button next to the Send button
- When voice mode is active:
  - The text input area shows a visual indicator (pulsing mic icon, live transcript preview)
  - When the user pauses speaking (VAD commit), the transcript is automatically sent as a message
  - After the AI responds, the response is played as audio via the TTS edge function
  - Messages still appear as text bubbles and are saved to the database as normal
- When voice mode is off: everything works exactly as it does today

**4. Voice indicator UI**
- Mic button with three states: off (default), listening (pulsing animation), processing (loading)
- Optional: small waveform or pulsing ring around the mic when actively listening
- The Send button is hidden when voice mode is active (messages send automatically on pause)

### Voice selection
Use "Lily" voice (`pFZP5JQG7iQjIQuC4Bku`) -- a gentle, warm female voice that suits the therapeutic companion tone. This can be changed later.

### Technical considerations
- Audio playback uses `fetch()` with `.blob()` for binary audio (not `supabase.functions.invoke` which corrupts binary data)
- The `useScribe` hook with `commitStrategy: "vad"` automatically detects pauses in speech
- Microphone permission is requested with a clear explanation before enabling voice mode
- Voice mode state is not persisted -- defaults to text mode on page load
- The existing message encryption, session timer, wrap-up logic, and crisis detection all continue to work unchanged since voice input is converted to text before hitting the chat function

### User experience flow
1. Session starts in text mode (as today)
2. User taps the mic icon next to the input area
3. Browser requests microphone permission (with explanation if first time)
4. Input area transforms to show "Listening..." with a visual indicator
5. User speaks naturally; live partial transcript appears
6. When user pauses, transcript is sent automatically
7. AI responds: text bubble appears AND audio plays simultaneously
8. User can tap mic icon again to return to text mode at any time
