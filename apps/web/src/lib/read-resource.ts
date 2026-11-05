import { NextResponse } from "next/server";

const API_URL = process.env.API_URL?.replace(/\/$/, "");

/**
 * Read-through for the deployed site.
 *
 * With API_URL set, the request goes to the Express + MongoDB service.
 * Without it, the same endpoint returns the typed fixtures, so the site has a
 * real, callable API surface from day one and never shows a broken state.
 */
export async function readResource(resource: string, fixtures: unknown) {
  if (API_URL) {
    try {
      const upstream = await fetch(`${API_URL}/api/v1/${resource}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      const payload = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        { ...payload, source: "mongodb" },
        { status: upstream.status },
      );
    } catch {
      return NextResponse.json({ data: fixtures, source: "fixtures-fallback" });
    }
  }
  return NextResponse.json({ data: fixtures, source: "fixtures" });
}
