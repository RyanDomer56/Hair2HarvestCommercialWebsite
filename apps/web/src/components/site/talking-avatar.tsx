"use client";

import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Avatar3D, { type AvatarDance } from "./avatar-3d";
import { AvatarScissor } from "./avatar-character";

// Voices populate asynchronously on some browsers, so cache them and refresh
// when they load. This lets us reliably pick a male English voice for Snip.
let cachedVoices: SpeechSynthesisVoice[] = [];
function refreshVoices() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

export type TalkingAvatarHandle = {
  speak: (text: string, onEnd?: () => void) => void;
};

/**
 * Wraps the 3D scissor avatar (an OBJ you supply, e.g. /models/ScissorAvatarH2H.obj)
 * and gives it a voice via the browser's free, built-in Web Speech API (no key,
 * no quota, works offline). The 3D model dances while "talking" and can be told
 * which dance to perform via the `dance` prop; if the OBJ can't load it falls
 * back to "Snip", the SVG scissor mascot. `muted` silences the voice.
 */
export const TalkingAvatar = forwardRef<
  TalkingAvatarHandle,
  {
    size?: number;
    muted?: boolean;
    talking?: boolean;
    dance?: AvatarDance;
    modelSrc?: string;
    modelFallbackSrc?: string;
    faceMode?: boolean;
  }
>(({ size = 48, muted = false, talking: controlledTalking, dance = "idle", modelSrc, modelFallbackSrc, faceMode }, ref) => {
  const [speaking, setSpeaking] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const talking = controlledTalking ?? speaking;

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeaking(false);
        onEnd?.();
        return;
      }
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
      const u = new SpeechSynthesisUtterance(text);
      try {
        const vs = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
        // Prefer a male English voice; fall back to any English, then default.
        const pick =
          vs.find((v) => /male/i.test(v.name) && /^en/i.test(v.lang)) ||
          vs.find((v) => /male/i.test(v.name)) ||
          vs.find((v) => /en[-_]?US/i.test(v.lang)) ||
          vs.find((v) => /^en/i.test(v.lang)) ||
          vs[0];
        if (pick) u.voice = pick;
      } catch {
        /* noop */
      }
      u.rate = 1.02;
      u.pitch = 0.9;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        onEnd?.();
      };
      u.onerror = () => {
        setSpeaking(false);
        onEnd?.();
      };
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    },
    [muted],
  );

  useImperativeHandle(ref, () => ({ speak }), [speak]);

  const activeSrc = useFallback && modelFallbackSrc ? modelFallbackSrc : modelSrc;

  if (activeSrc && !modelFailed) {
    return (
      <Avatar3D
        src={activeSrc}
        size={size}
        talking={talking}
        dance={dance}
        faceMode={faceMode}
        onError={() => {
          if (!useFallback && modelFallbackSrc) setUseFallback(true);
          else setModelFailed(true);
        }}
      />
    );
  }
  return <AvatarScissor size={size} talking={talking} />;
});

TalkingAvatar.displayName = "TalkingAvatar";
