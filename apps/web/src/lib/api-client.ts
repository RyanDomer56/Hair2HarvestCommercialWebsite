import type { Shop, Pickup, Batch, LabResult } from "./data";

export type Resource = "shops" | "pickups" | "batches" | "lab" | "overview";

export type MachineTelemetry = {
  id: string;
  name: string;
  state: string;
  drumRpm: number;
  coreTemperatureC: number;
  moisturePct: number;
  batch: string;
  sessionMinutes: number;
};

export type OverviewPayload = {
  stats: Record<string, number>;
  weekly: { label: string; kg: number }[];
  gradeMix: { label: string; value: number; tone: "moss" | "clay" | "rust" }[];
  machine: MachineTelemetry;
};

type Result<T> = { data: T; source: "mongodb" | "fixtures" | "fixtures-fallback" };

const cache = new Map<string, unknown>();

/**
 * Read from the live API, but never let a network failure break a page.
 * Every caller hands over the same typed fixture as a fallback, so the UI is
 * identical whether MongoDB is connected or not.
 */
export async function getResource<T>(
  resource: Resource,
  fallback: T,
  signal?: AbortSignal,
): Promise<Result<T>> {
  try {
    const res = await fetch(`/api/v1/${resource}`, {
      cache: "no-store",
      signal: signal ?? AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const payload = await res.json();
    if (payload?.data === undefined) throw new Error("malformed payload");
    cache.set(resource, payload.data);
    return {
      data: payload.data as T,
      source: payload.source === "mongodb" ? "mongodb" : "fixtures",
    };
  } catch {
    const cached = cache.get(resource) as T | undefined;
    return { data: cached ?? fallback, source: "fixtures-fallback" };
  }
}

export const getShops = (fallback: Shop[], signal?: AbortSignal) =>
  getResource<Shop[]>("shops", fallback, signal);
export const getPickups = (fallback: Pickup[], signal?: AbortSignal) =>
  getResource<Pickup[]>("pickups", fallback, signal);
export const getBatches = (fallback: Batch[], signal?: AbortSignal) =>
  getResource<Batch[]>("batches", fallback, signal);
export const getLab = (fallback: LabResult[], signal?: AbortSignal) =>
  getResource<LabResult[]>("lab", fallback, signal);
export const getOverview = (fallback: OverviewPayload, signal?: AbortSignal) =>
  getResource<OverviewPayload>("overview", fallback, signal);
