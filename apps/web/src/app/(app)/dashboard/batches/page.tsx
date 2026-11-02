import { Layers, Plus, Thermometer, Droplets } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";
import { batches } from "@/lib/data";

const stages = ["Preparing", "Composting", "Curing", "Sampling", "Pending", "Approved"];

export default function BatchesPage() {
  const active = batches.filter((b) => b.stage !== "Approved");

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Batch & composting"
        subtitle="Only clean and minor, untreated stock enters a batch by default. Treated stock sits on a separate line."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white"
        >
          <Plus size={13} />
          New batch
        </button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Layers} label="Active batches" value={String(active.length)} footnote="Across 4 recipes" />
        <KpiCard icon={Thermometer} label="Hottest pile" value="62.1" suffix="°C" footnote="BATCH-2603 · composting" />
        <KpiCard icon={Droplets} label="Avg moisture" value="43" suffix="%" footnote="Target 40–60% during composting" />
        <KpiCard icon={Layers} label="Approved" value="1" footnote="BATCH-2512 · released 30 Oct" />
      </div>

      <div className="grid gap-3 lg:grid-cols-6">
        {stages.map((stage) => {
          const items = batches.filter((b) => b.stage === stage);
          return (
            <div key={stage} className="app-card app-shadow flex flex-col">
              <div className="flex items-center justify-between border-b border-[#eef0e2] px-3 py-2.5">
                <span className="text-[0.6875rem] font-medium text-[#4b4e28]">{stage}</span>
                <span className="rounded-full bg-[#f5f7ea] px-1.5 text-[0.625rem] tabular-nums text-[#9a9c74]">
                  {items.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 p-2.5">
                {items.map((b) => (
                  <div key={b.id} className="rounded-lg border border-[#eef0e2] bg-[#fafbf4] p-2.5">
                    <p className="font-mono text-[0.625rem] text-[#5d6432]">{b.id}</p>
                    <p className="mt-1 text-[0.6875rem] font-medium text-[#33361a]">
                      {b.inputKg.toFixed(1)} kg in
                    </p>
                    <p className="text-[0.625rem] text-[#9a9c74]">
                      day {b.days} · {b.temperature} °C
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-1 py-3 text-[0.625rem] text-[#c3c6b2]">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Panel title="Batch ledger" subtitle="Recipe version, mass in, mass out, curing day" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {["Batch", "Recipe", "Shops", "Operator", "In", "Now", "Reduction", "Temp", "Stage"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                        i >= 4 && i <= 7 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => {
                const reduction = ((b.inputKg - b.currentKg) / b.inputKg) * 100;
                return (
                  <tr
                    key={b.id}
                    className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                  >
                    <td className="px-4 py-3 font-mono text-[0.6875rem] text-[#5d6432]">{b.id}</td>
                    <td className="px-4 py-3 text-[0.6875rem] text-[#6b6d4c]">{b.recipe}</td>
                    <td className="px-4 py-3 text-[0.6875rem] text-[#6b6d4c]">
                      {b.shopCodes.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-[0.75rem] text-[#33361a]">{b.operator}</td>
                    <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">
                      {b.inputKg.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">
                      {b.currentKg.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#4f7a1f]">
                      −{reduction.toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#6b6d4c]">
                      {b.temperature} °C
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.stage} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
