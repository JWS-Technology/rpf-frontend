import { connect } from "@/dbconfig/db";
import Device from "@/models/device.model";
import Incident from "@/models/incident.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const incidentList = await Incident.find();
    const latestDevice = await Device.findOne().sort({ createdAt: -1 });

    // console.log(latestDevice.device_token);

    // // If you just want the token string from that latest device:
    // if (latestDevice) {
    //   console.log(latestDevice.device_token);
    // }

    return NextResponse.json(
      {
        message: "message successfully sent",
        success: true,
        incidents: incidentList,
      },
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
