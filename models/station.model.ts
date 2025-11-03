import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    location: { type: String },
    contact_number: { type: String },
    officer_in_charge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Station ||
  mongoose.model("Station", stationSchema);
