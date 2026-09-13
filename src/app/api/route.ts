import { NextResponse } from "next/server";

/** GET /api — liveness/health probe. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "olymp-ex",
    time: new Date().toISOString(),
  });
}
