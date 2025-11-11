import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Officer from "@/models/user.model"; 

export async function POST(req: Request) {
  try {
    await connect();
    const { officerId, password } = await req.json();

    if (!officerId || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const officer = await Officer.findOne({ officerId });

    if (!officer) {
      return NextResponse.json({ error: "Invalid Officer ID" }, { status: 404 });
    }

    if (officer.phone_number !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      officer: {
        officerId: officer.officerId,
        name: officer.name,
        role: officer.role,
        station: officer.station,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
