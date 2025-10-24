import { F1MatchData } from "@/types/opta-feeds/f1-fixtures"

export function mapOptaFixture(match: F1MatchData) {
  const home = match.TeamData.find(t => t.Side === "Home")
  const away = match.TeamData.find(t => t.Side === "Away")

  return {
    id: match.MatchID,
    startTime: match.MatchDate,
    status: match.MatchStatus,
    home: {
      id: home?.TeamRef.replace("t", "") || "",
      score: home?.Score ?? null,
    },
    away: {
      id: away?.TeamRef.replace("t", "") || "",
      score: away?.Score ?? null,
    },
  }
}
