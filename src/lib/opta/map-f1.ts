import { F1MatchData } from "@/types/opta-feeds/f1-fixtures"

export function mapOptaFixture(match: F1MatchData) {
  const home = match.TeamData.find(t => t.Side === "Home")
  const away = match.TeamData.find(t => t.Side === "Away")

  let startTime = ""
  if (match.MatchDate) {
    const cleaned = match.MatchDate
      .replace("T000000", "T00:00:00")
      .replace(" ", "T")
    const parsed = new Date(cleaned)
    if (!isNaN(parsed.getTime())) {
      startTime = parsed.toISOString()
    }
  }

  return {
    id: match.MatchID,
    startTime,
    status: match.MatchStatus || "Scheduled",
    home: {
      id: home?.TeamRef || "",
      score: home?.Score ?? null,
    },
    away: {
      id: away?.TeamRef || "",
      score: away?.Score ?? null,
    },
  }
}

