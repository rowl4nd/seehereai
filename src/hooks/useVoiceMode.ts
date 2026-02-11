import { useState, useCallback, useRef } from "react";
import { useScribe } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";

type VoiceState = "off" | "listening" | "processing";

interface UseVoiceModeOptions {
  onTranscriptCommit: (text: string) => void;
  enabled: boolean;
}

export function useVoiceMode({ onTranscriptCommit, enabled }: UseVoiceModeOptions) {
  const [voiceState, setVoiceState] = useState<VoiceState>("off");
  const [partialText, setPartialText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: "vad" as unknown as import("@elevenlabs/react").CommitStrategy,
    onPartialTranscript: (data) => {
      setPartialText(data.text);
    },
    onCommittedTranscript: (data) => {
      if (data.text.trim()) {
        setVoiceState("processing");
        setPartialText("");
        onTranscriptCommit(data.text.trim());
      }
    },
  });

  const startListening = useCallback(async () => {
    try {
      // Request mic permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get scribe token
      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");
      if (error || !data?.token) {
        throw new Error("Failed to get speech-to-text token");
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setVoiceState("listening");
    } catch (err) {
      console.error("Failed to start voice mode:", err);
      setVoiceState("off");
      throw err;
    }
  }, [scribe]);

  const stopListening = useCallback(() => {
    scribe.disconnect();
    setVoiceState("off");
    setPartialText("");
  }, [scribe]);

  const toggleVoice = useCallback(async () => {
    if (voiceState === "off") {
      await startListening();
    } else {
      stopListening();
    }
  }, [voiceState, startListening, stopListening]);

  // Called after AI responds — set back to listening
  const onResponseComplete = useCallback(() => {
    if (enabled && voiceState === "processing") {
      setVoiceState("listening");
    }
  }, [enabled, voiceState]);

  const playTTS = useCallback(async (text: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      // Use fetch() for binary audio (not supabase.functions.invoke)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        audioUrlRef.current = null;
        onResponseComplete();
      };

      await audio.play();
    } catch (err) {
      console.error("TTS playback error:", err);
      onResponseComplete();
    }
  }, [onResponseComplete]);

  const cleanup = useCallback(() => {
    if (scribe.isConnected) {
      scribe.disconnect();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, [scribe]);

  return {
    voiceState,
    setVoiceState,
    partialText,
    toggleVoice,
    playTTS,
    cleanup,
    isVoiceActive: voiceState !== "off",
  };
}
