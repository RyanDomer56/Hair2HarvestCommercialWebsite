"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { shops, type ShopStatus } from "@/lib/data";
import { getShops } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Pill } from "./ui-bits";

const filters: Array<{ key: "All" | ShopStatus; label: string }> = [
  { key: "All", label: "All shops" },
  { key: "Enrolled", label: "Enrolled" },
  { key: "Candidate", label: "Candidate" },
  { key: "Paused", label: "Paused" },
  { key: "Withdrawn", label: "Withdrawn" },
];

export function ShopDirectory() {
  const [status, setStatus] = useState<"All" | ShopStatus>("All");
  const [q, setQ] = useState("");
  const [records, setRecords] = useState(shops);
  const [source, setSource] = useState<"mongodb" | "fixtures" | "fixtures-fallback">("fixtures");

  useEffect(() => {
    const ctrl = new AbortController();
    getShops(shops, ctrl.signal).then(({ data, source: from }) => {
      if (!ctrl.signal.aborted) {
        setRecords(data);
        setSource(from);
      }
    });
    return () => ctrl.abort();
  }, []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return records.filter((s) => {
      const statusOk = status === "All" || s.status === status;
      const qOk =
        !needle ||
        s.name.toLowerCase().includes(needle) ||
        s.code.toLowerCase().includes(needle) ||
        s.barangay.toLowerCase().includes(needle);
      return statusOk && qOk;
    });
  }, [status, q, records]);

  return (
    <div className="card-print overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => {
            const count =
              f.key === "All" ? records.length : records.filter((s) => s.status === f.key).length;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatus(f.key)}
                aria-pressed={status === f.key}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[0.75rem] font-medium transition-colors",
                  status === f.key
                    ? "bg-moss text-paper-raised"
                    : "text-ink-soft hover:bg-[var(--paper-sunk)] hover:text-ink",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "mono-tag ml-1.5",
                    status === f.key ? "text-paper/55" : "text-ink-mute",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-ink-mute" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shop, code or barangay"
            className="h-9 w-full rounded-full border border-[var(--line)] bg-paper-raised pl-9 pr-3 text-[0.8125rem] text-ink outline-none transition-colors placeholder:text-ink-mute/70 focus:border-moss sm:w-[260px]"
          />
        </label>
      </div>

      <div className="hidden grid-cols-[76px_1.3fr_1fr_1.1fr_96px_80px] gap-4 border-b border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-2.5 lg:grid">
        {["Code", "Shop", "Barangay", "Pickup rule", "Status", "Net kg"].map((h, i) => (
          <span
            key={h}
            className={cn("mono-tag uppercase text-ink-mute", i === 5 && "text-right")}
          >
            {h}
          </span>
        ))}
      </div>

      <ul>
        {rows.map((s) => (
          <li
            key={s.code}
            className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)] lg:grid-cols-[76px_1.3fr_1fr_1.1fr_96px_80px] lg:items-center lg:gap-y-0"
          >
            <span className="mono-tag order-2 text-clay lg:order-none">{s.code}</span>
            <div className="order-1 lg:order-none">
              <p className="text-[0.875rem] font-medium text-ink">{s.name}</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-mute">
                {s.contact} · {s.channel}
              </p>
            </div>
            <span className="order-4 text-[0.75rem] text-ink-soft lg:order-none">
              {s.barangay}
            </span>
            <div className="order-5 text-[0.75rem] text-ink-soft lg:order-none">
              {s.status === "Candidate" ? (
                <>
                  <p>Awaiting first visit</p>
                  <p className="mt-0.5 text-ink-mute">Rule set on site</p>
                </>
              ) : (
                <>
                  <p>
                    {s.days.join(" & ")} · {s.frequency}
                  </p>
                  <p className="mt-0.5 text-ink-mute">{s.window}</p>
                </>
              )}
            </div>
            <span className="order-3 lg:order-none">
              <Pill
                tone={
                  s.status === "Enrolled"
                    ? "moss"
                    : s.status === "Candidate"
                      ? "lime"
                      : s.status === "Paused"
                        ? "clay"
                        : "mute"
                }
              >
                {s.status}
              </Pill>
            </span>
            <span className="num order-6 hidden text-right text-[0.8125rem] text-ink lg:block">
              {s.totalKg.toFixed(1)}
            </span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="px-5 py-10 text-center text-[0.875rem] text-ink-mute">
            No shops match that filter.
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
        <span className="mono-tag text-ink-mute">
          {rows.length} OF {records.length} RECORDS
        </span>
        <span className="mono-tag text-moss">
          {records.filter((s) => s.inPilotArea).length} INSIDE PILOT BARANGAY
        </span>
      </div>
    </div>
  );
}
