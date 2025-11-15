import type { F1MatchInfo, F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"

export function normalizeOptaId(id: string): string {
  if (id.startsWith('t') || id.startsWith('g')) {
    return id.slice(1)
  }
  return id
}

export function getStatusDisplay(matchInfo: F1MatchInfo): string {
  const status = matchInfo.Period === 'FullTime' ? 'Played' :
    matchInfo.Period === 'PreMatch' ? 'Scheduled' :
      'In Progress'

  if (status === "Scheduled") return ""
  if (status === "In Progress") return "Live"
  if (status === "Played") {
    const hasWinner = matchInfo.MatchWinner || matchInfo.GameWinner
    if (hasWinner && matchInfo.GameWinnerType) {
      if (matchInfo.GameWinnerType === "AfterExtraTime") {
        return "AET"
      }
      if (matchInfo.GameWinnerType === "ShootOut") {
        return "FT/PKs"
      }
    }
    return "FT"
  }
  return status
}

export function getMatchTeams(fixture: F1MatchData, optaTeams: F1TeamData[]): F1TeamData[] {
  const homeTeamData = fixture.TeamData.find(t => t.Side === "Home")
  const awayTeamData = fixture.TeamData.find(t => t.Side === "Away")

  const homeTeamRef = normalizeOptaId(homeTeamData?.TeamRef || "")
  const awayTeamRef = normalizeOptaId(awayTeamData?.TeamRef || "")

  const homeOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === homeTeamRef)
  const awayOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === awayTeamRef)

  const result: F1TeamData[] = []
  if (homeOptaTeam) result.push(homeOptaTeam)
  if (awayOptaTeam) result.push(awayOptaTeam)
  
  return result
}

export function removeW7F(text: string): string {
  return text
    .replace(/\s*W7F\s+2/g, ' 2')
    .replace(/\s*W7F(?=[.,;:!?\)])/g, '')
    .replace(/\s*W7F\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?\)])/g, '$1')
    .replace(/,([^\s])/g, ', $1')
    .trim()
}
