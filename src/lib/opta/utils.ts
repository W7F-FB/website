import type { F1MatchInfo, F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F13Message, F13Commentary } from "@/types/opta-feeds/f13-commentary"
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

function extractMinuteFromTime(time?: string, fallbackMinute?: number): number {
  if (time) {
    const match = time.match(/^(\d+)'?$/)
    if (match) {
      return parseInt(match[1], 10)
    }
  }
  
  return fallbackMinute ?? 0
}

function cleanSubstitutionText(text: string, teamName: string): string {
  let cleaned = removeW7F(text).trim()
  
  const escapedTeamName = teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const substitutionPrefixPattern = new RegExp(
    `^Substitution,?\\s*${escapedTeamName}\\.?\\s*`,
    'i'
  )
  cleaned = cleaned.replace(substitutionPrefixPattern, '')
  
  cleaned = cleaned.replace(/^Substitution,?\s*/i, '')
  
  const teamNamePrefixPattern = new RegExp(`^${escapedTeamName}[.,:\\s]+`, 'i')
  cleaned = cleaned.replace(teamNamePrefixPattern, '')
  
  cleaned = cleaned.replace(/\.\.+/g, '.')
  cleaned = cleaned.replace(/^[.,;:\s]+|[.,;:\s]+$/g, '')
  
  return cleaned.trim()
}

function getTeamName(teamRef: string, commentary: F13Commentary): string {
  const homeTeamId = String(commentary.home_team_id)
  const awayTeamId = String(commentary.away_team_id)
  
  const normalizedHomeId = normalizeOptaId(homeTeamId)
  const normalizedAwayId = normalizeOptaId(awayTeamId)
  
  if (teamRef === normalizedHomeId) {
    return commentary.home_team_name || 'Home Team'
  }
  
  if (teamRef === normalizedAwayId) {
    return commentary.away_team_name || 'Away Team'
  }
  
  return 'Team'
}

function formatSubstitutionGroup(substitutions: F13Message[], teamName: string): string {
  if (substitutions.length === 0) return ''
  
  const cleanedTexts = substitutions.map(msg => {
    const cleaned = cleanSubstitutionText(msg.comment, teamName)
    return cleaned.replace(/[.,;:]+\s*$/, '').trim()
  }).filter(text => text.length > 0)

  if (cleanedTexts.length === 0) return ''
  
  const substitutionsList = cleanedTexts.join(', ')
  return `Substitutions, ${teamName}: ${substitutionsList}.`
}

export function groupSubstitutions(messages: F13Message[], commentary: F13Commentary | null): F13Message[] {
  if (!commentary) return messages

  const substitutionMap = new Map<string, F13Message[]>()
  const processedSubstitutions = new Set<number>()

  for (const message of messages) {
    if (!isSubstitutionMessage(message)) {
      continue
    }

    const minute = extractMinuteFromTime(message.time, message.minute)
    const teamRefRaw = message.team_ref1 || message.team_ref2
    const teamRef = teamRefRaw ? normalizeOptaId(String(teamRefRaw)) : null

    if (!teamRef) {
      continue
    }

    const key = `${minute}-${teamRef}`
    
    if (!substitutionMap.has(key)) {
      substitutionMap.set(key, [])
    }
    
    substitutionMap.get(key)!.push(message)
  }

  const result: F13Message[] = []

  for (const message of messages) {
    if (!isSubstitutionMessage(message)) {
      result.push(message)
      continue
    }

    if (processedSubstitutions.has(message.id)) {
      continue
    }

    const minute = extractMinuteFromTime(message.time, message.minute)
    const teamRefRaw = message.team_ref1 || message.team_ref2
    const teamRef = teamRefRaw ? normalizeOptaId(String(teamRefRaw)) : null

    if (!teamRef) {
      result.push(message)
      continue
    }

    const key = `${minute}-${teamRef}`
    const substitutionGroup = substitutionMap.get(key)

    if (substitutionGroup && substitutionGroup.length > 0) {
      const teamName = getTeamName(teamRef, commentary)
      const combinedComment = formatSubstitutionGroup(substitutionGroup, teamName)
      
      const groupedMessage: F13Message = {
        ...substitutionGroup[0],
        comment: combinedComment,
      }
      
      result.push(groupedMessage)
      
      substitutionGroup.forEach(msg => processedSubstitutions.add(msg.id))
    } else {
      result.push(message)
    }
  }

  return result
}
