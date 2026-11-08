import { Router } from "express";
import { z } from "zod";
import { Supplier } from "../models/Supplier.js";
import { record } from "../models/AuditLog.js";

export const suppliersRouter = Router();

/** Payload shape sent by the commercial website partner form. */
const registerSchema = z.object({
  name: z.string().min(2, "Shop name is required"),
  contact: z.string().min(2, "Contact person is required"),
  mobile: z.string().regex(/^\d{7,15}$/, "Mobile must be 7–15 digits"),
  countryCode: z.string().min(1).default("+63"),
  barangay: z.string().min(2, "Barangay is required"),
  visit: z.string().optional(),
  consent: z.boolean(),
});

/**
 * Best-effort mapping of the "best time to visit" preference onto an
 * operating-hours window. The select sends a localized label, so we match on
 * stable substrings rather than exact text.
 */
function operatingHoursFromVisit(visit?: string): { days: string; open: string; close: string } {
  const v = (visit ?? "").toLowerCase();
  if (v.includes("9") && v.includes("11") && (v.includes("morning") || v.includes("umaga"))) {
    return { days: "Mon-Sat", open: "09:00", close: "11:00" };
  }
  if (v.includes("2") && v.includes("4") && (v.includes("afternoon") || v.includes("hapon"))) {
    return { days: "Mon-Sat", open: "14:00", close: "16:00" };
  }
  if (v.includes("8") && v.includes("9") && (v.includes("closing") || v.includes("magsara"))) {
    return { days: "Mon-Sat", open: "20:00", close: "21:00" };
  }
  return { days: "Mon-Sat", open: "", close: "" };
}

async function nextCodes() {
  const last = await Supplier.findOne().sort({ code: -1 }).lean<{ code?: string }>();
  const n = last?.code ? Number(String(last.code).replace(/\D/g, "")) + 1 : 1;
  const pad = String(n).padStart(2, "0");
  return { code: `S-${pad}`, shopCode: `WEB-${pad}` };
}

/** GET /api/v1/suppliers — list suppliers (operations view). */
suppliersRouter.get("/", async (_req, res) => {
  const docs = await Supplier.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ count: docs.length, data: docs });
});

/**
 * POST /api/v1/suppliers — partner self-registration from the commercial
 * website. Writes a `Supplier` so it appears alongside staff-created shops in
 * the admin workspace. New web registrations start as "pending" for review.
 */
suppliersRouter.post("/", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(422)
      .json({ error: "Invalid registration", issues: parsed.error.issues });
  }
  const b = parsed.data;

  if (!b.consent) {
    return res.status(422).json({ error: "Consent is required to register" });
  }

  const { code, shopCode } = await nextCodes();
  const phone = `${b.countryCode}${b.mobile}`.replace(/\s+/g, "");
  const now = new Date();

  const supplier = await Supplier.create({
    code,
    shopCode,
    shopName: b.name,
    owner: b.contact,
    phone,
    email: "",
    barangay: b.barangay,
    street: "",
    operatingHours: operatingHoursFromVisit(b.visit),
    pickupFrequency: "weekly",
    weeklyVolumeKg: 0,
    status: "pending",
    registrationSource: "web",
    consent: {
      agreed: true,
      agreedBy: b.contact,
      agreedAt: now,
      version: "v1.0-2025-01",
      document: "",
    },
    unit: null,
  });

  await record({
    actor: "Web",
    action: "supplier.register",
    entity: "Supplier",
    entityId: code,
    after: { code, shopName: supplier.shopName, status: supplier.status },
    remark: "Partner self-registration via commercial website",
    ip: req.ip,
  });

  res.status(201).json({
    data: { reference: code, status: "received", supplier },
  });
});
