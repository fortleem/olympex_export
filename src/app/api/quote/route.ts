import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quoteSchema } from "@/lib/quote-schema";

/**
 * POST /api/quote — store an RFQ submission from the Olymp Ex contact form.
 * Validates the payload with the shared zod schema and persists it via Prisma.
 */
export async function POST(req: Request) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.issues
        .map((issue) => ({ field: issue.path.join("."), message: issue.message }));
      return NextResponse.json(
        { ok: false, message: "Validation failed", errors: fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const record = await db.quoteRequest.create({
      data: {
        company: data.company,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        product: data.product,
        format: data.format,
        volume: data.volume,
        destination: data.destination,
        packaging: data.packaging || null,
        shipmentDate: data.shipmentDate || null,
        message: data.message || null,
      },
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (error) {
    console.error("[api/quote] failed to store RFQ:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
