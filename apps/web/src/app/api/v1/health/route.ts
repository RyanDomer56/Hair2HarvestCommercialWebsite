import { NextResponse } from "next/server";

/** GET /api/v1/health — tells you which data source the site is using. */
export async function GET() {
  const API_URL = process.env.API_URL?.replace(/\/$/, "");
  let upstream: "connected" | "unreachable" | "not configured" = "not configured";

  if (API_URL) {
    try {
      const r = await fetch(`${API_URL}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });
      upstream = r.ok ? "connected" : "unreachable";
    } catch {
      upstream = "unreachable";
    }
  }

  return NextResponse.json({
    ok: true,
    service: "hair2harvest-web",
    dataSource: upstream === "connected" ? "mongodb" : "fixtures",
    expressApi: upstream,
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    endpoints: [
      "/api/v1/health",
      "/api/v1/overview",
      "/api/v1/shops",
      "/api/v1/pickups",
      "/api/v1/batches",
      "/api/v1/lab",
    ],
  });
}
