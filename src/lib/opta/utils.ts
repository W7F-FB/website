import type { F1MatchInfo, F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F13Message } from "@/types/opta-feeds/f13-commentary"
import { isSubstitutionMessage } from "@/types/opta-feeds/f13-commentary"

export function normalizeOptaId(id: string): string {
  if (id.startsWith('t') || id.startsWith('g') || id.startsWith('p')) {
    return id.slice(1)
  }
  return id
}

export function getStatusDisplay(matchInfo: F1MatchInfo): string {
  const status = matchInfo.Period === 'FullTime' ? 'Played' :
    matchInfo.Period === 'PreMatch' ? 'Scheduled' :
    matchInfo.Period === 'Live' ? 'In Progress' :
    matchInfo.Period === 'Postponed' ? 'Postponed' :
    matchInfo.Period === 'Abandoned' ? 'Abandoned' :
    matchInfo.Period === 'Cancelled' ? 'Cancelled' :
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

export function groupSubstitutions(messages: F13Message[]): F13Message[] {
  const result: F13Message[] = []
  let i = 0

  while (i < messages.length) {
    const currentMessage = messages[i]

    if (!isSubstitutionMessage(currentMessage)) {
      result.push(currentMessage)
      i++
      continue
    }

    const substitutionGroup: F13Message[] = [currentMessage]
    const teamRefRaw = currentMessage.team_ref1 || currentMessage.team_ref2
    const teamRef = teamRefRaw ? normalizeOptaId(String(teamRefRaw)) : null
    let j = i + 1

    while (j < messages.length && isSubstitutionMessage(messages[j])) {
      const nextTeamRefRaw = messages[j].team_ref1 || messages[j].team_ref2
      const nextTeamRef = nextTeamRefRaw ? normalizeOptaId(String(nextTeamRefRaw)) : null
      if (nextTeamRef === teamRef && teamRef !== null) {
        substitutionGroup.push(messages[j])
        j++
      } else {
        break
      }
    }

    if (substitutionGroup.length > 1) {
      const combinedComment = combineSubstitutionTexts(substitutionGroup.map(msg => msg.comment))
      const groupedMessage: F13Message = {
        ...substitutionGroup[0],
        comment: combinedComment,
      }
      result.push(groupedMessage)
    } else {
      result.push(currentMessage)
    }

    i = j
  }

  return result
}

function combineSubstitutionTexts(comments: string[]): string {
  if (comments.length === 0) return ''
  if (comments.length === 1) return comments[0]

  const cleanedComments = comments.map(comment => removeW7F(comment).trim())

  if (cleanedComments.length === 2) {
    return `${cleanedComments[0]} y ${cleanedComments[1]}`
  }

  const allButLast = cleanedComments.slice(0, -1)
  const last = cleanedComments[cleanedComments.length - 1]
  
  return `${allButLast.join(', ')}, y ${last}`
}
