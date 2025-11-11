import { connect } from "@/dbconfig/db";
import Device from "@/models/device.model";
import { NextRequest, NextResponse } from "next/server";

// --- 1. DEFINE YOUR CORS HEADERS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// --- 2. ADD THE OPTIONS HANDLER (REQUIRED FOR CORS POST) ---
// This handles the "preflight" request and stops the 405 error
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// --- 3. YOUR EXACT POST FUNCTION (WITH HEADERS ADDED) ---
export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();
    const device_token = formData.get("device_token");
    console.log(device_token)
    const newDeviceToken = new Device({device_token});
    await newDeviceToken.save();
    console.log(newDeviceToken.device_token);
    return NextResponse.json(
      { message: "message successfully sent", success: true },
      { 
        status: 200,
        headers: corsHeaders // <-- Added headers
      }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { message: "failed in device", success: false },
      { 
        status: 200, // You might want to change this to 500 for an error
        headers: corsHeaders // <-- Added headers
      }
    );
  }
}