// models/Officer.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOfficer extends Document {
  officerId: string;
  name: string;
  phone_number: string;
  role: string;
  station: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfficerSchema: Schema<IOfficer> = new Schema(
  {
    officerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    role: { type: String, required: true },
    station: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Officer: Model<IOfficer> =
  mongoose.models.Officer || mongoose.model("Officer", OfficerSchema);
