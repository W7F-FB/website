import { supabase } from "../client";

export type MatchHighlight = {
  id: number;
  video_url: string;
  thumbnail_url: string;
  title: string | null;
};

function convertToSupabaseMatchId(optaMatchId: string): string {
  const numericId = optaMatchId.replace(/^g/, "");
  return `worldsevensfootball_${numericId}`;
}

export async function getHighlightsByMatchId(optaMatchId: string): Promise<MatchHighlight[]> {
  const supabaseMatchId = convertToSupabaseMatchId(optaMatchId);
  
  const { data, error } = await supabase
    .from("Match Highlights")
    .select("id, video_url, thumbnail_url, title")
    .eq("opta_match_id", supabaseMatchId)
    .eq("status", "ready")
    .order("duration_seconds", { ascending: false, nullsFirst: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getMatchRecap(optaMatchId: string): Promise<MatchHighlight | null> {
  const supabaseMatchId = convertToSupabaseMatchId(optaMatchId);
  
  const { data, error } = await supabase
    .from("Match Highlights")
    .select("id, video_url, thumbnail_url, title")
    .eq("opta_match_id", supabaseMatchId)
    .eq("status", "ready")
    .gt("duration_seconds", 60)
    .order("duration_seconds", { ascending: false, nullsFirst: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getRecapVideosForMatches(optaMatchIds: string[]): Promise<Map<string, MatchHighlight>> {
  const supabaseMatchIds = optaMatchIds.map(convertToSupabaseMatchId);
  
  const { data, error } = await supabase
    .from("Match Highlights")
    .select("id, video_url, thumbnail_url, title, opta_match_id, duration_seconds")
    .in("opta_match_id", supabaseMatchIds)
    .eq("status", "ready")
    .gt("duration_seconds", 60)
    .order("duration_seconds", { ascending: false, nullsFirst: false });

  if (error || !data) {
    return new Map();
  }

  const recapMap = new Map<string, MatchHighlight>();
  
  for (const highlight of data) {
    const numericId = highlight.opta_match_id.replace("worldsevensfootball_", "");
    if (!recapMap.has(numericId)) {
      recapMap.set(numericId, {
        id: highlight.id,
        video_url: highlight.video_url,
        thumbnail_url: highlight.thumbnail_url,
        title: highlight.title,
      });
    }
  }

  return recapMap;
}

