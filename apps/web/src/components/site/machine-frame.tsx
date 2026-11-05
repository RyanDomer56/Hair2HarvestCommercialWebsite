"use client";

import { useEffect, useState } from "react";
import { Gauge, Thermometer, Droplets, Layers, Timer } from "lucide-react";
import { getOverview, type MachineTelemetry, type OverviewPayload } from "@/lib/api-client";
import { overviewStats, collectionSeries, gradeMix } from "@/lib/data";
import { cn } from "@/lib/utils";

const FALLBACK: OverviewPayload = {
  stats: overviewStats as unknown as Record<string, number>,
  weekly: collectionSeries,
  gradeMix,
  machine: {
    id: "MCH-01",
    name: "Rotary composting drum",
    state: "Running",
    drumRpm: 8,
    coreTemperatureC: 58.6,
    moisturePct: 54,
    batch: "BATCH-2603",
    sessionMinutes: 52,
  },
};

export function MachineFrame({ children }: { children: React.ReactNode }) {
  const [machine, setMachine] = useState<MachineTelemetry>(FALLBACK.machine);
  const [source, setSource] = useState<"mongodb" | "fixtures" | "fixtures-fallback">("fixtures");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    getOverview(FALLBACK, ctrl.signal).then(({ data, source: from }) => {
      if (ctrl.signal.aborted) return;
      if (data?.machine) setMachine(data.machine);
      setSource(from);
    });
    return () => ctrl.abort();
  }, []);

  // A gentle drift keeps the panel feeling live without implying a real socket.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 4200);
    return () => window.clearInterval(id);
  }, []);

  const drift = Math.sin(tick * 0.9) * 0.4;
  const readouts = [
    { icon: Gauge, k: "DRUM", v: `${machine.drumRpm}`, unit: "rpm" },
    { icon: Thermometer, k: "CORE", v: (machine.coreTemperatureC + drift).toFixed(1), unit: "°C" },
    { icon: Droplets, k: "MOISTURE", v: `${machine.moisturePct}`, unit: "%" },
    { icon: Layers, k: "BATCH", v: machine.batch.replace("BATCH-", ""), unit: "id" },
    { icon: Timer, k: "SESSION", v: `${machine.sessionMinutes}`, unit: "min" },
  ];

  return (
    <div className="machine-frame overflow-hidden rounded-[3px] border border-moss-deep/35 bg-moss-deep text-paper">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-paper/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="mono-tag text-lime">MCH-01</span>
          <span className="h-3 w-px bg-paper/15" aria-hidden />
          <span className="mono-tag uppercase text-paper/60">Rotary composting drum</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="mono-tag hidden text-paper/40 md:inline">
            MODULE 05 / MODULE 06
          </span>
          <span className="flex items-center gap-2">
            <span className="live-dot size-1.5 rounded-full bg-lime" aria-hidden />
            <span className="mono-tag uppercase text-lime">{machine.state}</span>
          </span>
        </div>
      </div>

      <div className="relative h-[clamp(360px,50vw,560px)] w-full">{children}</div>

      <div className="grid grid-cols-2 border-t border-paper/10 sm:grid-cols-5">
        {readouts.map(({ icon: Icon, k, v, unit }, i) => (
          <div
            key={k}
            className={cn(
              "flex flex-col gap-1.5 px-4 py-3 sm:px-5",
              i < 4 && "sm:border-r sm:border-paper/10",
              i % 2 === 0 && "border-r border-paper/10 sm:border-r-0",
              i < 3 && "border-b border-paper/10 sm:border-b-0",
            )}
          >
            <div className="flex items-center gap-1.5">
              <Icon size={11} className="text-lime/70" aria-hidden />
              <span className="mono-tag uppercase text-paper/45">{k}</span>
            </div>
            <p className="num font-display text-[1.25rem] font-semibold leading-none text-paper">
              {v}
              <span className="ml-1.5 text-[0.625rem] font-medium tracking-[0.1em] text-paper/45">
                {unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper/10 bg-[#0b0e06] px-4 py-2.5 sm:px-5">
        <span className="mono-tag text-paper/35">
          E-STOP · LID INTERLOCK · MOTOR SHUTOFF ARE LOCAL HARDWARE
        </span>
        <span className="mono-tag text-lime/80">
          {source === "mongodb" ? "MONGODB · LIVE" : "FIXTURES · DEMO"}
        </span>
      </div>
    </div>
  );
}
