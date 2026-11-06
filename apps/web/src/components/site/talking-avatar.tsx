"use client";

import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { AvatarCharacter, type AvatarVariant } from "./avatar-character";
import Avatar3D from "./avatar-3d";

export type TalkingAvatarHandle = { speak: (text: string) => void };

/**
 * Wraps AvatarCharacter and gives it a voice via the browser's free,
 * built-in Web Speech API (no key, no quota, works offline). The mouth is
 * animated while speaking. `muted` silences it; `talking` can also be driven
 * externally (e.g. while "thinking").
 */
export const TalkingAvatar = forwardRef<
  TalkingAvatarHandle,
  {
    size?: number;
    variant: AvatarVariant;
    muted?: boolean;
    talking?: boolean;
    modelSrc?: string;
    modelFallbackSrc?: string;
    faceMode?: boolean;
  }
>(({ size = 48, variant, muted = false, talking: controlledTalking, modelSrc, modelFallbackSrc, faceMode }, ref) => {
  const [speaking, setSpeaking] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const talking = controlledTalking ?? speaking;

  const speak = useCallback(
    (text: string) => {
      if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeaking(false);
        return;
      }
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
      const u = new SpeechSynthesisUtterance(text);
      try {
        const vs = window.speechSynthesis.getVoices();
        const pick =
          vs.find((v) => /en[-_]?US/i.test(v.lang)) ||
          vs.find((v) => /^en/i.test(v.lang)) ||
          vs[0];
        if (pick) u.voice = pick;
      } catch {
        /* noop */
      }
      u.rate = 1.02;
      u.pitch = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
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
        faceMode={faceMode}
        onError={() => {
          if (!useFallback && modelFallbackSrc) setUseFallback(true);
          else setModelFailed(true);
        }}
      />
    );
  }
  return <AvatarCharacter size={size} variant={variant} talking={talking} />;
});

TalkingAvatar.displayName = "TalkingAvatar";
