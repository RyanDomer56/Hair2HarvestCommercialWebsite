import { Schema, model, type InferSchemaType } from "mongoose";

const pickupSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    /** Client-generated id. Makes the offline sync idempotent. */
    clientId: { type: String, required: true, unique: true, index: true },

    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    shopCode: { type: String, required: true },

    scheduledFor: { type: Date, required: true },
    window: { type: String, default: "" },
    collectedAt: { type: Date },

    sacks: { type: Number, default: 0, min: 0 },
    grossKg: { type: Number, default: 0, min: 0 },
    tareKg: { type: Number, default: 0.18, min: 0 },
    netKg: { type: Number, default: 0, min: 0 },

    grade: { type: String, enum: ["Clean", "Minor", "Mixed"], default: "Clean", index: true },
    treated: { type: String, enum: ["No", "Yes", "Unsure"], default: "No", index: true },
    rejectionReason: {
      type: String,
      enum: ["Mixed waste", "Wet", "Treated", "Too small", ""],
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Collected", "Weighed", "Skipped", "Rescheduled"],
      default: "Scheduled",
      index: true,
    },

    collector: { type: String, default: "" },
    acknowledged: { type: Boolean, default: false },
    acknowledgedAt: { type: Date },
    photoUrl: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

pickupSchema.pre("validate", function () {
  if (this.grossKg !== undefined) {
    this.netKg = Math.max(0, Number((this.grossKg - (this.tareKg ?? 0.18)).toFixed(2)));
  }
});

pickupSchema.index({ scheduledFor: 1, "window": 1 });

export type PickupDoc = InferSchemaType<typeof pickupSchema>;
export const Pickup = model("Pickup", pickupSchema);
