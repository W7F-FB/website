import { F1MatchData } from "@/types/opta-feeds/f1-fixtures"

export function mapOptaFixture(match: F1MatchData) {
  const home = match.TeamData[0]?.Side === "Home" ? match.TeamData[0] : match.TeamData[1]
  const away = match.TeamData[0]?.Side === "Away" ? match.TeamData[0] : match.TeamData[1]

  let startTime = ""
  if (match.MatchInfo?.Date) {
    const dateStr = match.MatchInfo.Time 
      ? `${match.MatchInfo.Date}T${match.MatchInfo.Time}`
      : `${match.MatchInfo.Date}T00:00:00`
    const parsed = new Date(dateStr)
    if (!isNaN(parsed.getTime())) {
      startTime = parsed.toISOString()
    }
  }

  return {
    id: match.uID,
    startTime,
    status: match.MatchInfo?.Period || "PreMatch",
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

