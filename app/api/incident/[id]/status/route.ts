import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Incident from "@/models/incident.model";
import mongoose from "mongoose";

const ALLOWED = [
  "OPEN",
  "IN-PROGRESS",
  "ASSIGNED",
  "RESOLVED",
  "CLOSED",
] as const;
type Status = (typeof ALLOWED)[number];

type LeanIncident = {
  _id?: any;
  id?: string;
  incidentId?: string;
  status?: string;
  date?: string | Date;
  createdAt?: string | Date;
  [k: string]: any;
};

export async function PATCH(req: Request, { params }: { params: any }) {
  // `params` is a Promise in some Next.js versions — unwrap it safely
  let routeParams: any = {};
  try {
    routeParams = await params;
  } catch {
    // ignore — we'll fall back to body.id if needed
  }

  // allow id to come from route params or body for extra safety
  const body = await req.json().catch(() => ({}));
  const bodyId = (body?.id ?? body?.incidentId ?? null) as string | null;

  const rawId = (routeParams?.id ?? bodyId) as string | undefined;

  try {
    const { status } = body ?? {};

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        { message: "Missing status in request body" },
        { status: 400 }
      );
    }

    const statusUpper = status.toString().toUpperCase();
    if (!ALLOWED.includes(statusUpper as Status)) {
      return NextResponse.json(
        { message: `Invalid status. Allowed: ${ALLOWED.join(", ")}` },
        { status: 400 }
      );
    }

    if (!rawId) {
      return NextResponse.json(
        { message: "No id provided in route or body" },
        { status: 400 }
      );
    }

    await connect();

    // Build a robust query that tries multiple match strategies:
    const orClauses: any[] = [];

    // 1. ObjectId match (only if valid hex)
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      try {
        orClauses.push({ _id: new mongoose.Types.ObjectId(rawId) });
      } catch {
        // ignore
      }
    }

    // 2. string match on _id
    orClauses.push({ _id: rawId });

    // 3. incidentId or id custom fields
    orClauses.push({ incidentId: rawId });
    orClauses.push({ id: rawId });

    const query = { $or: orClauses };

    // Debug logging (remove or reduce in production)
    console.log(
      "PATCH /api/incident/:id/status — tried id:",
      rawId,
      "orClauses:",
      orClauses
    );

    const updated = (await Incident.findOneAndUpdate(
      query,
      { $set: { status: statusUpper } },
      { new: true, runValidators: true }
    ).lean()) as LeanIncident | null;

    if (!updated) {
      return NextResponse.json(
        { message: "Incident not found for given id", tried: orClauses },
        { status: 404 }
      );
    }

    const normalized = {
      ...updated,
      id: updated.id ?? updated.incidentId ?? updated._id ?? null,
      status: (updated.status ?? "").toString(),
      date: updated.date
        ? new Date(updated.date).toISOString()
        : updated.createdAt
        ? new Date(updated.createdAt).toISOString()
        : null,
    };

    return NextResponse.json(
      { message: "Status updated", incident: normalized },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PATCH /api/incident/:id/status error:", err);
    return NextResponse.json(
      { message: "Server error", error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
