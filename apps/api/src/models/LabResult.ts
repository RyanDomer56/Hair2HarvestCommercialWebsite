import { Schema, model, type InferSchemaType } from "mongoose";

const labResultSchema = new Schema(
  {
    code: { type: String, required: true },
    version: { type: Number, default: 1 },
    batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true, index: true },
    batchCode: { type: String, required: true },
    laboratory: { type: String, required: true },
    method: { type: String, default: "" },
    sampledOn: { type: Date },
    reportedOn: { type: Date, default: () => new Date() },

    n: { type: Number, required: true },
    p: { type: Number, required: true },
    k: { type: Number, required: true },
    ph: { type: Number, required: true },
    moisture: { type: Number, required: true },
    maturity: { type: String, enum: ["Immature", "Mature"], default: "Mature" },
    pathogens: { type: String, enum: ["Absent", "Detected"], default: "Absent" },

    verdict: { type: String, enum: ["Pass", "Review", "Fail"], default: "Review" },
    attachmentUrl: { type: String, default: "" },
    enteredBy: { type: String, default: "" },
    reviewedBy: { type: String, default: "" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

labResultSchema.index({ code: 1, version: -1 });

export type LabResultDoc = InferSchemaType<typeof labResultSchema>;
export const LabResult = model("LabResult", labResultSchema);
