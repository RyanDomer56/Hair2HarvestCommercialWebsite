"use client";

import { Leaf, Sprout, Recycle, HeartHandshake, ShieldCheck, Clock3 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/**
 * The moving strip under the hero.
 *
 * It used to show internal codes (HB-001 · 3 sacks · 5.16 kg · CLEAN), which
 * meant nothing to a barbershop owner. It now shows plain reasons to join —
 * the same message in Tagalog or English — and stays animated.
 */
const messageKeys = [
  { key: "ticker.free", Icon: HeartHandshake },
  { key: "ticker.weCome", Icon: Clock3 },
  { key: "ticker.noWork", Icon: Leaf },
  { key: "ticker.compost", Icon: Recycle },
  { key: "ticker.garden", Icon: Sprout },
  { key: "ticker.checked", Icon: ShieldCheck },
] as const;

export function Ticker() {
  const { t } = useLanguage();
  const row = [...messageKeys, ...messageKeys];

  return (
    <div
      className="marquee relative overflow-hidden border-y border-[var(--line)] bg-[var(--paper-sunk)] py-3"
      aria-label={t("ticker.label")}
    >
      <div className="marquee-track">
        {row.map(({ key, Icon }, i) => (
          <span
            key={`${key}-${i}`}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap px-6"
          >
            <Icon size={14} strokeWidth={2} className="text-moss" aria-hidden />
            <span className="text-[0.8125rem] font-medium tracking-[-0.01em] text-ink-soft">
              {t(key)}
            </span>
            <span className="h-1 w-1 rounded-full bg-[var(--line-strong,var(--line))]" aria-hidden />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--paper-sunk)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--paper-sunk)] to-transparent" />
    </div>
  );
}
