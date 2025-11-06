import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "message successfully sent", success: true },
    { status: 200 }
  );
}
