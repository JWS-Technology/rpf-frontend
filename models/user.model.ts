import mongoose, { Schema, model, models } from "mongoose";

const officerSchema = new Schema(
  {
    officerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone_number: { type: String },
    role: {
      type: String,
      enum: ["Admin", "Officer", "Dispatcher"],
      default: "Officer",
    },
    station: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Officer = models.Officer || model("Officer", officerSchema);
export default Officer;
