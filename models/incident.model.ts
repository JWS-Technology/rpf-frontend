import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    issue_type: { type: String, required: true },
    phone_number: { type: String, default: "nill" },
    station: { type: String },
    status: {
      type: String,
      enum: ["OPEN", "IN-PROGRESS", "ASSIGNED", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },
    audio_url: { type: String },
    officer: { type: String },
    action_time: { type: String },
  },
  { timestamps: true }
);

const Incident =
  mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

export default Incident;
