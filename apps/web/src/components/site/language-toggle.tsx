"use client";

import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--line)] bg-paper p-0.5 text-[0.75rem] font-medium",
        className,
      )}
      role="group"
      aria-label="Language / Wika"
    >
      <Languages size={13} className="ml-2 mr-1 text-ink-mute" aria-hidden />
      <button
        type="button"
        onClick={() => setLang("tl")}
        aria-pressed={lang === "tl"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          lang === "tl" ? "bg-moss text-paper" : "text-ink-soft hover:text-ink",
        )}
      >
        TL
      </button>
      <span className="text-ink-mute" aria-hidden>
        ·
      </span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          lang === "en" ? "bg-moss text-paper" : "text-ink-soft hover:text-ink",
        )}
      >
        EN
      </button>
    </div>
  );
}
