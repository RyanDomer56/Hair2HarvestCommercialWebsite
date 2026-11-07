"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export function SectionHead({
  index,
  label,
  title,
  lede,
  align = "left",
  className,
  tone = "ink",
}: {
  index?: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className={cn("mono-tag", tone === "ink" ? "text-clay" : "text-lime")}>{index}</span>
        )}
        <span className={cn("h-px w-6", tone === "ink" ? "bg-[var(--line)]" : "bg-paper/25")} />
        <span
          className={cn(
            "eyebrow",
            tone === "ink" ? "text-ink-mute" : "text-paper/55",
          )}
        >
          {label}
        </span>
      </div>
      <h2
        className={cn(
          "display mt-5 text-[clamp(1.75rem,3.7vw,3.05rem)]",
          align === "center" && "max-w-[24ch]",
          tone === "ink" ? "text-ink" : "text-paper",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-5 max-w-[52ch] text-[0.9375rem] leading-[1.7]",
            tone === "ink" ? "text-ink-soft" : "text-paper/65",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

export function Stat({
  value,
  unit,
  label,
  note,
  tone = "ink",
}: {
  value: string;
  unit?: string;
  label: string;
  note?: string;
  tone?: "ink" | "paper" | "lime";
}) {
  return (
    <div>
      <p
        className={cn(
          "num flex items-baseline gap-1.5 font-display font-semibold text-[clamp(2rem,3.4vw,3rem)] leading-none",
          tone === "ink" && "text-ink",
          tone === "paper" && "text-paper",
          tone === "lime" && "text-lime",
        )}
      >
        {value}
        {unit && (
          <span
            className={cn(
              "font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em]",
              tone === "ink" ? "text-ink-mute" : "text-paper/50",
            )}
          >
            {unit}
          </span>
        )}
      </p>
      <p
        className={cn(
          "mt-3 text-[0.8125rem] font-medium",
          tone === "ink" ? "text-ink" : "text-paper/85",
        )}
      >
        {label}
      </p>
      {note && (
        <p
          className={cn(
            "mt-1 text-[0.75rem] leading-snug",
            tone === "ink" ? "text-ink-mute" : "text-paper/45",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export function SpecRow({
  label,
  value,
  hint,
  tone = "ink",
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto] items-baseline gap-4 border-b py-3.5 last:border-b-0",
        tone === "ink" ? "border-[var(--line)]" : "border-paper/12",
      )}
    >
      <div>
        <p
          className={cn(
            "mono-tag uppercase",
            tone === "ink" ? "text-ink-mute" : "text-paper/60",
          )}
        >
          {label}
        </p>
        {hint && (
          <p
            className={cn(
              "mt-1 text-[0.75rem] leading-snug",
              tone === "ink" ? "text-ink-mute/80" : "text-paper/45",
            )}
          >
            {hint}
          </p>
        )}
      </div>
      <p
        className={cn(
          "num text-right text-[0.875rem] font-medium",
          tone === "ink" ? "text-ink" : "text-paper/90",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function Pill({
  children,
  tone = "moss",
}: {
  children: React.ReactNode;
  tone?: "moss" | "clay" | "rust" | "mute" | "lime";
}) {
  const tones: Record<string, string> = {
    moss: "border-moss/25 bg-moss/8 text-moss",
    clay: "border-clay/30 bg-clay/10 text-clay",
    rust: "border-rust/30 bg-rust/10 text-rust",
    mute: "border-[var(--line)] bg-[color-mix(in_oklab,var(--ink)_4%,transparent)] text-ink-mute",
    lime: "border-moss/20 bg-lime/45 text-moss-deep",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusLegend({ className }: { className?: string }) {
  const { t } = useLanguage();
  const items: Array<{ tone: "moss" | "lime" | "clay" | "mute"; labelKey: string }> = [
    { tone: "moss", labelKey: "status.Enrolled" },
    { tone: "lime", labelKey: "status.Candidate" },
    { tone: "clay", labelKey: "status.Paused" },
    { tone: "mute", labelKey: "status.Withdrawn" },
  ];
  return (
    <div
      className={cn(
        "grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((it) => (
        <div key={it.labelKey} className="group bg-paper p-4" title={t(`${it.labelKey}.def`)}>
          <Pill tone={it.tone}>{t(it.labelKey)}</Pill>
          <p className="mt-2 text-[0.75rem] leading-snug text-ink-soft">{t(`${it.labelKey}.def`)}</p>
        </div>
      ))}
    </div>
  );
}
