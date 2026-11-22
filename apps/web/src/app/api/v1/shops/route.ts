import { NextResponse } from "next/server";
import { readResource } from "@/lib/read-resource";
import { shops } from "@/lib/data";
import { connectMongo } from "@/lib/mongo";
import { createSupplierFromRegistration } from "@/lib/supplier-model";
import { normalizeMobile, isPhilippineMobile } from "@/lib/phone";

// Mongoose needs the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

const API_URL = process.env.API_URL;

/** GET /api/v1/shops — shop registry. */
export async function GET() {
  return readResource("shops", shops);
}

/**
 * Partner registration intake.
 *
 * The public site is a static marketing surface; the operations API lives
 * separately. When API_URL is configured the request is forwarded to
 * /api/v1/suppliers where a Supplier is created (status: pending). Without it,
 * the request is accepted and logged so the form never fails silently.
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

  // Strip the trunk 0 the owner may type out of habit, then validate. The
  // fixed +63 prefix in the form means "0917…" and "917…" are the same number.
  const mobile = normalizeMobile(payload.mobile);
  if (!isPhilippineMobile(mobile)) {
    return NextResponse.json(
      { error: "Mobile must be 10 digits starting with 9 (no leading 0)" },
      { status: 422 },
    );
  }

  if (!payload.consent) {
    return NextResponse.json(
      { error: "Consent is required to register" },
      { status: 422 },
    );
  }

  if (API_URL) {
    try {
      const upstream = await fetch(`${API_URL.replace(/\/$/, "")}/api/v1/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, mobile, countryCode: "+63" }),
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

  // No upstream API configured — persist directly to MongoDB so the form never
  // fails silently. Partner self-registrations land as pending Suppliers.
  try {
    await connectMongo();
    const supplier = await createSupplierFromRegistration({
      name: String(payload.name),
      contact: String(payload.contact),
      mobile,
      countryCode: payload.countryCode ? String(payload.countryCode) : "+63",
      barangay: String(payload.barangay),
      street: payload.street ? String(payload.street) : undefined,
      unit: payload.unit ? String(payload.unit) : undefined,
      frequency: payload.frequency ? String(payload.frequency) : undefined,
      startTime: payload.startTime ? String(payload.startTime) : undefined,
      endTime: payload.endTime ? String(payload.endTime) : undefined,
      consent: true,
    });
    return NextResponse.json(
      { data: { reference: supplier.code, status: "received" } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Registration service unavailable. Call 0917 000 0000." },
      { status: 503 },
    );
  }
}
