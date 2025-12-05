import { isFilled } from "@prismicio/client";
import { normalizeOptaId } from "@/lib/opta/utils";
import type { TournamentDocument, MatchDocument } from "../../prismicio-types";

export function buildMatchUrl(tournamentSlug: string, matchSlug: string): string {
  return `/tournament/${tournamentSlug}/match/${matchSlug}`;
}

export function buildMatchSlugMap(tournament: TournamentDocument): Map<string, string> {
  const map = new Map<string, string>();
  
  if (!tournament.data.matches) return map;
  
  for (const item of tournament.data.matches) {
    if (!isFilled.contentRelationship(item.match)) continue;
    
    const matchData = item.match.data;
    const matchUid = item.match.uid;
    
    if (matchData && matchUid && matchData.opta_id) {
      const normalizedOptaId = normalizeOptaId(matchData.opta_id);
      map.set(normalizedOptaId, matchUid);
    }
  }
  
  return map;
}

export function buildMatchSlugMapFromMatches(matches: MatchDocument[]): Map<string, string> {
  const map = new Map<string, string>();
  
  for (const match of matches) {
    if (match.data.opta_id && match.uid) {
      const normalizedOptaId = normalizeOptaId(match.data.opta_id);
      map.set(normalizedOptaId, match.uid);
    }
  }
  
  return map;
}

