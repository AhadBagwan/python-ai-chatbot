import toast from "react-hot-toast";

/**
 * Clean markdown formatting symbols for natural sounding speech synthesis.
 */
export function cleanTextForSpeech(markdownText) {
  if (!markdownText) return "";
  return markdownText
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, " Code snippet omitted. ")
    // Remove inline code ticks
    .replace(/`([^`]+)`/g, "$1")
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove headers (# ## ###)
    .replace(/#{1,6}\s+/g, "")
    // Remove bold/italic (* _ **)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove bullet points / blockquotes
    .replace(/^\s*[-*+>]\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Normalize spaces
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Perform Text-to-Speech playback with safe browser state reset.
 */
export function speakText(text, selectedVoiceURI, onEnd, onError) {
  if (!("speechSynthesis" in window)) {
    toast.error("Text-to-speech is not supported in this browser.");
    return false;
  }

  try {
    // Force cancel any ongoing or frozen speech engine queue
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const clean = cleanTextForSpeech(text);
    if (!clean) {
      toast.error("No readable text available to speak.");
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Load available voices
    const voices = window.speechSynthesis.getVoices();
    if (selectedVoiceURI && voices.length > 0) {
      const match = voices.find(v => v.voiceURI === selectedVoiceURI || v.name === selectedVoiceURI);
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      if (onError) onError(e);
    };

    // Trigger synthesis
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("TTS execution error:", err);
    toast.error("Failed to play audio response.");
    return false;
  }
}

/**
 * Stop any current speech playback.
 */
export function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
