

## Fix: AI Voice Not Speaking Aloud

### The problem
The TTS backend function is never even being called (zero logs). The `playTTS` function in `useVoiceMode.ts` is invoked after the chat response returns, but by that point the browser's autoplay policy blocks the audio. Browsers require audio playback to be initiated from a direct user gesture -- since the TTS call happens after an async network request (the chat function), the gesture context is lost.

### The fix

**1. Pre-create Audio element during user gesture (`src/hooks/useVoiceMode.ts`)**

In the `playTTS` function, the `new Audio()` element is currently created after the fetch completes. Instead, create it immediately when `playTTS` is called (which still has gesture context from the voice commit flow), then set its `src` after fetching:

```typescript
const playTTS = useCallback(async (text: string) => {
  // Create Audio element IMMEDIATELY (preserves user gesture context)
  const audio = new Audio();
  audio.preload = "auto";
  audioRef.current = audio;

  try {
    // Stop any previously playing audio
    // ... cleanup old audioUrl ...

    const response = await fetch(/* TTS endpoint */);
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    audioUrlRef.current = audioUrl;

    // Set source on pre-existing element and play
    audio.src = audioUrl;
    audio.onended = () => { /* cleanup + onResponseComplete */ };
    await audio.play();  // Works because element was created in gesture context
  } catch (err) {
    console.error("TTS playback error:", err);
    onResponseComplete();
  }
}, [onResponseComplete]);
```

**2. Add error logging for easier debugging (`src/hooks/useVoiceMode.ts`)**

Add a `console.log` before the fetch call so we can confirm the function is actually being reached, and log the response status.

### Why this works
Browsers track whether an `Audio` element was created during a user-initiated event. By creating it synchronously when `playTTS` is first called (which chains from the VAD commit, which chains from the mic button tap), the browser treats it as gesture-initiated. The async fetch and `audio.play()` then work on that same element.

### Files changed
- `src/hooks/useVoiceMode.ts` -- restructure `playTTS` to create Audio element before the async fetch

### No other changes needed
- The edge function code is correct
- The Mirror.tsx integration is calling `playTTS` in the right place
- The `voiceModeEnabled` state is being set correctly

