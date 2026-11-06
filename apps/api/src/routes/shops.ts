import { Router } from "express";
import { z } from "zod";
import { Shop } from "../models/Shop.js";
import { Pickup } from "../models/Pickup.js";
import { record } from "../models/AuditLog.js";

export const shopsRouter = Router();

const pickupRuleSchema = z.object({
  frequency: z.enum(["Nightly", "Twice weekly", "Weekly", "Custom"]).default("Twice weekly"),
  days: z.array(z.string()).default(["Tue", "Fri"]),
  window: z.string().default("After closing · 8–9 PM"),
  access: z.string().default(""),
  peakDay: z.boolean().default(false),
});

const createShopSchema = z.object({
  name: z.string().min(2),
  contact: z.string().min(2),
  mobile: z.string().regex(/^\d{7,11}$/, "Mobile must be 7-11 digits"),
  channel: z.enum(["SMS", "Messenger", "Viber", "Call"]).default("SMS"),
  barangay: z.string().min(2),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  inPilotArea: z.boolean().optional(),
  frequency: z.string().optional(),
  window: z.string().optional(),
  access: z.string().optional(),
  consent: z.boolean().optional(),
  photoPermission: z.boolean().optional(),
});

async function nextShopCode() {
  const last = await Shop.findOne().sort({ code: -1 }).lean();
  const n = last ? Number(String(last.code).replace(/\D/g, "")) + 1 : 1;
  return `HB-${String(n).padStart(3, "0")}`;
}

/** GET /api/v1/shops?status=Enrolled&q=balanga */
shopsRouter.get("/", async (req, res) => {
  const { status, q, pilot } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status && status !== "All") filter.status = status;
  if (pilot === "true") filter.inPilotArea = true;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, "i") },
      { code: new RegExp(q, "i") },
      { barangay: new RegExp(q, "i") },
    ];
  }
  const docs = await Shop.find(filter).sort({ status: 1, code: 1 }).lean();
  res.json({ count: docs.length, data: docs });
});

shopsRouter.get("/:code", async (req, res) => {
  const shop = await Shop.findOne({ code: req.params.code }).lean();
  if (!shop) return res.status(404).json({ error: "Shop not found" });
  const history = await Pickup.find({ shopCode: shop.code })
    .sort({ scheduledFor: -1 })
    .limit(24)
    .lean();
  res.json({ data: { shop, history } });
});

/** POST /api/v1/shops — staff-filled registration. No account is created. */
shopsRouter.post("/", async (req, res) => {
  const parsed = createShopSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Invalid shop payload", issues: parsed.error.issues });
  }
  const body = parsed.data;
  const code = await nextShopCode();

  const shop = await Shop.create({
    code,
    name: body.name,
    contact: body.contact,
    mobile: body.mobile,
    channel: body.channel,
    barangay: body.barangay,
    address: body.address ?? "",
    openingHours: body.openingHours ?? "",
    inPilotArea: body.inPilotArea ?? true,
    status: "Candidate",
    pickupRule: pickupRuleSchema.parse({
      frequency: body.frequency ?? "Twice weekly",
      days: ["Tue", "Fri"],
      window: body.window ?? "After closing · 8–9 PM",
      access: body.access ?? "",
    }),
    consent: {
      given: Boolean(body.consent),
      on: body.consent ? new Date() : undefined,
      explainedBy: "Staff visit",
      photoPermission: Boolean(body.photoPermission),
    },
    registeredBy: "Staff",
  });

  await record({
    actor: "Staff",
    action: "shop.create",
    entity: "Shop",
    entityId: code,
    after: { code, name: shop.name, status: shop.status },
    remark: "Registered on site",
    ip: req.ip,
  });

  res.status(201).json({ data: shop });
});

/** PATCH /api/v1/shops/:code — status transitions are audited. */
shopsRouter.patch("/:code", async (req, res) => {
  const { status, pickupRule } = req.body ?? {};
  const shop = await Shop.findOne({ code: req.params.code });
  if (!shop) return res.status(404).json({ error: "Shop not found" });

  const before = { status: shop.status, pickupRule: shop.pickupRule };
  if (status) shop.status = status;
  if (pickupRule) shop.pickupRule = { ...(shop.pickupRule as object), ...pickupRule } as typeof shop.pickupRule;
  await shop.save();

  await record({
    actor: (req.headers["x-actor"] as string) ?? "Admin",
    action: "shop.update",
    entity: "Shop",
    entityId: shop.code,
    before,
    after: { status: shop.status, pickupRule: shop.pickupRule },
    ip: req.ip,
  });

  res.json({ data: shop });
});
