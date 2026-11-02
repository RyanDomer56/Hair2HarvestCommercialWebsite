import { Schema, model, type InferSchemaType } from "mongoose";

/** Four roles. There is no Supplier role — shops never log in. */
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Staff", "Operator", "Researcher"],
      required: true,
      index: true,
    },
    twoFactorEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
