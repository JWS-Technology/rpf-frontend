import { connect } from "@/dbconfig/db";
import Device from "@/models/device.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();
    const device_token = formData.get("device_token");
    console.log(device_token)
    const newDeviceToken = new Device({device_token});
    console.log(newDeviceToken);
    return NextResponse.json(
      { message: "message successfully sent", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { message: "failed in device", success: false },
      { status: 200 }
    );
  }
}
