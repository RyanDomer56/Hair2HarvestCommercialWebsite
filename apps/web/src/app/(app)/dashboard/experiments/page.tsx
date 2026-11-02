import { Sprout, Plus, Ruler } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";

const experiments = [
  { id: "EXP-014", crop: "Pechay", treatment: "Hair compost 30%", control: "Commercial organic", batch: "BATCH-2512", week: 6, total: 8, delta: 18, state: "Running" },
  { id: "EXP-013", crop: "Tomato", treatment: "Hair compost 20%", control: "No amendment", batch: "BATCH-2512", week: 4, total: 8, delta: 11, state: "Running" },
  { id: "EXP-012", crop: "Kangkong", treatment: "Hair compost 40%", control: "Commercial organic", batch: "BATCH-2601", week: 7, total: 8, delta: 7, state: "Running" },
  { id: "EXP-011", crop: "Pechay", treatment: "Hair compost 10%", control: "No amendment", batch: "BATCH-2601", week: 2, total: 8, delta: 3, state: "Running" },
  { id: "EXP-010", crop: "Tomato", treatment: "Hair compost 30%", control: "Commercial organic", batch: "BATCH-2512", week: 8, total: 8, delta: 22, state: "Complete" },
  { id: "EXP-009", crop: "Kangkong", treatment: "Hair compost 20%", control: "No amendment", batch: "BATCH-2512", week: 8, total: 8, delta: 14, state: "Complete" },
];

export default function ExperimentsPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Planting experiments"
        subtitle="Only batches approved for supervised testing may be used. Height, leaf count, health and photos logged weekly."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white"
        >
          <Plus size={13} />
          New experiment
        </button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Sprout} label="Active trials" value="4" footnote="2 completed" />
        <KpiCard icon={Ruler} label="Best Δ height" value="+18" suffix="%" footnote="EXP-014 · pechay" />
        <KpiCard icon={Sprout} label="Crops" value="3" footnote="Pechay, tomato, kangkong" />
        <KpiCard icon={Ruler} label="Progress" value="68" suffix="%" bars={{ total: 6, active: 4 }} footnote="4 of 6 runs complete" />
      </div>

      <Panel title="Trials" subtitle="Treatment vs paired control" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {["ID", "Crop", "Treatment", "Control", "Batch", "Week", "Δ height", "State"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                        i === 6 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {experiments.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                >
                  <td className="px-5 py-3 font-mono text-[0.6875rem] text-[#5d6432]">{e.id}</td>
                  <td className="px-5 py-3 text-[0.8125rem] font-medium text-[#33361a]">{e.crop}</td>
                  <td className="px-5 py-3 text-[0.6875rem] text-[#6b6d4c]">{e.treatment}</td>
                  <td className="px-5 py-3 text-[0.6875rem] text-[#6b6d4c]">{e.control}</td>
                  <td className="px-5 py-3 font-mono text-[0.625rem] text-[#9a9c74]">{e.batch}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#f2f4e8]">
                        <div
                          className="h-full rounded-full bg-[#5b8c22]"
                          style={{ width: `${(e.week / e.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[0.625rem] tabular-nums text-[#9a9c74]">
                        {e.week}/{e.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-[0.8125rem] font-medium tabular-nums text-[#4f7a1f]">
                    +{e.delta}%
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={e.state === "Complete" ? "Approved" : "Composting"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[#eef0e2] bg-[#fafbf4] px-5 py-3">
          <p className="text-[0.6875rem] text-[#9a9c74]">
            n = 1 per treatment. Results are preliminary and not a yield claim.
          </p>
        </div>
      </Panel>
    </div>
  );
}
