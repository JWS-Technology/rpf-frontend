import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Incident from "@/models/incident.model";

export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    await connect();
    const { dutyStaff, action_time, incidentId } = await req.json();
    console.log(dutyStaff, action_time, incidentId);

    const updated = await Incident.findByIdAndUpdate(
      incidentId,
      {
        $set: {
          officer: dutyStaff,
          action_time: action_time,
        },
      },
      { new: true }
    );
    console.log(updated);
    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/incident/:id/status error:", err);
    return NextResponse.json(
      {
        message: "Server error",
        error: "error in server update staff and time",
      },
      { status: 500 }
    );
  }
}
