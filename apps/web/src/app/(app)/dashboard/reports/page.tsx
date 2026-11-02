import { FileText, Download, ShieldCheck, ScrollText } from "lucide-react";
import { Panel, PageHead, KpiCard } from "@/components/app/ui";

const reports = [
  ["Collection by period", "Pickups, sacks, net kg and grade mix", "CSV · XLSX · PDF", "41 records"],
  ["Collection by shop", "Volume and grade trend per shop code", "CSV · XLSX", "8 shops"],
  ["Batch summary", "Inputs, recipes, curing days, mass reduction", "CSV · PDF", "5 batches"],
  ["Laboratory register", "All results with versions and verdicts", "CSV · PDF", "4 reports"],
  ["Equipment use", "Session duration, operator, batch", "CSV", "312 sessions"],
  ["Full traceability", "Experiment → batch → shops → pickups → lab", "PDF", "EXP-014"],
];

const audit = [
  ["2026-11-02 21:04", "R. Cepeda", "pickup.create", "PK-2418", "3 sacks, 5.88 kg net, clean"],
  ["2026-11-02 20:58", "R. Cepeda", "shop.status", "HB-006", "Candidate → visit scheduled"],
  ["2026-11-02 18:12", "M. Salazar", "batch.log", "BATCH-2603", "Turn 2, 62.1 °C"],
  ["2026-11-02 09:40", "Admin", "batch.approve", "BATCH-2512", "Lab LR-0412 reviewed"],
  ["2026-11-01 17:22", "J. Ramos", "pickup.grade", "PK-2415", "Minor → Clean (re-inspected)"],
];

export default function ReportsPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Reports & audit"
        subtitle="CSV, XLSX and PDF exports with full traceability. Audit entries cannot be edited or deleted."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={FileText} label="Report types" value={String(reports.length)} footnote="Collection to traceability" />
        <KpiCard icon={Download} label="Exports this month" value="28" delta={6} deltaLabel="vs last month" />
        <KpiCard icon={ShieldCheck} label="Audit entries" value="1,482" footnote="Immutable, append-only" />
        <KpiCard icon={ScrollText} label="Retention" value="7 yr" footnote="Research requirement" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel title="Report library" subtitle="Filter by date range, shop and batch" bodyClassName="p-0">
          <ul>
            {reports.map(([name, desc, formats, scope]) => (
              <li
                key={name}
                className="flex flex-wrap items-center gap-3 border-b border-[#f2f4e8] px-5 py-3.5 last:border-b-0 hover:bg-[#fafbf4]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8125rem] font-medium text-[#33361a]">{name}</p>
                  <p className="text-[0.6875rem] text-[#9a9c74]">{desc}</p>
                </div>
                <span className="rounded bg-[#f5f7ea] px-1.5 py-0.5 font-mono text-[0.5625rem] text-[#7a7f52]">
                  {formats}
                </span>
                <span className="w-[74px] text-right text-[0.625rem] tabular-nums text-[#9a9c74]">
                  {scope}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-[#e9e8db] px-2.5 py-1 text-[0.625rem] font-medium text-[#4b4e28] transition-colors hover:bg-white"
                >
                  <Download size={10} />
                  Export
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Audit trail" subtitle="Who, what, when — with remarks">
          <ol className="space-y-3">
            {audit.map(([time, who, action, target, remark]) => (
              <li key={`${time}-${action}`} className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5b8c22]" aria-hidden />
                <div className="min-w-0 flex-1 border-b border-[#f2f4e8] pb-3">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-[0.625rem] text-[#5d6432]">{action}</span>
                    <span className="text-[0.6875rem] text-[#9a9c74]">{target}</span>
                    <span className="ml-auto font-mono text-[0.5625rem] tabular-nums text-[#b6b9a4]">
                      {time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[0.6875rem] text-[#6b6d4c]">
                    {who} · {remark}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}
