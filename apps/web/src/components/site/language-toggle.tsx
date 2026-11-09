"use client";

import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: { code: "tg" | "en" | "tl"; label: string }[] = [
  { code: "tg", label: "Taglish" },
  { code: "en", label: "English" },
  { code: "tl", label: "Tagalog" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--line)] bg-paper p-0.5 text-[0.7rem] font-medium",
        className,
      )}
      role="group"
      aria-label="Language / Wika / Taglish"
    >
      <Languages size={13} className="ml-2 mr-1 text-ink-mute" aria-hidden />
      {OPTIONS.map((opt, i) => (
        <span key={opt.code} className="inline-flex items-center">
          {i > 0 && (
            <span className="text-ink-mute" aria-hidden>
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(opt.code)}
            aria-pressed={lang === opt.code}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              lang === opt.code ? "bg-moss text-paper" : "text-ink-soft hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}
