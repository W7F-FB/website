import type { F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import type { MatchDocument } from "../../../../../prismicio-types"
import { isFilled } from "@prismicio/client"

export function getGroupStageMatches(matches: F1MatchData[] | undefined) {
    if (!matches) return []
    return matches.filter(match => match.MatchInfo.RoundType === "Round")
}

export function getSemiFinalMatches(matches: F1MatchData[] | undefined) {
    if (!matches) return []
    return matches.filter(match => match.MatchInfo.RoundType === "Semi-Finals")
}

export function getThirdPlaceMatch(matches: F1MatchData[] | undefined) {
    if (!matches) return []
    return matches.filter(match => match.MatchInfo.RoundType === "3rd and 4th Place")
}

export function getFinalMatch(matches: F1MatchData[] | undefined) {
    if (!matches) return []
    return matches.filter(match => match.MatchInfo.RoundType === "Final")
}

export function groupMatchesByDate(matches: F1MatchData[] | undefined) {
    if (!matches) return new Map<string, F1MatchData[]>()
    
    const grouped = new Map<string, F1MatchData[]>()
    
    matches.forEach((match) => {
        const dateStr = match.MatchInfo.Date.split(' ')[0]
        if (!grouped.has(dateStr)) {
            grouped.set(dateStr, [])
        }
        grouped.get(dateStr)?.push(match)
    })
    
    const sorted = new Map<string, F1MatchData[]>()
    
    for (const [date, dateMatches] of grouped.entries()) {
        const sortedMatches = [...dateMatches].sort((a, b) => {
            const dateA = new Date(a.MatchInfo.Date)
            const dateB = new Date(b.MatchInfo.Date)
            return dateA.getTime() - dateB.getTime()
        })
        sorted.set(date, sortedMatches)
    }
    
    return new Map([...sorted.entries()].sort((a, b) => a[0].localeCompare(b[0])))
}

export function formatMatchDayDate(date: string) {
    const dateObj = new Date(date)
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
    const month = dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    const day = dateObj.getUTCDate()
    return `${weekday}, ${month} ${day}`
}

export interface TeamRecord {
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    points: number
}

export function calculateTeamRecordsFromMatches(
    matches: F1MatchData[] | undefined,
    groupId?: number
): Map<string, TeamRecord> {
    const records = new Map<string, TeamRecord>()
    
    if (!matches) return records
    
    const filteredMatches = groupId !== undefined
        ? matches.filter(
            match => match.MatchInfo.RoundType === "Round" && Number(match.MatchInfo.GroupName) === groupId
          )
        : matches
    
    filteredMatches.forEach(match => {
        const homeTeam = match.TeamData?.[0]
        const awayTeam = match.TeamData?.[1]
        
        if (!homeTeam || !awayTeam) return
        
        const homeRef = homeTeam.TeamRef
        const awayRef = awayTeam.TeamRef
        const homeScore = homeTeam.Score || 0
        const awayScore = awayTeam.Score || 0
        
        if (!records.has(homeRef)) {
            records.set(homeRef, { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
        }
        if (!records.has(awayRef)) {
            records.set(awayRef, { wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })
        }
        
        const homeRecord = records.get(homeRef)!
        const awayRecord = records.get(awayRef)!
        
        homeRecord.goalsFor += homeScore
        homeRecord.goalsAgainst += awayScore
        awayRecord.goalsFor += awayScore
        awayRecord.goalsAgainst += homeScore
        
        const gameWinner = match.MatchInfo.GameWinner || match.MatchInfo.MatchWinner
        
        if (gameWinner === homeRef) {
            homeRecord.wins++
            homeRecord.points += 3
            awayRecord.losses++
        } else if (gameWinner === awayRef) {
            awayRecord.wins++
            awayRecord.points += 3
            homeRecord.losses++
        } else {
            homeRecord.draws++
            homeRecord.points++
            awayRecord.draws++
            awayRecord.points++
        }
    })
    
    return records
}

export function getPrismicMatches(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return matches.filter(match => isFilled.contentRelationship(match.data.home_team) && isFilled.contentRelationship(match.data.away_team))
}

export function getGroupStageMatchesPrismic(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return matches.filter(match => 
        match.data.stage === "Group Stage" &&
        isFilled.contentRelationship(match.data.home_team) && 
        isFilled.contentRelationship(match.data.away_team)
    )
}

export function getSemiFinalMatchesPrismic(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return matches.filter(match => 
        match.data.stage === "Knockout Stage" &&
        (match.data.knockout_stage_match_type === "Group 1 Semifinal" || 
         match.data.knockout_stage_match_type === "Group 2 Semifinal")
    )
}

export function getThirdPlaceMatchPrismic(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return matches.filter(match => 
        match.data.stage === "Knockout Stage" &&
        match.data.knockout_stage_match_type === "Third Place Match"
    )
}

export function getFinalMatchPrismic(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return matches.filter(match => 
        match.data.stage === "Knockout Stage" &&
        match.data.knockout_stage_match_type === "Final"
    )
}

export function groupMatchesByDatePrismic(matches: MatchDocument[] | undefined) {
    if (!matches) return new Map<string, MatchDocument[]>()
    
    const grouped = new Map<string, MatchDocument[]>()
    
    matches.forEach((match) => {
        if (!match.data.start_time) return
        
        const date = new Date(match.data.start_time)
        const etDateStr = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            timeZone: 'America/New_York'
        })
        const [month, day, year] = etDateStr.split('/')
        const dateKey = `${year}-${month}-${day}`
        
        if (!grouped.has(dateKey)) {
            grouped.set(dateKey, [])
        }
        grouped.get(dateKey)?.push(match)
    })
    
    const sorted = new Map<string, MatchDocument[]>()
    
    for (const [date, dateMatches] of grouped.entries()) {
        const sortedMatches = [...dateMatches].sort((a, b) => {
            const dateA = new Date(a.data.start_time || 0)
            const dateB = new Date(b.data.start_time || 0)
            return dateA.getTime() - dateB.getTime()
        })
        sorted.set(date, sortedMatches)
    }
    
    return new Map([...sorted.entries()].sort((a, b) => a[0].localeCompare(b[0])))
}

export function sortMatchesByNumber(matches: MatchDocument[] | undefined) {
    if (!matches) return []
    return [...matches].sort((a, b) => {
        const numA = a.data.match_number || 0
        const numB = b.data.match_number || 0
        return numA - numB
    })
}
