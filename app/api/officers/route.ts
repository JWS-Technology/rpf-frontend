import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Officer from "@/models/user.model";

export async function POST(req: Request) {
  try {
    await connect();
    const data = await req.json();

    const officer = await Officer.create(data);
    return NextResponse.json({
      message: "Officer created successfully",
      officer,
    });
  } catch (error: any) {
    console.error("Error creating officer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connect();
  const officers = await Officer.find();
  return NextResponse.json(officers);
}
