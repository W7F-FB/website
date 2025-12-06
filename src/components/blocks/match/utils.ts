import { normalizeOptaId } from "@/lib/opta/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import type { TeamDocument, MatchDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse, F9TeamData } from "@/types/opta-feeds/f9-match"
import { isFilled } from "@prismicio/client"

export interface GameCardData {
    homeTeam: TeamDocument | undefined
    awayTeam: TeamDocument | undefined
    homeTeamShortName: string | null
    awayTeamShortName: string | null
    homePlaceholderName: string | null
    awayPlaceholderName: string | null
    homeScore: number | null
    awayScore: number | null
    homeIsLosing: boolean
    awayIsLosing: boolean
    homeIsWinning: boolean
    awayIsWinning: boolean
    isFinal: boolean
    isLive: boolean
    isPenalties: boolean
    isExtraTime: boolean
    period: string | null
    matchTime: number | null
    startTime: string
    homeLogoUrl: string | null
    awayLogoUrl: string | null
    homeLogoAlt: string
    awayLogoAlt: string
}

export function getF9GameCardData(
    f9Feed: F9MatchResponse,
    prismicTeams: TeamDocument[],
    optaTeams: F1TeamData[]
): GameCardData | null {
    const soccerDoc = f9Feed?.SoccerFeed?.SoccerDocument
    if (!soccerDoc) return null
    
    const matchData = Array.isArray(soccerDoc) ? soccerDoc[0]?.MatchData : soccerDoc?.MatchData
    if (!matchData) return null

    const f9Teams = Array.isArray(matchData.TeamData) ? matchData.TeamData : [matchData.TeamData]
    const homeTeamData: F9TeamData | undefined = f9Teams.find(t => t?.Side === "Home")
    const awayTeamData: F9TeamData | undefined = f9Teams.find(t => t?.Side === "Away")

    if (!homeTeamData || !awayTeamData) return null

    const homeTeamRef = normalizeOptaId(homeTeamData.TeamRef)
    const awayTeamRef = normalizeOptaId(awayTeamData.TeamRef)

    const homeTeam = prismicTeams.find(t => t.data.opta_id === homeTeamRef)
    const awayTeam = prismicTeams.find(t => t.data.opta_id === awayTeamRef)

    const homeOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === homeTeamRef)
    const awayOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === awayTeamRef)

    const homeTeamShortName = homeOptaTeam?.ShortTeamName || homeOptaTeam?.ShortName || null
    const awayTeamShortName = awayOptaTeam?.ShortTeamName || awayOptaTeam?.ShortName || null

    const homePlaceholderName = !homeTeam && homeOptaTeam ? (homeOptaTeam.Name || homeOptaTeam.name || null) : null
    const awayPlaceholderName = !awayTeam && awayOptaTeam ? (awayOptaTeam.Name || awayOptaTeam.name || null) : null

    const homeScore = homeTeamData.Score ?? null
    const awayScore = awayTeamData.Score ?? null

    const period = matchData.MatchInfo?.Period || null
    const isFinal = period === "FullTime" || period === "FullTime90" || period === "FullTimePens"
    const isLive = !isFinal && period !== "PreMatch" && period !== null
    
    const resultType = matchData.MatchInfo?.Result?.Type
    const isPenalties = resultType === "PenaltyShootout" || period === "FullTimePens"
    const isExtraTime = resultType === "AfterExtraTime"
    
    const matchStats = Array.isArray(matchData.Stat) ? matchData.Stat : []
    const matchTimeStat = matchStats.find(s => s.Type === "match_time")
    const matchTime = matchTimeStat?.value ? Number(matchTimeStat.value) : null
    
    const winnerRef = matchData.MatchInfo?.Result?.MatchWinner || matchData.MatchInfo?.Result?.Winner
    
    // Determine winner - use winnerRef if available, otherwise fall back to score comparison
    const hasWinnerRef = winnerRef !== undefined && winnerRef !== null
    const homeWinsByRef = hasWinnerRef && winnerRef === homeTeamData.TeamRef
    const awayWinsByRef = hasWinnerRef && winnerRef === awayTeamData.TeamRef
    const homeWinsByScore = !hasWinnerRef && homeScore !== null && awayScore !== null && homeScore > awayScore
    const awayWinsByScore = !hasWinnerRef && homeScore !== null && awayScore !== null && awayScore > homeScore

    const homeIsWinning = isFinal && (homeWinsByRef || homeWinsByScore)
    const awayIsWinning = isFinal && (awayWinsByRef || awayWinsByScore)
    const homeIsLosing = isFinal && awayIsWinning
    const awayIsLosing = isFinal && homeIsWinning

    const dateUtc = matchData.MatchInfo?.DateUtc
    const startTime = dateUtc 
        ? (dateUtc.includes('T') ? dateUtc : dateUtc.replace(' ', 'T') + 'Z')
        : matchData.MatchInfo?.Date || ''

    const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
    const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
    const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : ""
    const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : ""

    return {
        homeTeam,
        awayTeam,
        homeTeamShortName,
        awayTeamShortName,
        homePlaceholderName,
        awayPlaceholderName,
        homeScore,
        awayScore,
        homeIsLosing,
        awayIsLosing,
        homeIsWinning,
        awayIsWinning,
        isFinal,
        isLive,
        isPenalties,
        isExtraTime,
        period,
        matchTime,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    }
}

export function getF1GameCardData(
    fixture: F1MatchData,
    prismicTeams: TeamDocument[],
    optaTeams: F1TeamData[]
): GameCardData {
    const homeTeamData = fixture.TeamData.find(t => t.Side === "Home")
    const awayTeamData = fixture.TeamData.find(t => t.Side === "Away")

    const homeTeamRef = normalizeOptaId(homeTeamData?.TeamRef || "")
    const awayTeamRef = normalizeOptaId(awayTeamData?.TeamRef || "")

    const homeTeam = prismicTeams.find(t => t.data.opta_id === homeTeamRef)
    const awayTeam = prismicTeams.find(t => t.data.opta_id === awayTeamRef)

    const homeOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === homeTeamRef)
    const awayOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === awayTeamRef)

    const homeTeamShortName = homeOptaTeam?.ShortTeamName || homeOptaTeam?.ShortName || null
    const awayTeamShortName = awayOptaTeam?.ShortTeamName || awayOptaTeam?.ShortName || null

    const homePlaceholderName = !homeTeam && homeOptaTeam ? (homeOptaTeam.Name || homeOptaTeam.name || null) : null
    const awayPlaceholderName = !awayTeam && awayOptaTeam ? (awayOptaTeam.Name || awayOptaTeam.name || null) : null

    const homeScore = homeTeamData?.Score ?? null
    const awayScore = awayTeamData?.Score ?? null

    const winnerRef = fixture.MatchInfo.GameWinner || fixture.MatchInfo.MatchWinner
    const winnerType = fixture.MatchInfo.GameWinnerType
    const period = fixture.MatchInfo.Period || null
    const isFinal = period === "FullTime"
    const isLive = !isFinal && period !== "PreMatch" && period !== null
    const isPenalties = winnerType === "ShootOut"
    const isExtraTime = winnerType === "AfterExtraTime"

    const f1Stats = Array.isArray(fixture.Stat) ? fixture.Stat : []
    const matchTimeStat = f1Stats.find(s => s.Type === "match_time")
    const matchTime = matchTimeStat?.value ? Number(matchTimeStat.value) : null

    // Determine winner - use winnerRef if available, otherwise fall back to score comparison
    const hasWinnerRef = winnerRef !== undefined && winnerRef !== null
    const homeWinsByRef = hasWinnerRef && winnerRef === homeTeamData?.TeamRef
    const awayWinsByRef = hasWinnerRef && winnerRef === awayTeamData?.TeamRef
    const homeWinsByScore = !hasWinnerRef && homeScore !== null && awayScore !== null && homeScore > awayScore
    const awayWinsByScore = !hasWinnerRef && homeScore !== null && awayScore !== null && awayScore > homeScore

    const homeIsWinning = isFinal && (homeWinsByRef || homeWinsByScore)
    const awayIsWinning = isFinal && (awayWinsByRef || awayWinsByScore)
    const homeIsLosing = isFinal && awayIsWinning
    const awayIsLosing = isFinal && homeIsWinning

    const startTime = fixture.MatchInfo.DateUtc 
        ? fixture.MatchInfo.DateUtc.replace(' ', 'T') + 'Z' 
        : fixture.MatchInfo.Date

    const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
    const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
    const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : ""
    const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : ""

    return {
        homeTeam,
        awayTeam,
        homeTeamShortName,
        awayTeamShortName,
        homePlaceholderName,
        awayPlaceholderName,
        homeScore,
        awayScore,
        homeIsLosing,
        awayIsLosing,
        homeIsWinning,
        awayIsWinning,
        isFinal,
        isLive,
        isPenalties,
        isExtraTime,
        period,
        matchTime,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    }
}

export interface PrismicGameCardData {
    homeTeam: TeamDocument | undefined
    awayTeam: TeamDocument | undefined
    homeTeamShortName: string | null
    awayTeamShortName: string | null
    startTime: string
    homeLogoUrl: string | null
    awayLogoUrl: string | null
    homeLogoAlt: string
    awayLogoAlt: string
}

export function getPrismicGameCardData(prismicMatch: MatchDocument): PrismicGameCardData {
    const hasHomeTeam = isFilled.contentRelationship(prismicMatch.data.home_team) && prismicMatch.data.home_team.data
    const hasAwayTeam = isFilled.contentRelationship(prismicMatch.data.away_team) && prismicMatch.data.away_team.data
    
    const homeTeam = hasHomeTeam ? prismicMatch.data.home_team as unknown as TeamDocument : undefined
    const awayTeam = hasAwayTeam ? prismicMatch.data.away_team as unknown as TeamDocument : undefined

    const homeTeamShortName = homeTeam?.data?.key || null
    const awayTeamShortName = awayTeam?.data?.key || null

    const startTime = prismicMatch.data.start_time || "2025-01-01T00:00:00Z"

    const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
    const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
    const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : (prismicMatch.data.home_team_name_override || "")
    const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : (prismicMatch.data.away_team_name_override || "")

    return {
        homeTeam,
        awayTeam,
        homeTeamShortName,
        awayTeamShortName,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    }
}

export function formatGameTime(dateString: string, timeOnly: boolean = false): string {
    try {
        const date = new Date(dateString)
        
        if (timeOnly) {
            const formatter = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            return formatter.format(date)
        }
        
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()

        if (isToday) {
            const formatter = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            return `Today, ${formatter.format(date)}`
        } else {
            const formatter = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            return formatter.format(date)
        }
    } catch {
        return dateString
    }
}
