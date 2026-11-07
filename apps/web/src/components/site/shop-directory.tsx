"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { shops, type ShopStatus } from "@/lib/data";
import { getShops } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Pill, StatusLegend } from "./ui-bits";
import { useLanguage } from "@/lib/i18n";

const filters: Array<{ key: "All" | ShopStatus; labelKey: string; descKey: string }> = [
  { key: "All", labelKey: "network.directory.allShops", descKey: "network.directory.allShopsDesc" },
  { key: "Enrolled", labelKey: "status.Enrolled", descKey: "network.directory.enrolledDesc" },
  { key: "Candidate", labelKey: "status.Candidate", descKey: "network.directory.candidateDesc" },
  { key: "Paused", labelKey: "status.Paused", descKey: "network.directory.pausedDesc" },
  { key: "Withdrawn", labelKey: "status.Withdrawn", descKey: "network.directory.withdrawnDesc" },
];

export function ShopDirectory() {
  const { t } = useLanguage();
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
    <div>
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
                  title={t(f.descKey)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[0.75rem] font-medium transition-colors",
                    status === f.key
                      ? "bg-moss text-paper-raised"
                      : "text-ink-soft hover:bg-[var(--paper-sunk)] hover:text-ink",
                  )}
                >
                  {t(f.labelKey)}
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
              placeholder={t("network.directory.search")}
              className="h-9 w-full rounded-full border border-[var(--line)] bg-paper-raised pl-9 pr-3 text-[0.8125rem] text-ink outline-none transition-colors placeholder:text-ink-mute/70 focus:border-moss sm:w-[260px]"
            />
          </label>
        </div>

        <div className="hidden grid-cols-[1fr_1fr_96px] gap-4 border-b border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-2.5 sm:grid">
          {[t("network.directory.header.shop"), t("network.directory.header.barangay"), t("network.directory.header.status")].map((h, i) => (
            <span
              key={h}
              className={cn("mono-tag uppercase text-ink-mute", i === 2 && "text-right")}
            >
              {h}
            </span>
          ))}
        </div>

        <ul>
          {rows.map((s) => (
            <li
              key={s.code}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-[var(--line)] px-5 py-4 transition-colors last:border-b-0 hover:bg-[var(--paper-sunk)] sm:grid-cols-[1fr_1fr_96px] sm:gap-y-0"
            >
              <span className="order-1 text-[0.875rem] font-medium text-ink sm:order-none">
                {s.name}
              </span>
              <span className="order-3 text-[0.75rem] text-ink-soft sm:order-none">
                {s.barangay}
              </span>
              <span className="order-2 sm:order-none sm:text-right">
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
                  {t(`status.${s.status}`)}
                </Pill>
              </span>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="px-5 py-10 text-center text-[0.875rem] text-ink-mute">
              {t("network.directory.noMatch")}
            </li>
          )}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[var(--paper-sunk)] px-5 py-3">
          <span className="mono-tag text-ink-mute">
            {rows.length} {t("common.of")} {records.length} {t("network.directory.records")}
          </span>
          <span className="mono-tag text-moss">
            {records.filter((s) => s.inPilotArea).length} {t("network.directory.inService")}
          </span>
        </div>
      </div>

      <p className="mono-tag mt-4 text-ink-mute">
        {t("network.directory.publicNote")}
      </p>

      <div className="mt-8">
        <p className="mono-tag uppercase text-ink-mute">{t("network.directory.statusMeans")}</p>
        <StatusLegend className="mt-3" />
      </div>
    </div>
  );
}
