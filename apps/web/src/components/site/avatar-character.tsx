"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * "Snip" — the Hair2Harvest mascot: a friendly pair of barber's scissors.
 * Idle: a gentle open/close breathing motion + float. While `talking`, the
 * scissors snip faster and the whole badge gives a small pulse, so the avatar
 * visibly "speaks". No external assets, no API — pure SVG in the brand palette.
 *
 * This is the local fallback. When a 3D GLB is supplied
 * (e.g. /models/scissor-avatar.glb) the chat widget renders that instead; until
 * then Snip is drawn here so the assistant is always on-brand.
 */
export function AvatarScissor({
  size = 56,
  talking = false,
  className,
}: {
  size?: number;
  talking?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Pivot point of the scissors.
  const px = 60;
  const py = 58;

  const openClose = reduce
    ? {}
    : talking
      ? {
          animate: { rotate: [0, 16, 0, 14, 0] },
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
        }
      : {
          animate: { rotate: [0, 9, 0, 7, 0] },
          transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const },
        };

  const openCloseR = reduce
    ? {}
    : talking
      ? {
          animate: { rotate: [0, -16, 0, -14, 0] },
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
        }
      : {
          animate: { rotate: [0, -9, 0, -7, 0] },
          transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const },
        };

  const float = reduce
    ? {}
    : {
        animate: { y: [0, -2.5, 0] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
      };

  const pulse = reduce
    ? {}
    : talking
      ? {
          animate: { scale: [1, 1.04, 1] },
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
        }
      : {};

  return (
    <motion.div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
      {...pulse}
    >
      <motion.div style={{ width: size, height: size }} {...float}>
        <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Snip, the Hair2Harvest scissor mascot">
          {/* badge ring */}
          <circle cx="60" cy="60" r="56" fill="#2c3518" />
          <circle cx="60" cy="60" r="56" fill="none" stroke="#d9f26b" strokeOpacity="0.35" strokeWidth="2" />

          {/* top pivot screw */}
          <circle cx={px} cy={py} r="6.5" fill="#e8e2cf" />
          <circle cx={px} cy={py} r="3" fill="#2c3518" />

          {/* LEFT blade + handle (rotates around pivot) */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: `${px}px ${py}px` } as CSSProperties}
            {...openClose}
          >
            {/* blade pointing up-left */}
            <path
              d={`M ${px} ${py} L 36 18 Q 31 13 35 22 L 50 50 Z`}
              fill="#c9ccd1"
              stroke="#8b9099"
              strokeWidth="1.5"
            />
            {/* handle loop bottom-left */}
            <path
              d="M 50 50 C 40 66 30 78 38 92 C 46 104 64 102 62 86 C 61 76 56 64 50 50 Z"
              fill="none"
              stroke="#47552a"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </motion.g>

          {/* RIGHT blade + handle (mirror, rotates opposite) */}
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: `${px}px ${py}px` } as CSSProperties}
            {...openCloseR}
          >
            <path
              d={`M ${px} ${py} L 84 18 Q 89 13 85 22 L 70 50 Z`}
              fill="#aeb3bb"
              stroke="#8b9099"
              strokeWidth="1.5"
            />
            <path
              d="M 70 50 C 80 66 90 78 82 92 C 74 104 56 102 58 86 C 59 76 64 64 70 50 Z"
              fill="none"
              stroke="#b06b3e"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </motion.g>

          {/* friendly face on the pivot */}
          <g>
            <circle cx="54" cy="58" r="2.4" fill="#2c3518" />
            <circle cx="66" cy="58" r="2.4" fill="#2c3518" />
            <path
              d="M 53 64 Q 60 70 67 64"
              stroke="#2c3518"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* cheek blush */}
            <circle cx="48" cy="64" r="3" fill="#d98f78" opacity="0.4" />
            <circle cx="72" cy="64" r="3" fill="#d98f78" opacity="0.4" />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
