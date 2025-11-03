import mongoose from "mongoose";

const responseLogSchema = new mongoose.Schema(
  {
    incident_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
    action_taken: { type: String },
    officer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status_update: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Response ||
  mongoose.model("Response", responseLogSchema);
