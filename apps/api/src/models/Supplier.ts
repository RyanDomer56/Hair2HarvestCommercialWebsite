import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * Mirrors the production `suppliers` collection used by the admin workspace.
 * Partner self-registrations from the commercial website are written here so
 * the operations team sees them in the same place as staff-created shops.
 *
 * Field set verified against the live document in `hair2harvest_db.suppliers`.
 * `status` is intentionally a free string (default "pending") rather than an
 * enum, so a web registration is never rejected by an unknown enum value.
 */
const supplierSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    shopCode: { type: String, required: true, unique: true, index: true },
    shopName: { type: String, required: true, trim: true },
    owner: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    barangay: { type: String, required: true },
    street: { type: String, default: "" },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    operatingHours: {
      days: { type: String, default: "" },
      open: { type: String, default: "" },
      close: { type: String, default: "" },
    },
    pickupFrequency: { type: String, default: "weekly" },
    weeklyVolumeKg: { type: Number, default: 0 },
    status: { type: String, default: "pending", index: true },
    registrationSource: { type: String, default: "web" },
    consent: {
      agreed: { type: Boolean, default: false },
      agreedBy: { type: String, default: "" },
      agreedAt: { type: Date },
      version: { type: String, default: "v1.0-2025-01" },
      document: { type: String, default: "" },
    },
    unit: { type: String, default: null },
    lastReminder: {
      at: { type: Date },
      message: { type: String, default: "" },
    },
  },
  { timestamps: true, collection: "suppliers" },
);

export type SupplierDoc = InferSchemaType<typeof supplierSchema>;
export const Supplier = model("Supplier", supplierSchema, "suppliers");
