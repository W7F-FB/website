import { NextRequest, NextResponse } from "next/server";
import { getPlayerByOptaId } from "@/cms/queries/players";

export async function GET(request: NextRequest) {
  const optaId = request.nextUrl.searchParams.get("optaId");
  
  if (!optaId) {
    return NextResponse.json({ error: "Missing optaId parameter" }, { status: 400 });
  }

  const player = await getPlayerByOptaId(optaId);
  const headshotUrl = player?.data.headshot?.url || null;

  return NextResponse.json({ headshotUrl });
}

