import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * A barbershop is a record, not a user. There is no password field and no
 * reference to a user account anywhere in this document — by design.
 */
const shopSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    channel: {
      type: String,
      enum: ["SMS", "Messenger", "Viber", "Call"],
      default: "SMS",
    },
    barangay: { type: String, required: true },
    address: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    inPilotArea: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Candidate", "Enrolled", "Paused", "Withdrawn"],
      default: "Candidate",
      index: true,
    },

    pickupRule: {
      frequency: {
        type: String,
        enum: ["Nightly", "Twice weekly", "Weekly", "Custom"],
        default: "Twice weekly",
      },
      days: { type: [String], default: ["Tue", "Fri"] },
      window: { type: String, default: "After closing · 8–9 PM" },
      access: { type: String, default: "" },
      peakDay: { type: Boolean, default: false },
    },

    consent: {
      given: { type: Boolean, default: false },
      on: { type: Date },
      explainedBy: { type: String, default: "" },
      photoPermission: { type: Boolean, default: false },
    },

    registeredBy: { type: String, default: "" },
    totalNetKg: { type: Number, default: 0 },
    pickupCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

shopSchema.index({ name: "text", barangay: "text", code: "text" });

export type ShopDoc = InferSchemaType<typeof shopSchema>;
export const Shop = model("Shop", shopSchema);
