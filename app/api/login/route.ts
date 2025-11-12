// app/api/login/route.ts
import { connect } from "@/dbconfig/db";
import { Officer } from "@/models/Officer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { officerId, phone } = body;

    if (!officerId || !phone) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    await connect();

    const officer = await Officer.findOne({ officerId });

    if (!officer || officer.phone_number !== phone || !officer.isActive) {
      return NextResponse.json(
        { message: "Invalid credentials or inactive account" },
        { status: 401 }
      );
    }

    // ✅ Return officer data (safe)
    return NextResponse.json({ user: officer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
