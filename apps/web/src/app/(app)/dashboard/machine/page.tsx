import { Cpu, Thermometer, Wind, Play, Square, ShieldAlert } from "lucide-react";
import { Panel, PageHead, StatusPill, KpiCard } from "@/components/app/ui";

const machines = [
  { id: "MCH-01", name: "Drum turner A", state: "Running", temp: 62.1, rpm: 8, batch: "BATCH-2603", load: 18.4 },
  { id: "MCH-02", name: "Drum turner B", state: "Running", temp: 58.6, rpm: 8, batch: "BATCH-2602", load: 14.1 },
  { id: "MCH-03", name: "Static pile 1", state: "Running", temp: 41.2, rpm: 0, batch: "BATCH-2601", load: 15.2 },
  { id: "MCH-04", name: "Shredder", state: "Idle", temp: 28.4, rpm: 0, batch: "—", load: 0 },
  { id: "MCH-05", name: "Sieve", state: "Running", temp: 29.0, rpm: 14, batch: "BATCH-2512", load: 12.9 },
  { id: "MCH-06", name: "Drum turner C", state: "Maintenance", temp: 24.1, rpm: 0, batch: "—", load: 0 },
];

export default function MachinePage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Machine monitoring"
        subtitle="The web panel sends authorised start and stop only. E-stop, lid interlock and motor shutoff stay in local hardware."
      >
        <span className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e8d5b8] bg-[#fdf4e6] px-3.5 text-[0.6875rem] font-medium text-[#a06a1f]">
          <ShieldAlert size={13} />
          Hardware safety is local
        </span>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard icon={Cpu} label="Running" value="5 of 6" bars={{ total: 6, active: 5, alert: 1 }} footnote="1 in maintenance" />
        <KpiCard icon={Thermometer} label="Peak temperature" value="62.1" suffix="°C" footnote="MCH-01 · within range" />
        <KpiCard icon={Wind} label="Airflow" value="Normal" footnote="All extraction fans nominal" />
        <KpiCard icon={Cpu} label="Sessions today" value="3" footnote="Each logged with operator and batch" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {machines.map((m) => (
          <div key={m.id} className="app-card app-shadow p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[0.625rem] text-[#9a9c74]">{m.id}</p>
                <p className="mt-0.5 text-[0.9375rem] font-semibold tracking-[-0.02em] text-[#26280f]">
                  {m.name}
                </p>
              </div>
              <StatusPill
                status={m.state === "Running" ? "Collected" : m.state === "Maintenance" ? "Rescheduled" : "Withdrawn"}
                dot={m.state === "Running"}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Temp", `${m.temp}°C`],
                ["Speed", `${m.rpm} rpm`],
                ["Load", `${m.load} kg`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-[#fafbf4] px-2.5 py-2">
                  <p className="text-[0.5625rem] uppercase tracking-[0.08em] text-[#9a9c74]">{k}</p>
                  <p className="mt-0.5 text-[0.75rem] font-medium tabular-nums text-[#33361a]">{v}</p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[0.625rem] text-[#9a9c74]">
              {m.batch === "—" ? "No batch loaded" : `Batch ${m.batch}`}
            </p>

            <div className="mt-4 flex gap-2 border-t border-[#f2f4e8] pt-3">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#f0f7dd] px-3 py-1.5 text-[0.6875rem] font-medium text-[#4f7a1f] transition-colors hover:bg-[#e4f0c8]"
              >
                <Play size={11} />
                Start
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#e9e8db] px-3 py-1.5 text-[0.6875rem] font-medium text-[#6b6d4c] transition-colors hover:bg-[#fafbf4]"
              >
                <Square size={11} />
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Operating sessions" subtitle="Start, end, duration, readings and operator">
        <div className="space-y-2.5">
          {[
            ["SES-0912", "MCH-01", "M. Salazar", "06:10", "07:02", "52 min", "BATCH-2603"],
            ["SES-0911", "MCH-02", "M. Salazar", "05:45", "06:31", "46 min", "BATCH-2602"],
            ["SES-0910", "MCH-05", "J. Ramos", "05:20", "05:48", "28 min", "BATCH-2512"],
          ].map(([id, m, op, start, end, dur, batch]) => (
            <div
              key={id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-[#eef0e2] bg-[#fafbf4] px-3.5 py-2.5"
            >
              <span className="font-mono text-[0.625rem] text-[#5d6432]">{id}</span>
              <span className="text-[0.75rem] text-[#33361a]">{m}</span>
              <span className="text-[0.6875rem] text-[#9a9c74]">{op}</span>
              <span className="ml-auto text-[0.6875rem] tabular-nums text-[#6b6d4c]">
                {start} → {end}
              </span>
              <span className="text-[0.6875rem] tabular-nums text-[#33361a]">{dur}</span>
              <span className="font-mono text-[0.625rem] text-[#9a9c74]">{batch}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
