import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    device_token: { type: String },
  },
  { timestamps: true }
);

const Device =
  mongoose.models.Device || mongoose.model("Device", deviceSchema);

export default Device;