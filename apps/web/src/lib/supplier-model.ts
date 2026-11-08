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
  street?: string;
  unit?: string;
  frequency?: string;
  startTime?: string;
  endTime?: string;
  consent: boolean;
}

/**
 * Map the partner's pickup rules onto the stored `operatingHours` window and a
 * normalized `pickupFrequency`. The form sends a readable frequency label
 * ("Weekly" / "Twice a Week" / "Nightly"); we normalize it to a stable key and
 * derive a friendly `days` summary.
 */
function operatingHoursFromPickup(
  frequency?: string,
  start?: string,
  end?: string,
): { days: string; open: string; close: string; pickupFrequency: string } {
  const f = (frequency ?? "").trim();
  let pickupFrequency = "weekly";
  let days = "";
  if (/nightly/i.test(f)) {
    pickupFrequency = "nightly";
    days = "Mon-Sat (night)";
  } else if (/twice/i.test(f)) {
    pickupFrequency = "twice-weekly";
    days = "Mon-Sat (2x)";
  } else if (/weekly/i.test(f)) {
    pickupFrequency = "weekly";
    days = "Mon-Sat";
  }
  return { days, open: (start ?? "").trim(), close: (end ?? "").trim(), pickupFrequency };
}

/** Create a Supplier from a partner-registration payload (status: pending). */
export async function createSupplierFromRegistration(b: RegistrationInput) {
  const last = await Supplier.findOne().sort({ code: -1 }).lean<{ code?: string }>();
  const n = last?.code ? Number(String(last.code).replace(/\D/g, "")) + 1 : 1;
  const pad = String(n).padStart(2, "0");
  const phone = `${b.countryCode ?? "+63"}${b.mobile}`.replace(/\s+/g, "");
  const now = new Date();
  const { days, open, close, pickupFrequency } = operatingHoursFromPickup(
    b.frequency,
    b.startTime,
    b.endTime,
  );

  return Supplier.create({
    code: `S-${pad}`,
    shopCode: `WEB-${pad}`,
    shopName: b.name,
    owner: b.contact,
    phone,
    email: "",
    barangay: b.barangay,
    street: b.street ?? "",
    operatingHours: { days, open, close },
    pickupFrequency,
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
    unit: b.unit ? b.unit : null,
  });
}
