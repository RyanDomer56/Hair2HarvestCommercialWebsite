import { Schema, model, type InferSchemaType } from "mongoose";

const batchSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    recipe: {
      version: { type: String, default: "v3.2" },
      hairPct: { type: Number, default: 40 },
      carbonPct: { type: Number, default: 35 },
      greensPct: { type: Number, default: 25 },
    },
    operator: { type: String, required: true },
    machine: { type: String, default: "MCH-01" },
    shopCodes: { type: [String], default: [] },
    lots: { type: [{ type: Schema.Types.ObjectId, ref: "Pickup" }], default: [] },

    inputKg: { type: Number, required: true, min: 0 },
    currentKg: { type: Number, required: true, min: 0 },
    moisture: { type: Number, default: 60 },
    temperature: { type: Number, default: 28 },

    stage: {
      type: String,
      enum: ["Preparing", "Composting", "Curing", "Sampling", "Pending", "On Hold", "Rejected", "Approved"],
      default: "Preparing",
      index: true,
    },
    startedOn: { type: Date, default: () => new Date() },
    stageHistory: {
      type: [
        {
          stage: String,
          at: Date,
          by: String,
          remark: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

batchSchema.virtual("reductionPct").get(function () {
  if (!this.inputKg) return 0;
  return Number((((this.inputKg - this.currentKg) / this.inputKg) * 100).toFixed(1));
});

batchSchema.set("toJSON", { virtuals: true });

export type BatchDoc = InferSchemaType<typeof batchSchema>;
export const Batch = model("Batch", batchSchema);
