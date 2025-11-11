import type { F1MatchInfo } from "@/types/opta-feeds/f1-fixtures"

export function normalizeOptaId(id: string): string {
  return id.startsWith('t') ? id.slice(1) : id
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

