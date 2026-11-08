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
  street: z.string().optional(),
  unit: z.string().optional(),
  frequency: z.enum(["Weekly", "Twice a Week", "Nightly"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  consent: z.boolean(),
});

/**
 * Map the partner's pickup rules onto the stored operating-hours window and a
 * normalized pickup frequency.
 */
function operatingHoursFromPickup(
  frequency?: string,
  start?: string,
  end?: string,
): { days: string; open: string; close: string; pickupFrequency: string } {
  const f = (frequency ?? "").trim();
  let pickupFrequency = "weekly";
  let days = "";
  if (/nightly/i.test(f)) {
    pickupFrequency = "nightly";
    days = "Mon-Sat (night)";
  } else if (/twice/i.test(f)) {
    pickupFrequency = "twice-weekly";
    days = "Mon-Sat (2x)";
  } else if (/weekly/i.test(f)) {
    pickupFrequency = "weekly";
    days = "Mon-Sat";
  }
  return { days, open: (start ?? "").trim(), close: (end ?? "").trim(), pickupFrequency };
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
  const { days, open, close, pickupFrequency } = operatingHoursFromPickup(
    b.frequency,
    b.startTime,
    b.endTime,
  );

  const supplier = await Supplier.create({
    code,
    shopCode,
    shopName: b.name,
    owner: b.contact,
    phone,
    email: "",
    barangay: b.barangay,
    street: b.street ?? "",
    operatingHours: { days, open, close },
    pickupFrequency,
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
    unit: b.unit ?? null,
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
