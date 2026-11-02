import { FlaskConical, Upload, ShieldCheck, AlertTriangle } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";
import { labResults } from "@/lib/data";

const thresholds = [
  ["Nitrogen (N)", "≥ 1.00 %", "Kjeldahl, dry basis"],
  ["Phosphorus (P₂O₅)", "≥ 0.60 %", "Bray-2"],
  ["Potassium (K₂O)", "≥ 0.80 %", "Ammonium acetate"],
  ["pH", "6.0 – 8.0", "1:5 water suspension"],
  ["Moisture", "≤ 35 %", "Gravimetric"],
  ["Maturity", "Mature", "No reheating on turning"],
  ["Pathogens", "Absent", "Salmonella, E. coli"],
];

export default function LabPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Lab results"
        subtitle="External laboratory results linked to a batch. Re-tests are stored as new versions — nothing is overwritten."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white"
        >
          <Upload size={13} />
          Upload report
        </button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={FlaskConical} label="Reports on file" value={String(labResults.length)} footnote="2 labs · 4 batches" />
        <KpiCard icon={ShieldCheck} label="Passed" value={String(labResults.filter((r) => r.verdict === "Pass").length)} footnote="Eligible for approval" />
        <KpiCard icon={AlertTriangle} label="Needs review" value={String(labResults.filter((r) => r.verdict === "Review").length)} footnote="Immature at sampling" tone="alert" />
        <KpiCard icon={ShieldCheck} label="Awaiting sign-off" value="2" footnote="Admin approval required" />
      </div>

      <Panel title="Results" subtitle="N-P-K, pH, moisture, maturity and pathogens" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {["Report", "Batch", "Laboratory", "N %", "P %", "K %", "pH", "Moisture", "Maturity", "Verdict"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                        i >= 3 && i <= 7 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {labResults.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-[0.6875rem] text-[#5d6432]">{r.id}</p>
                    <p className="text-[0.625rem] tabular-nums text-[#9a9c74]">{r.date}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-[0.6875rem] text-[#33361a]">{r.batch}</td>
                  <td className="px-4 py-3 text-[0.6875rem] text-[#6b6d4c]">{r.lab}</td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">{r.n.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">{r.p.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">{r.k.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#33361a]">{r.ph.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-[0.75rem] tabular-nums text-[#6b6d4c]">{r.moisture}%</td>
                  <td className="px-4 py-3 text-[0.6875rem] text-[#6b6d4c]">{r.maturity}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.verdict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Approval thresholds"
        subtitle="Admin-editable. The rule engine recommends; an admin authorises every status change."
      >
        <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {thresholds.map(([k, v, method]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-4 border-b border-[#f2f4e8] py-2.5 last:border-b-0"
            >
              <div>
                <p className="text-[0.75rem] font-medium text-[#33361a]">{k}</p>
                <p className="text-[0.625rem] text-[#9a9c74]">{method}</p>
              </div>
              <p className="shrink-0 rounded bg-[#f5f7ea] px-2 py-0.5 font-mono text-[0.6875rem] text-[#4b5226]">
                {v}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
