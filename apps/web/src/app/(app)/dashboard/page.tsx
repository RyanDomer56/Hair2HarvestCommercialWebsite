import Link from "next/link";
import {
  Store,
  Truck,
  Layers,
  Boxes,
  Cpu,
  FlaskConical,
  CalendarDays,
  Download,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { AreaChart } from "@/components/site/area-chart";
import { KpiCard, Panel, PageHead, StatusPill } from "@/components/app/ui";
import {
  collectionSeries,
  gradeMix,
  shops,
  pickups,
  batches,
  overviewStats,
} from "@/lib/data";

export default function DashboardPage() {
  const today = pickups.filter((p) => p.date === "2026-11-02");
  const activeBatches = batches.filter((b) => b.stage !== "Approved");

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Operations overview"
        subtitle="Admin view of shops, pickups, batches and lab activity."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e9e8db] bg-white px-3.5 text-[0.75rem] font-medium text-[#4b4e28] transition-colors hover:border-[#cfd3bd]"
        >
          <CalendarDays size={14} className="text-[#9a9c74]" />
          Last 7 days
          <ChevronRight size={13} className="rotate-90 text-[#9a9c74]" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white transition-colors hover:bg-[#33361a]"
        >
          Export
          <Download size={13} />
        </button>
      </PageHead>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          icon={Store}
          label="Shops enrolled"
          value={String(overviewStats.suppliers)}
          delta={overviewStats.suppliersDelta}
          deltaLabel="vs previous 7 days"
          footnote={`${shops.filter((s) => s.status === "Candidate").length} candidates awaiting a first visit`}
        />
        <KpiCard
          icon={Truck}
          label="Pickups due"
          value={String(overviewStats.pickupsDue)}
          footnote={`${overviewStats.pickupsOverdue} overdue · next window 8–9 PM`}
        />
        <KpiCard
          icon={Layers}
          label="Active batches"
          value={String(overviewStats.activeBatches)}
          footnote={`${overviewStats.awaitingQc} awaiting QC review`}
        />
        <KpiCard
          icon={Boxes}
          label="Approved materials"
          value={String(overviewStats.approvedMaterials)}
          delta={overviewStats.approvedDelta}
          deltaLabel="vs previous 7 days"
          footnote="Net kilograms released from cured batches"
        />
        <KpiCard
          icon={Cpu}
          label="Machine status"
          value={`${overviewStats.machineRunning} of ${overviewStats.machineTotal}`}
          bars={{ total: 6, active: 5, alert: 1 }}
          footnote="Running · 1 in maintenance"
        />
        <KpiCard
          icon={FlaskConical}
          label="Experiment progress"
          value={`${overviewStats.experimentProgress}%`}
          bars={{ total: 6, active: 4 }}
          footnote={`${overviewStats.experimentRuns} of ${overviewStats.experimentTotal} runs complete`}
        />
      </div>

      {/* trends */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Panel
          title="Collection trend"
          subtitle="Net kilograms per week, all enrolled shops"
          action={
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded bg-[#47552a]" aria-hidden />
                <span className="text-[0.6875rem] text-[#9a9c74]">Collected</span>
              </span>
              <span className="rounded-full border border-[#e9e8db] px-2 py-0.5 text-[0.625rem] font-medium text-[#7a7f52]">
                10 weeks
              </span>
            </div>
          }
        >
          <AreaChart
            data={collectionSeries.map((d) => ({ label: d.label, value: d.kg }))}
            height={210}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[#eef0e2] pt-4">
            {[
              ["This week", "44.6 kg", "+6.9%"],
              ["Average", "6.94 kg", "per pickup"],
              ["Total", "284.7 kg", "since wk 36"],
            ].map(([k, v, n]) => (
              <div key={k}>
                <p className="text-[0.6875rem] text-[#9a9c74]">{k}</p>
                <p className="mt-1 text-[1rem] font-semibold tabular-nums text-[#26280f]">
                  {v}
                </p>
                <p className="text-[0.625rem] text-[#9a9c74]">{n}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Contamination grade" subtitle="Share of the last 41 weighed pickups">
          <div className="space-y-4">
            {gradeMix.map((g) => (
              <div key={g.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        background:
                          g.tone === "moss"
                            ? "#5b8c22"
                            : g.tone === "clay"
                              ? "#c08a3e"
                              : "#c04a32",
                      }}
                      aria-hidden
                    />
                    <span className="text-[0.8125rem] font-medium text-[#33361a]">{g.label}</span>
                  </div>
                  <span className="text-[0.8125rem] font-semibold tabular-nums text-[#26280f]">
                    {g.value}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f2f4e8]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${g.value}%`,
                      background:
                        g.tone === "moss" ? "#5b8c22" : g.tone === "clay" ? "#c08a3e" : "#c04a32",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-[#eef0e2] bg-[#fafbf4] p-3">
            <p className="text-[0.6875rem] leading-relaxed text-[#7a7f52]">
              Mixed sacks are held, never batched. They trigger a coaching note, not a penalty.
            </p>
          </div>

          <Link
            href="/dashboard/pickups"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-[#4f7a1f]"
          >
            Review graded pickups
            <ArrowUpRight size={13} />
          </Link>
        </Panel>
      </div>

      {/* tables */}
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Panel
          title="Today's route"
          subtitle="Ordered by time window, then barangay"
          action={
            <Link
              href="/dashboard/pickups"
              className="text-[0.75rem] font-medium text-[#4f7a1f] hover:underline"
            >
              All pickups
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                  {["Shop", "Window", "Sacks", "Net kg", "Grade", "Status"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                        i >= 2 && i <= 3 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {today.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                  >
                    <td className="px-5 py-3">
                      <p className="text-[0.8125rem] font-medium text-[#33361a]">{p.shop}</p>
                      <p className="text-[0.6875rem] text-[#9a9c74]">
                        {p.shopCode} · {p.collector}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[0.75rem] text-[#6b6d4c]">{p.window}</td>
                    <td className="px-5 py-3 text-right text-[0.8125rem] tabular-nums text-[#33361a]">
                      {p.sacks || "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-[0.8125rem] font-medium tabular-nums text-[#33361a]">
                      {p.netKg ? p.netKg.toFixed(2) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={p.grade} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Batch pipeline"
          subtitle="Stage and mass reduction"
          action={
            <Link
              href="/dashboard/batches"
              className="text-[0.75rem] font-medium text-[#4f7a1f] hover:underline"
            >
              All batches
            </Link>
          }
        >
          <ul className="space-y-3.5">
            {activeBatches.map((b) => {
              const reduction = ((b.inputKg - b.currentKg) / b.inputKg) * 100;
              return (
                <li key={b.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.75rem] font-medium tabular-nums text-[#33361a]">
                      {b.id}
                    </span>
                    <StatusPill status={b.stage} />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f2f4e8]">
                      <div
                        className="h-full rounded-full bg-[#5b8c22]"
                        style={{ width: `${Math.min(100, reduction)}%` }}
                      />
                    </div>
                    <span className="text-[0.6875rem] tabular-nums text-[#9a9c74]">
                      −{reduction.toFixed(0)}%
                    </span>
                  </div>
                  <p className="mt-1 text-[0.625rem] text-[#9a9c74]">
                    Day {b.days} · {b.temperature} °C · {b.moisture}% moisture
                  </p>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
