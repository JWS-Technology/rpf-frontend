import { connect } from "@/dbconfig/db";
import Device from "@/models/device.model";
import { NextRequest, NextResponse } from "next/server";

// --- 1. DEFINE YOUR CORS HEADERS ---
// These headers will be used for both OPTIONS and POST
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows all origins
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allows POST and OPTIONS
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allows these headers
};

// --- 2. HANDLE PREFLIGHT (OPTIONS) REQUESTS ---
// Flutter/browsers will send this first to check if POST is allowed
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204, // 204 No Content
    headers: corsHeaders,
  });
}

// --- 3. YOUR EXISTING POST HANDLER (NOW WITH CORS HEADERS) ---
export async function POST(req: NextRequest) {
  try {
    await connect();
    
    const formData = await req.formData();
    const device_token = formData.get("device_token") as string;

    if (!device_token) {
      return NextResponse.json(
        { message: "device_token is required", success: false },
        { status: 400, headers: corsHeaders } // Add headers
      );
    }

    const existingDevice = await Device.findOne({ device_token: device_token });

    if (existingDevice) {
      console.log("Device token already registered:", device_token);
      return NextResponse.json(
        { message: "Device already registered", success: true },
        { status: 200, headers: corsHeaders } // Add headers
      );
    }

    console.log("Registering new device token:", device_token);
    const newDeviceToken = new Device({ device_token: device_token });
    await newDeviceToken.save(); // Save to MongoDB

    return NextResponse.json(
      { message: "Device registered successfully", success: true },
      { status: 200, headers: corsHeaders } // Add headers
    );

  } catch (error) {
    console.log("Error in /api/device/route.ts:", error);
    return NextResponse.json(
      { message: "Failed to register device", success: false },
      { status: 500, headers: corsHeaders } // Add headers
    );
  }
}