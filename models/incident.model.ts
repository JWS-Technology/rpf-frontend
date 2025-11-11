import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    issue_type: { type: String, required: true },
    phone_number: { type: String, default: "nill" },
    station: { type: String },
    audio_url: {type: String},
  },
  { timestamps: true }
);

const Incident =
  mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

export default Incident;
// import mongoose from "mongoose";

// const incidentSchema = new mongoose.Schema(
//   {
//     issue_type: { type: String, required: true },
//     // description: { type: String },
//     phone_number: { type: String, default: "nill" },
//     station: { type: String },
//     audio_url: {type: String},
//     // location: { type: String },
//     // status: {
//     //   type: String,
//     //   enum: ["Pending", "In-Progress", "Resolved"],
//     //   default: "Pending",
//     // },
//     // assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     // priority: {
//     //   type: String,
//     //   enum: ["Low", "Medium", "High"],
//     //   default: "Medium",
//     // },
//   },
//   { timestamps: true }
// );

// const Incident =
//   mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

// export default Incident;
