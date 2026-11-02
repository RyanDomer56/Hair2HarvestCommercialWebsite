import { Truck, Plus, Download, CheckCircle2, Clock } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";
import { pickups, shops } from "@/lib/data";

export default function PickupsPage() {
  const due = pickups.filter((p) => p.status === "Scheduled");
  const net = pickups.reduce((a, p) => a + p.netKg, 0);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Collection & inventory"
        subtitle="Recurring pickups generated from each shop's rule. Ordered by time window, then barangay."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e9e8db] bg-white px-3.5 text-[0.75rem] font-medium text-[#4b4e28]"
        >
          <Download size={13} className="text-[#9a9c74]" />
          Export route
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white"
        >
          <Plus size={13} />
          Record pickup
        </button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Clock} label="Due tonight" value={String(due.length)} footnote="Window opens 8 PM" />
        <KpiCard icon={Truck} label="Weighed this week" value={net.toFixed(1)} suffix="kg" footnote="Net of 0.18 kg sack tare" />
        <KpiCard
          icon={CheckCircle2}
          label="Acknowledged"
          value={`${pickups.filter((p) => p.acknowledged).length}/${pickups.length}`}
          footnote="Tap or initials on collector's phone"
        />
        <KpiCard
          icon={Truck}
          label="Skipped"
          value={String(pickups.filter((p) => p.status === "Skipped").length)}
          footnote="Not counted as a shop failure"
        />
      </div>

      <Panel title="Tonight's route" subtitle="4 stops · 11 sacks expected" bodyClassName="p-0">
        <ol>
          {pickups
            .filter((p) => p.status === "Scheduled" || p.status === "Collected")
            .map((p, i) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 border-b border-[#f2f4e8] px-5 py-4 last:border-b-0 sm:flex-row sm:items-center"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f7dd] text-[0.6875rem] font-semibold text-[#4f7a1f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8125rem] font-medium text-[#33361a]">{p.shop}</p>
                  <p className="text-[0.6875rem] text-[#9a9c74]">
                    {p.shopCode} · {p.window} · collector {p.collector}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[0.75rem] tabular-nums text-[#6b6d4c]">
                    {p.sacks} sacks · {p.netKg.toFixed(2)} kg
                  </span>
                  <StatusPill status={p.status} />
                </div>
              </li>
            ))}
        </ol>
      </Panel>

      <Panel
        title="Pickup log"
        subtitle="Sacks, net kilograms, contamination grade and treated flag"
        bodyClassName="p-0"
        action={
          <span className="rounded-full border border-[#e9e8db] px-2 py-0.5 text-[0.625rem] font-medium text-[#7a7f52]">
            {pickups.length} records
          </span>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {[
                  "Pickup",
                  "Shop",
                  "Date",
                  "Sacks",
                  "Gross",
                  "Net",
                  "Grade",
                  "Treated",
                  "Ack",
                  "Status",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                      i >= 3 && i <= 5 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pickups.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                >
                  <td className="px-4 py-3 font-mono text-[0.6875rem] text-[#5d6432]">{p.code}</td>
                  <td className="px-4 py-3">
                    <p className="text-[0.75rem] font-medium text-[#33361a]">{p.shop}</p>
                    <p className="text-[0.625rem] text-[#9a9c74]">{p.shopCode}</p>
                  </td>
                  <td className="px-4 py-3 text-[0.6875rem] tabular-nums text-[#6b6d4c]">
                    {p.date}
                  </td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">
                    {p.sacks || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#6b6d4c]">
                    {p.grossKg ? p.grossKg.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-[0.75rem] font-medium tabular-nums text-[#33361a]">
                    {p.netKg ? p.netKg.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.grade} />
                  </td>
                  <td className="px-4 py-3 text-[0.6875rem] text-[#6b6d4c]">{p.treated}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex size-5 items-center justify-center rounded-full text-[0.625rem] ${
                        p.acknowledged
                          ? "bg-[#f0f7dd] text-[#4f7a1f]"
                          : "bg-[#f6f6f2] text-[#9a9c74]"
                      }`}
                    >
                      {p.acknowledged ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eef0e2] bg-[#fafbf4] px-5 py-3">
          <p className="text-[0.6875rem] text-[#9a9c74]">
            Net kg = gross − standard sack tare (0.18 kg). Tare is configurable.
          </p>
          <p className="text-[0.6875rem] text-[#7a7f52]">POST /api/v1/pickups · idempotent on clientId</p>
        </div>
      </Panel>

      <Panel title="Pickup rules in force" subtitle="One structured rule per enrolled shop">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shops
            .filter((s) => s.status === "Enrolled")
            .map((s) => (
              <div key={s.code} className="rounded-xl border border-[#eef0e2] bg-[#fafbf4] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6875rem] text-[#5d6432]">{s.code}</span>
                  {s.peakDay && (
                    <span className="rounded-full bg-[#fdf4e6] px-2 py-0.5 text-[0.5625rem] font-medium text-[#a06a1f]">
                      Peak heavy
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[0.8125rem] font-medium text-[#33361a]">{s.name}</p>
                <dl className="mt-3 space-y-1.5 border-t border-[#eef0e2] pt-2.5">
                  {[
                    ["Days", s.days.join(" & ")],
                    ["Window", s.window],
                    ["Frequency", s.frequency],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-[0.625rem] uppercase tracking-[0.06em] text-[#9a9c74]">
                        {k}
                      </dt>
                      <dd className="text-right text-[0.6875rem] text-[#4b4e28]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
        </div>
      </Panel>
    </div>
  );
}
