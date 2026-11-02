import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  delta,
  deltaLabel,
  bars,
  footnote,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  bars?: { total: number; active: number; alert?: number };
  footnote?: string;
  tone?: "default" | "alert";
}) {
  return (
    <div className="app-card app-shadow flex flex-col p-5 transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,15,0.05),0_12px_28px_-20px_rgba(38,40,15,0.5)]">
      <div className="flex items-center gap-2">
        <Icon size={14} strokeWidth={1.9} className="text-[#9a9c74]" />
        <span className="text-[0.75rem] font-medium text-[#6b6d4c]">{label}</span>
      </div>

      <p className="mt-4 flex items-baseline gap-1">
        <span
          className={cn(
            "text-[1.875rem] font-semibold leading-none tracking-[-0.03em] tabular-nums",
            tone === "alert" ? "text-[#a6402a]" : "text-[#26280f]",
          )}
        >
          {value}
        </span>
        {suffix && (
          <span className="text-[0.8125rem] font-medium text-[#9a9c74]">{suffix}</span>
        )}
      </p>

      {delta !== undefined && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium",
              delta >= 0 ? "bg-[#eef7dd] text-[#4f7a1f]" : "bg-[#fbeee9] text-[#a6402a]",
            )}
          >
            {delta >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {delta >= 0 ? "+" : ""}
            {delta}
          </span>
          <span className="text-[0.6875rem] text-[#9a9c74]">{deltaLabel}</span>
        </div>
      )}

      {bars && (
        <div className="mt-3.5">
          <div className="flex gap-1">
            {Array.from({ length: bars.total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < bars.active
                    ? "bg-[#5b8c22]"
                    : i < bars.active + (bars.alert ?? 0)
                      ? "bg-[#c04a32]"
                      : "bg-[#eef0e2]",
                )}
              />
            ))}
          </div>
          {footnote && <p className="mt-2 text-[0.6875rem] text-[#9a9c74]">{footnote}</p>}
        </div>
      )}

      {!bars && footnote && (
        <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-[#9a9c74]">{footnote}</p>
      )}
    </div>
  );
}

const statusTones: Record<string, string> = {
  Enrolled: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Candidate: "border-[#dbe4bb] bg-[#f6f9e8] text-[#7a7f52]",
  Paused: "border-[#e8d5b8] bg-[#fdf4e6] text-[#a06a1f]",
  Withdrawn: "border-[#e6e6df] bg-[#f6f6f2] text-[#8a8c7e]",
  Scheduled: "border-[#d8e2f2] bg-[#eff4fc] text-[#3d5f96]",
  Collected: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Weighed: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Skipped: "border-[#e6e6df] bg-[#f6f6f2] text-[#8a8c7e]",
  Rescheduled: "border-[#e8d5b8] bg-[#fdf4e6] text-[#a06a1f]",
  Clean: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Minor: "border-[#e8d5b8] bg-[#fdf4e6] text-[#a06a1f]",
  Mixed: "border-[#efcabc] bg-[#fbeee9] text-[#a6402a]",
  Approved: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Curing: "border-[#dbe4bb] bg-[#f6f9e8] text-[#5d6432]",
  Composting: "border-[#dbe4bb] bg-[#f6f9e8] text-[#5d6432]",
  Preparing: "border-[#e6e6df] bg-[#f6f6f2] text-[#8a8c7e]",
  Sampling: "border-[#d8e2f2] bg-[#eff4fc] text-[#3d5f96]",
  Pass: "border-[#cfe0a8] bg-[#f0f7dd] text-[#4f7a1f]",
  Review: "border-[#e8d5b8] bg-[#fdf4e6] text-[#a06a1f]",
  Fail: "border-[#efcabc] bg-[#fbeee9] text-[#a6402a]",
};

export function StatusPill({ status, dot = true }: { status: string; dot?: boolean }) {
  const tone = statusTones[status] ?? "border-[#e6e6df] bg-[#f6f6f2] text-[#8a8c7e]";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium",
        tone,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {status}
    </span>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("app-card app-shadow overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef0e2] px-5 py-4">
        <div>
          <h2 className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-[#26280f]">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-[0.75rem] text-[#9a9c74]">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHead({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[1.375rem] font-semibold tracking-[-0.03em] text-[#26280f] sm:text-[1.5rem]">
          {title}
        </h1>
        <p className="mt-1 text-[0.8125rem] text-[#83855f]">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
