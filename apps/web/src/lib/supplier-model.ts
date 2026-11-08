import mongoose, { type Model, type InferSchemaType } from "mongoose";

/**
 * Mirrors the production `suppliers` collection used by the admin workspace so
 * partner self-registrations from the commercial website appear alongside
 * staff-created shops. Field set verified against the live document in
 * `hair2harvest_db.suppliers`. `status` is a free string (default "pending")
 * rather than an enum, so a web registration is never rejected by an unknown
 * enum value.
 */
const supplierSchema = new mongoose.Schema(
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

export const Supplier: Model<SupplierDoc> =
  (mongoose.models.Supplier as Model<SupplierDoc>) ??
  mongoose.model<SupplierDoc>("Supplier", supplierSchema, "suppliers");

export interface RegistrationInput {
  name: string;
  contact: string;
  mobile: string;
  countryCode?: string;
  barangay: string;
  visit?: string;
  consent: boolean;
}

/** Best-effort mapping of the localized "best time to visit" label. */
function operatingHoursFromVisit(visit?: string): {
  days: string;
  open: string;
  close: string;
} {
  const v = (visit ?? "").toLowerCase();
  if (v.includes("9") && v.includes("11") && (v.includes("morning") || v.includes("umaga"))) {
    return { days: "Mon-Sat", open: "09:00", close: "11:00" };
  }
  if (v.includes("2") && v.includes("4") && (v.includes("afternoon") || v.includes("hapon"))) {
    return { days: "Mon-Sat", open: "14:00", close: "16:00" };
  }
  if (v.includes("8") && v.includes("9") && (v.includes("closing") || v.includes("magsara"))) {
    return { days: "Mon-Sat", open: "20:00", close: "21:00" };
  }
  return { days: "Mon-Sat", open: "", close: "" };
}

/** Create a Supplier from a partner-registration payload (status: pending). */
export async function createSupplierFromRegistration(b: RegistrationInput) {
  const last = await Supplier.findOne().sort({ code: -1 }).lean<{ code?: string }>();
  const n = last?.code ? Number(String(last.code).replace(/\D/g, "")) + 1 : 1;
  const pad = String(n).padStart(2, "0");
  const phone = `${b.countryCode ?? "+63"}${b.mobile}`.replace(/\s+/g, "");
  const now = new Date();

  return Supplier.create({
    code: `S-${pad}`,
    shopCode: `WEB-${pad}`,
    shopName: b.name,
    owner: b.contact,
    phone,
    email: "",
    barangay: b.barangay,
    street: "",
    operatingHours: operatingHoursFromVisit(b.visit),
    pickupFrequency: "weekly",
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
    unit: null,
  });
}
