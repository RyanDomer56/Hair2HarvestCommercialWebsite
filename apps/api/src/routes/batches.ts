import { Router } from "express";
import { z } from "zod";
import { Batch } from "../models/Batch.js";
import { LabResult } from "../models/LabResult.js";
import { Pickup } from "../models/Pickup.js";
import { record } from "../models/AuditLog.js";

export const batchesRouter = Router();
export const labRouter = Router();

const createBatchSchema = z.object({
  code: z.string().optional(),
  operator: z.string().min(2),
  machine: z.string().optional(),
  shopCodes: z.array(z.string()).default([]),
  inputKg: z.coerce.number().positive(),
  recipe: z
    .object({
      version: z.string().default("v3.2"),
      hairPct: z.coerce.number().default(40),
      carbonPct: z.coerce.number().default(35),
      greensPct: z.coerce.number().default(25),
    })
    .optional(),
});

batchesRouter.get("/", async (req, res) => {
  const { stage } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (stage && stage !== "All") filter.stage = stage;
  const docs = await Batch.find(filter).sort({ startedOn: -1 }).lean();
  res.json({ count: docs.length, data: docs });
});

batchesRouter.get("/:code", async (req, res) => {
  const batch = await Batch.findOne({ code: req.params.code }).lean();
  if (!batch) return res.status(404).json({ error: "Batch not found" });
  const lab = await LabResult.find({ batchCode: batch.code }).sort({ version: -1 }).lean();
  res.json({ data: { batch, lab } });
});

batchesRouter.post("/", async (req, res) => {
  const parsed = createBatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Invalid batch payload", issues: parsed.error.issues });
  }
  const body = parsed.data;

  // A batch may only draw from clean/minor, untreated stock.
  const eligible = await Pickup.find({
    shopCode: { $in: body.shopCodes.length ? body.shopCodes : undefined },
    grade: { $in: ["Clean", "Minor"] },
    treated: "No",
    status: "Weighed",
  })
    .sort({ scheduledFor: 1 })
    .limit(200)
    .lean();

  const available = eligible.reduce((sum, p) => sum + p.netKg, 0);
  if (available < body.inputKg) {
    return res.status(409).json({
      error: "Not enough eligible stock",
      availableKg: Number(available.toFixed(2)),
      requestedKg: body.inputKg,
    });
  }

  const count = await Batch.countDocuments();
  const code = body.code ?? `BATCH-${2605 + count}`;

  const batch = await Batch.create({
    code,
    recipe: body.recipe ?? { version: "v3.2", hairPct: 40, carbonPct: 35, greensPct: 25 },
    operator: body.operator,
    machine: body.machine ?? "MCH-01",
    shopCodes: body.shopCodes,
    lots: eligible.slice(0, 12).map((p) => p._id),
    inputKg: body.inputKg,
    currentKg: body.inputKg,
    stage: "Preparing",
    startedOn: new Date(),
    stageHistory: [{ stage: "Preparing", at: new Date(), by: body.operator, remark: "Batch opened" }],
  });

  await record({
    actor: body.operator,
    action: "batch.create",
    entity: "Batch",
    entityId: code,
    after: { inputKg: body.inputKg, shops: body.shopCodes },
    ip: req.ip,
  });

  res.status(201).json({ data: batch });
});

/** PATCH /api/v1/batches/:code/stage — approval is blocked without a reviewed lab result. */
batchesRouter.patch("/:code/stage", async (req, res) => {
  const { stage, remark } = req.body ?? {};
  const batch = await Batch.findOne({ code: req.params.code });
  if (!batch) return res.status(404).json({ error: "Batch not found" });

  if (stage === "Approved") {
    const lab = await LabResult.findOne({ batchCode: batch.code, verdict: "Pass" }).lean();
    if (!lab) {
      return res.status(409).json({
        error: "A batch cannot be approved until lab results are reviewed.",
      });
    }
  }

  const before = batch.stage;
  batch.stage = stage;
  batch.stageHistory.push({
    stage,
    at: new Date(),
    by: (req.headers["x-actor"] as string) ?? "Operator",
    remark: remark ?? "",
  });
  await batch.save();

  await record({
    actor: (req.headers["x-actor"] as string) ?? "Operator",
    action: "batch.stage",
    entity: "Batch",
    entityId: batch.code,
    before: { stage: before },
    after: { stage },
    remark: remark ?? "",
    ip: req.ip,
  });

  res.json({ data: batch });
});

/* ------------------------------------------------------------------- lab */

labRouter.get("/", async (req, res) => {
  const { verdict } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};
  if (verdict && verdict !== "All") filter.verdict = verdict;
  const docs = await LabResult.find(filter).sort({ reportedOn: -1 }).lean();
  res.json({ count: docs.length, data: docs });
});

labRouter.post("/", async (req, res) => {
  const { batchCode, laboratory, n, p, k, ph, moisture, maturity, pathogens, enteredBy } =
    req.body ?? {};
  const batch = await Batch.findOne({ code: batchCode });
  if (!batch) return res.status(404).json({ error: "Batch not found" });

  const version = (await LabResult.countDocuments({ batchCode })) + 1;
  const verdict =
    Number(n) >= 1 && Number(p) >= 0.6 && Number(k) >= 0.8 && Number(ph) >= 6 && Number(ph) <= 8
      ? "Pass"
      : "Review";

  const result = await LabResult.create({
    code: `LR-${String(412 + version).padStart(4, "0")}`,
    version,
    batch: batch._id,
    batchCode,
    laboratory,
    n,
    p,
    k,
    ph,
    moisture,
    maturity,
    pathogens,
    verdict,
    enteredBy: enteredBy ?? "Researcher",
  });

  await record({
    actor: enteredBy ?? "Researcher",
    action: "lab.create",
    entity: "LabResult",
    entityId: result.code,
    after: { batchCode, verdict },
    ip: req.ip,
  });

  res.status(201).json({ data: result });
});
