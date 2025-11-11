import { connect } from "@/dbconfig/db";
import Incident from "@/models/incident.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const incidentList = await Incident.find();
    return NextResponse.json(
      { message: "message successfully sent", success: true, incidents: incidentList },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { message: "failed in incident list", success: false },
      { status: 200 }
    );
  }
}
