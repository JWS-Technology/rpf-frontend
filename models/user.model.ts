import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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

export default mongoose.models.User || mongoose.model("User", userSchema);
