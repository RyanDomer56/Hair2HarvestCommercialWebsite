"use client";

import { useMemo, useState } from "react";
import { AreaChart } from "@/components/site/area-chart";
import { cn } from "@/lib/utils";

type Point = { label: string; value: number; month: string };

export function CollectionChart({ data }: { data: Point[] }) {
  const months = useMemo(() => {
    const seen: string[] = [];
    for (const d of data) if (!seen.includes(d.month)) seen.push(d.month);
    return seen;
  }, [data]);

  const [active, setActive] = useState<string>("All");
  const filtered = active === "All" ? data : data.filter((d) => d.month === active);

  return (
    <div className="card-print p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="mono-tag uppercase text-ink-mute">Net kilograms per week</p>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-moss" aria-hidden />
          <span className="mono-tag text-ink-mute">COLLECTED</span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter the chart by month">
        {["All", ...months].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setActive(m)}
            aria-pressed={active === m}
            title={m === "All" ? "Show every week of 2025" : `Show only ${m} 2025`}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-colors",
              active === m
                ? "border-moss bg-moss/10 text-moss"
                : "border-[var(--line)] text-ink-mute hover:text-ink",
            )}
          >
            {m === "All" ? "All 2025" : m}
          </button>
        ))}
      </div>

      <AreaChart
        data={filtered.map((d) => ({ label: d.label, value: d.value }))}
        height={260}
        className="mt-6"
      />
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--line)] pt-5">
        <div>
          <p className="num text-[1.5rem] font-semibold text-ink">62<span className="ml-1 text-[0.6875rem] font-normal text-ink-mute">%</span></p>
          <p className="mt-1 text-[0.75rem] text-ink-mute">Clean</p>
          <p className="text-[0.75rem] leading-snug text-ink-soft">of 41 pickups</p>
        </div>
        <div>
          <p className="num text-[1.5rem] font-semibold text-ink">27<span className="ml-1 text-[0.6875rem] font-normal text-ink-mute">%</span></p>
          <p className="mt-1 text-[0.75rem] text-ink-mute">Minor</p>
          <p className="text-[0.75rem] leading-snug text-ink-soft">batched with a note</p>
        </div>
        <div>
          <p className="num text-[1.5rem] font-semibold text-ink">11<span className="ml-1 text-[0.6875rem] font-normal text-ink-mute">%</span></p>
          <p className="mt-1 text-[0.75rem] text-ink-mute">Mixed</p>
          <p className="text-[0.75rem] leading-snug text-ink-soft">held, never batched</p>
        </div>
      </div>
    </div>
  );
}
