import { NextResponse } from "next/server";
import { readResource } from "@/lib/read-resource";
import { shops } from "@/lib/data";

const API_URL = process.env.API_URL;

/** GET /api/v1/shops — shop registry. */
export async function GET() {
  return readResource("shops", shops);
}

/**
 * Partner registration intake.
 *
 * The public site is a static marketing surface; the operations API lives
 * separately. When API_URL is configured the request is forwarded there and
 * the shop is created as a Candidate. Without it, the request is accepted and
 * logged so the form never fails silently for a shop owner.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body" }, { status: 400 });
  }

  const required = ["name", "contact", "mobile", "barangay"] as const;
  const missing = required.filter((k) => !String(payload[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 422 },
    );
  }

  // Mobile must be digits only and at most 11 characters (Philippine format).
  const mobile = String(payload.mobile ?? "");
  if (!/^\d{1,11}$/.test(mobile)) {
    return NextResponse.json(
      { error: "Mobile number must be digits only, up to 11 characters" },
      { status: 422 },
    );
  }

  if (API_URL) {
    try {
      const upstream = await fetch(`${API_URL.replace(/\/$/, "")}/api/v1/shops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { error: "Registration service unreachable. Call 0917 000 0000." },
        { status: 503 },
      );
    }
  }

  const reference = `REQ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  console.info("[partner] registration queued", { reference, name: payload.name });
  return NextResponse.json({ data: { reference, status: "queued" } }, { status: 202 });
}
