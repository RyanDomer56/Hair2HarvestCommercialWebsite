import { Boxes, PackageX, Snowflake, AlertTriangle } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";
import { shops } from "@/lib/data";

const lots = shops
  .filter((s) => s.totalKg > 0)
  .map((s, i) => ({
    lot: `LOT-${String(118 - i).padStart(3, "0")}`,
    shop: s.code,
    kg: Number((s.totalKg * 0.42).toFixed(2)),
    grade: i % 5 === 2 ? "Minor" : i % 7 === 3 ? "Mixed" : "Clean",
    treated: i % 4 === 1 ? "Unsure" : i % 6 === 0 ? "Yes" : "No",
    status: i % 5 === 2 ? "Held" : i % 7 === 3 ? "Held" : "In batch",
  }));

export default function InventoryPage() {
  const available = lots.filter((l) => l.status !== "Held").reduce((a, l) => a + l.kg, 0);
  const held = lots.filter((l) => l.status === "Held").reduce((a, l) => a + l.kg, 0);

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Raw hair inventory"
        subtitle="Clean and minor, untreated stock. Treated and unsure stock is held on a separate line until a specialist decides."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Boxes} label="Available" value={available.toFixed(1)} suffix="kg" footnote="Eligible for batching" />
        <KpiCard icon={Snowflake} label="Held" value={held.toFixed(1)} suffix="kg" footnote="Treated or unsure" tone="alert" />
        <KpiCard icon={PackageX} label="Mixed lots" value={String(lots.filter((l) => l.grade === "Mixed").length)} footnote="Never batched by default" />
        <KpiCard icon={AlertTriangle} label="Lots" value={String(lots.length)} footnote="FIFO by pickup date" />
      </div>

      <Panel title="Stock lots" subtitle="FIFO — oldest pickup leaves first" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {["Lot", "Source", "Net kg", "Grade", "Treated", "Status"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                      i === 2 ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.map((l) => (
                <tr
                  key={l.lot}
                  className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                >
                  <td className="px-5 py-3 font-mono text-[0.6875rem] text-[#5d6432]">{l.lot}</td>
                  <td className="px-5 py-3 text-[0.75rem] text-[#33361a]">{l.shop}</td>
                  <td className="px-5 py-3 text-right text-[0.8125rem] font-medium tabular-nums text-[#33361a]">
                    {l.kg.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={l.grade} />
                  </td>
                  <td className="px-5 py-3 text-[0.6875rem] text-[#6b6d4c]">{l.treated}</td>
                  <td className="px-5 py-3">
                    <StatusPill
                      status={l.status === "Held" ? "Rescheduled" : "Collected"}
                      dot={false}
                    />
                    <span className="ml-2 text-[0.625rem] text-[#9a9c74]">{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#eef0e2] bg-[#fafbf4] px-5 py-3">
          <p className="text-[0.6875rem] text-[#9a9c74]">
            A lot leaves this table only when it is consumed by a batch or released by an admin.
          </p>
        </div>
      </Panel>
    </div>
  );
}
