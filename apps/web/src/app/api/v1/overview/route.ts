import { readResource } from "@/lib/read-resource";
import { overviewStats, collectionSeries, gradeMix } from "@/lib/data";

/** GET /api/v1/overview — dashboard aggregates and machine telemetry. */
export async function GET() {
  return readResource("overview", {
    stats: overviewStats,
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
  });
}
