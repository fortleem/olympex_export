import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quoteSchema } from "@/lib/quote-schema";
import { clientIp, pruneRateLimits, rateLimit } from "@/lib/rate-limit";

/** 5 submissions per minute per client IP. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

/**
 * POST /api/quote — store an RFQ submission from the Olymp Ex contact form.
 *
 * Hardening:
 * - Per-IP rate limiting (429 + Retry-After when exceeded)
 * - Strict zod validation with length caps on every field
 * - Honeypot field (`website`): bots that fill it get a fake 201 and the
 *   payload is discarded
 */
export async function POST(req: Request) {
  try {
    // Rate limit first so abusive traffic never reaches validation or the DB.
    pruneRateLimits();
    const ip = clientIp(req);
    const rl = rateLimit(`quote:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many enquiries from this address. Please try again in a minute.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(rl.retryAfterSeconds, 1)),
          },
        },
      );
    }

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
    }

    // Hard cap the raw body size (defence-in-depth against oversized payloads).
    const raw = JSON.stringify(payload);
    if (raw.length > 10_000) {
      return NextResponse.json({ ok: false, message: "Payload too large" }, { status: 413 });
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

    // Honeypot tripped — silently accept and discard.
    if (data.website) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

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
