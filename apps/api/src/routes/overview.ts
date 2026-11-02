import { Router } from "express";
import { Shop } from "../models/Shop.js";
import { Pickup } from "../models/Pickup.js";
import { Batch } from "../models/Batch.js";
import { LabResult } from "../models/LabResult.js";

export const overviewRouter = Router();

/** GET /api/v1/overview — role-agnostic aggregates for the dashboard. */
overviewRouter.get("/", async (_req, res) => {
  const [
    shopsByStatus,
    pickupsByStatus,
    gradeMix,
    activeBatches,
    labCount,
    weights,
  ] = await Promise.all([
    Shop.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Pickup.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Pickup.aggregate([
      { $match: { status: { $in: ["Collected", "Weighed"] } } },
      { $group: { _id: "$grade", count: { $sum: 1 } } },
    ]),
    Batch.countDocuments({ stage: { $nin: ["Approved", "Rejected"] } }),
    LabResult.countDocuments(),
    Pickup.aggregate([
      { $match: { status: { $in: ["Collected", "Weighed"] } } },
      {
        $group: {
          _id: { $dateToString: { format: "%G-W%V", date: "$scheduledFor" } },
          kg: { $sum: "$netKg" },
          pickups: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
  ]);

  const totalNetKg = weights.reduce((sum: number, w: { kg: number }) => sum + w.kg, 0);
  const totalPickups = weights.reduce((sum: number, w: { pickups: number }) => sum + w.pickups, 0);
  const graded = gradeMix.reduce((sum: number, g: { count: number }) => sum + g.count, 0) || 1;

  res.json({
    shops: Object.fromEntries(shopsByStatus.map((s) => [s._id, s.count])),
    pickups: Object.fromEntries(pickupsByStatus.map((p) => [p._id, p.count])),
    grade: Object.fromEntries(
      gradeMix.map((g) => [g._id, Number(((g.count / graded) * 100).toFixed(0))]),
    ),
    activeBatches,
    labResults: labCount,
    totalNetKg: Number(totalNetKg.toFixed(1)),
    totalPickups,
    weekly: weights.map((w) => ({ week: w._id, kg: Number(w.kg.toFixed(1)) })),
  });
});
