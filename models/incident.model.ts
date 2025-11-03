import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    issue_type: { type: String, required: true },
    description: { type: String },
    station: { type: String },
    location: { type: String },
    phone_number: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In-Progress", "Resolved"],
      default: "Pending",
    },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Incident ||
  mongoose.model("Incident", incidentSchema);
