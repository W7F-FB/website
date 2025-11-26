import { NextRequest, NextResponse } from "next/server";
import {
  ingestHighlight,
  HighlightIngestPayload,
} from "@/lib/supabase/hightlight-ingest";

export const runtime = "edge";
export const maxDuration = 300;

const PARTNER_SECRET = process.env.PARTNER_INGEST_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!PARTNER_SECRET) {
      return NextResponse.json(
        { error: "Server missing PARTNER_INGEST_SECRET" },
        { status: 500 }
      );
    }

    const secret = request.headers.get("x-partner-secret");
    if (!secret || secret !== PARTNER_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content-type. Expect application/json" },
        { status: 415 }
      );
    }

    const body = (await request.json()) as HighlightIngestPayload;

    const inserted = await ingestHighlight(body);

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (e) {
    console.error("Highlight ingest error:", e);

    if (e instanceof Error) {
      return NextResponse.json(
        { error: "Ingest failed", details: e.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error", details: String(e) },
      { status: 500 }
    );
  }
}

