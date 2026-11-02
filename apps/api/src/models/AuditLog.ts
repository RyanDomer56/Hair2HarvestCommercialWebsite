import { Schema, model } from "mongoose";

/**
 * Append-only. Entries are never updated or deleted; a correction is a new
 * entry that references the previous one.
 */
const auditSchema = new Schema(
  {
    actor: { type: String, required: true },
    actorRole: { type: String, default: "" },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, default: "" },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    remark: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const immutable = function () {
  throw new Error("Audit log entries are immutable.");
};

auditSchema.pre("updateOne", immutable);
auditSchema.pre("findOneAndUpdate", immutable);
auditSchema.pre("deleteOne", immutable);
auditSchema.pre("deleteMany", immutable);

export const AuditLog = model("AuditLog", auditSchema);

export async function record(entry: {
  actor: string;
  actorRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  remark?: string;
  ip?: string;
}) {
  try {
    await AuditLog.create(entry);
  } catch (error) {
    console.error("[audit] failed to write entry", error);
  }
}
