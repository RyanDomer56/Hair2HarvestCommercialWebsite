"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type AvatarVariant = "sprout" | "ember" | "bloom";

type VConfig = {
  skin: string;
  hair: string;
  cheek: string;
  accessory: "leaf" | "flower" | "none";
};

// Three on-brand, earthy presets so the avatar can be "changed".
const VARIANTS: Record<AvatarVariant, VConfig> = {
  sprout: { skin: "#ecc6a0", hair: "#47552a", cheek: "#b06b3e", accessory: "leaf" },
  ember: { skin: "#e3b487", hair: "#b06b3e", cheek: "#a8522f", accessory: "none" },
  bloom: { skin: "#f0cda8", hair: "#9aa84e", cheek: "#cf8f6b", accessory: "flower" },
};

/**
 * A lightweight, fully local bitmoji-style avatar drawn in SVG.
 * Idle blink / glance / float + a talking mouth (driven by `talking`).
 * No external assets, no API — matches the Hair2Harvest earthy palette.
 */
export function AvatarCharacter({
  size = 56,
  variant = "sprout",
  talking = false,
  className,
}: {
  size?: number;
  variant?: AvatarVariant;
  talking?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const v = VARIANTS[variant];

  const blink = reduce
    ? {}
    : {
        animate: { scaleY: [1, 1, 0.08, 1] },
        transition: { duration: 5, repeat: Infinity, times: [0, 0.92, 0.95, 0.98], ease: "easeInOut" as const },
      };

  const glance = reduce
    ? {}
    : {
        animate: { x: [0, 1.6, -1.6, 0] },
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
      };

  const mouth = reduce
    ? {}
    : talking
      ? {
          animate: { scaleY: [0.35, 1, 0.5, 1, 0.35] },
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
        }
      : {
          animate: { scaleY: [0.32, 0.32, 0.44, 0.32] },
          transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <motion.div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
      animate={reduce ? undefined : { y: [0, -2.5, 0] }}
      transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`Assistant avatar (${variant})`}>
        {/* badge */}
        <circle cx="60" cy="60" r="56" fill="#2c3518" />
        <circle cx="60" cy="60" r="56" fill="none" stroke="#d9f26b" strokeOpacity="0.35" strokeWidth="2" />
        {/* ears */}
        <circle cx="26" cy="64" r="9" fill={v.skin} />
        <circle cx="94" cy="64" r="9" fill={v.skin} />
        {/* face */}
        <ellipse cx="60" cy="64" rx="38" ry="41" fill={v.skin} />
        {/* back hair */}
        <path d="M22,66 C20,30 100,30 98,66 C98,48 82,40 60,40 C38,40 22,48 22,66 Z" fill={v.hair} />
        {/* fringe over forehead */}
        <path d="M24,52 C28,38 50,32 60,32 C70,32 92,38 96,52 C90,42 76,40 60,40 C44,40 30,42 24,52 Z" fill={v.hair} />
        {/* cheeks */}
        <circle cx="42" cy="80" r="6" fill={v.cheek} opacity="0.32" />
        <circle cx="78" cy="80" r="6" fill={v.cheek} opacity="0.32" />
        {/* eyebrows */}
        <path d="M40,55 q8,-5 15,0" stroke={v.hair} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M65,55 q8,-5 15,0" stroke={v.hair} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* eyes (blink) */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" } as CSSProperties}
          {...blink}
        >
          <motion.g {...glance}>
            <circle cx="47" cy="63" r="9" fill="#ffffff" />
            <circle cx="73" cy="63" r="9" fill="#ffffff" />
            <circle cx="48" cy="64" r="4.4" fill="#242a12" />
            <circle cx="72" cy="64" r="4.4" fill="#242a12" />
            <circle cx="49.4" cy="62.6" r="1.4" fill="#ffffff" />
            <circle cx="73.4" cy="62.6" r="1.4" fill="#ffffff" />
          </motion.g>
        </motion.g>
        {/* nose */}
        <path d="M60,70 q-3,4 3,5" stroke="#00000022" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* mouth (talking) */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" } as CSSProperties}
          {...mouth}
        >
          <ellipse cx="60" cy="87" rx="11" ry="8" fill="#8a4b3a" />
          <ellipse cx="60" cy="91" rx="7" ry="3.4" fill="#d98f78" />
        </motion.g>
        {/* accessory */}
        {v.accessory === "leaf" && (
          <g transform="translate(86,26) rotate(20)">
            <path d="M0,0 C10,-10 22,-8 26,2 C16,12 4,12 0,0 Z" fill="#d9f26b" />
            <path d="M2,2 C10,-2 18,0 24,2" stroke="#47552a" strokeWidth="1.6" fill="none" />
          </g>
        )}
        {v.accessory === "flower" && (
          <g transform="translate(86,24)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-7" rx="4" ry="7" fill="#d9f26b" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="4" fill="#b06b3e" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
