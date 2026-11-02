import { Router } from "express";
import { z } from "zod";
import { Pickup } from "../models/Pickup.js";
import { Shop } from "../models/Shop.js";
import { record } from "../models/AuditLog.js";

export const pickupsRouter = Router();

const SACK_TARE = Number(process.env.SACK_TARE_KG ?? 0.18);

const createPickupSchema = z.object({
  clientId: z.string().min(6),
  shopCode: z.string().min(3),
  scheduledFor: z.coerce.date().optional(),
  window: z.string().optional(),
  sacks: z.coerce.number().min(0).default(0),
  grossKg: z.coerce.number().min(0).default(0),
  grade: z.enum(["Clean", "Minor", "Mixed"]).default("Clean"),
  treated: z.enum(["No", "Yes", "Unsure"]).default("No"),
  status: z.enum(["Scheduled", "Collected", "Weighed", "Skipped", "Rescheduled"]).default("Collected"),
  collector: z.string().optional(),
  acknowledged: z.coerce.boolean().optional(),
  note: z.string().optional(),
  photoUrl: z.string().optional(),
});

/** GET /api/v1/pickups?status=&shop=&from=&to= */
pickupsRouter.get("/", async (req, res) => {
  const { status, shop, grade, limit } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (status && status !== "All") filter.status = status;
  if (grade && grade !== "All") filter.grade = grade;
  if (shop) filter.shopCode = shop;

  const docs = await Pickup.find(filter)
    .sort({ scheduledFor: -1 })
    .limit(Math.min(Number(limit ?? 100), 500))
    .lean();
  res.json({ count: docs.length, data: docs });
});

/** GET /api/v1/pickups/route — today's ordered collector list. */
pickupsRouter.get("/route", async (req, res) => {
  const day = req.query.date ? new Date(String(req.query.date)) : new Date();
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const docs = await Pickup.find({ scheduledFor: { $gte: start, $lt: end } })
    .sort({ window: 1, shopCode: 1 })
    .lean();

  res.json({ date: start.toISOString().slice(0, 10), count: docs.length, data: docs });
});

/**
 * POST /api/v1/pickups
 * Idempotent on clientId so a phone that reconnects after a dead spot cannot
 * double-count sacks or kilograms.
 */
pickupsRouter.post("/", async (req, res) => {
  const parsed = createPickupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Invalid pickup payload", issues: parsed.error.issues });
  }
  const body = parsed.data;

  const existing = await Pickup.findOne({ clientId: body.clientId }).lean();
  if (existing) return res.status(200).json({ data: existing, idempotent: true });

  const shop = await Shop.findOne({ code: body.shopCode });
  if (!shop) return res.status(404).json({ error: `Unknown shop code ${body.shopCode}` });
  if (shop.status !== "Enrolled") {
    return res.status(409).json({ error: "Only enrolled shops can be collected from" });
  }

  const tare = SACK_TARE;
  const netKg = Math.max(0, Number((body.grossKg - tare).toFixed(2)));
  const count = await Pickup.countDocuments();

  const pickup = await Pickup.create({
    code: `PK-${String(2418 + count + 1).padStart(4, "0")}`,
    clientId: body.clientId,
    shop: shop._id,
    shopCode: shop.code,
    scheduledFor: body.scheduledFor ?? new Date(),
    window: body.window ?? shop.pickupRule?.window ?? "",
    collectedAt: body.status === "Collected" || body.status === "Weighed" ? new Date() : undefined,
    sacks: body.sacks,
    grossKg: body.grossKg,
    tareKg: tare,
    netKg,
    grade: body.grade,
    treated: body.treated,
    status: body.status,
    collector: body.collector ?? "",
    acknowledged: Boolean(body.acknowledged),
    acknowledgedAt: body.acknowledged ? new Date() : undefined,
    note: body.note ?? "",
    photoUrl: body.photoUrl ?? "",
  });

  if (body.status === "Weighed" || body.status === "Collected") {
    await Shop.updateOne(
      { _id: shop._id },
      { $inc: { totalNetKg: netKg, pickupCount: 1 } },
    );
  }

  await record({
    actor: body.collector || "Staff",
    action: "pickup.create",
    entity: "Pickup",
    entityId: pickup.code,
    after: { sacks: body.sacks, netKg, grade: body.grade, treated: body.treated },
    remark: body.note ?? "",
    ip: req.ip,
  });

  res.status(201).json({ data: pickup });
});

/** PATCH /api/v1/pickups/:code — grade correction or status change. */
pickupsRouter.patch("/:code", async (req, res) => {
  const pickup = await Pickup.findOne({ code: req.params.code });
  if (!pickup) return res.status(404).json({ error: "Pickup not found" });

  const before = pickup.toObject();
  const allowed = ["grade", "treated", "status", "note", "acknowledged", "sacks", "grossKg"] as const;
  for (const key of allowed) {
    if (key in (req.body ?? {})) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pickup as any)[key] = req.body[key];
    }
  }
  await pickup.save();

  await record({
    actor: (req.headers["x-actor"] as string) ?? "Staff",
    action: "pickup.update",
    entity: "Pickup",
    entityId: pickup.code,
    before,
    after: pickup.toObject(),
    ip: req.ip,
  });

  res.json({ data: pickup });
});
