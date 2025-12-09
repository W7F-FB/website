import { normalizeOptaId } from "@/lib/opta/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import type { TeamDocument, MatchDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse, F9TeamData } from "@/types/opta-feeds/f9-match"
import { isFilled } from "@prismicio/client"

export const LIVE_PERIODS = [
    "FirstHalf", "SecondHalf", "HalfTime",
    "ExtraFirstHalf", "ExtraSecondHalf", "ExtraHalfTime",
    "ShootOut", "FullTime90", "FullTimePens"
] as const

export interface WinnerResult {
    homeIsWinning: boolean
    awayIsWinning: boolean
    homeIsLosing: boolean
    awayIsLosing: boolean
}

export function determineWinner(
    isFinal: boolean,
    homeScore: number | null,
    awayScore: number | null,
    winnerRef?: string | null,
    homeTeamRef?: string,
    awayTeamRef?: string,
    isPenalties?: boolean,
    homeShootOutScore?: number | null,
    awayShootOutScore?: number | null
): WinnerResult {
    if (!isFinal) {
        return { homeIsWinning: false, awayIsWinning: false, homeIsLosing: false, awayIsLosing: false }
    }

    const hasWinnerRef = winnerRef !== undefined && winnerRef !== null
    const homeWinsByRef = hasWinnerRef && (winnerRef === homeTeamRef || winnerRef === "Home")
    const awayWinsByRef = hasWinnerRef && (winnerRef === awayTeamRef || winnerRef === "Away")
    
    let homeWinsByScore = false
    let awayWinsByScore = false
    
    if (!hasWinnerRef) {
        if (isPenalties && homeShootOutScore !== undefined && awayShootOutScore !== undefined && homeShootOutScore !== null && awayShootOutScore !== null) {
            homeWinsByScore = homeShootOutScore > awayShootOutScore
            awayWinsByScore = awayShootOutScore > homeShootOutScore
        } else if (homeScore !== null && awayScore !== null) {
            homeWinsByScore = homeScore > awayScore
            awayWinsByScore = awayScore > homeScore
        }
    }

    const homeIsWinning = homeWinsByRef || homeWinsByScore
    const awayIsWinning = awayWinsByRef || awayWinsByScore
    const homeIsLosing = awayIsWinning
    const awayIsLosing = homeIsWinning

    return { homeIsWinning, awayIsWinning, homeIsLosing, awayIsLosing }
}

export function getWinnerTeamRef(
    homeScore: number | null,
    awayScore: number | null,
    homeTeamRef?: string,
    awayTeamRef?: string,
    winnerRef?: string | null
): string | null {
    if (winnerRef) return winnerRef
    if (homeScore === null || awayScore === null) return null
    if (homeScore > awayScore && homeTeamRef) return homeTeamRef
    if (awayScore > homeScore && awayTeamRef) return awayTeamRef
    return null
}

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
    liveMinute: string | null
    startTime: string
    homeLogoUrl: string | null
    awayLogoUrl: string | null
    homeLogoAlt: string
    awayLogoAlt: string
}

export function getF9GameCardData(
    f9Feed: F9MatchResponse,
    prismicTeams: TeamDocument[],
    optaTeams: F1TeamData[],
    liveMinute: string | null = null
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
    const postMatch = matchData.MatchInfo?.PostMatch
    const isFinal = period === "FullTime" || (postMatch !== undefined && (postMatch === 1 || postMatch === "1"))
    const isLive = !isFinal && period !== null && LIVE_PERIODS.includes(period as typeof LIVE_PERIODS[number])
    
    const resultType = matchData.MatchInfo?.Result?.Type
    const hasShootOutScores = (homeTeamData.ShootOutScore !== undefined && homeTeamData.ShootOutScore !== null) || 
                              (awayTeamData.ShootOutScore !== undefined && awayTeamData.ShootOutScore !== null)
    const isPenalties = resultType === "PenaltyShootout" || 
                       period === "FullTimePens" || 
                       hasShootOutScores
    const isExtraTime = resultType === "AfterExtraTime"
    
    const matchStats = Array.isArray(matchData.Stat) ? matchData.Stat : []
    const matchTimeStat = matchStats.find(s => s.Type === "match_time")
    const matchTime = matchTimeStat?.value ? Number(matchTimeStat.value) : null
    
    const winnerRef = matchData.MatchInfo?.Result?.MatchWinner || matchData.MatchInfo?.Result?.Winner
    const homeShootOutScore = homeTeamData.ShootOutScore ?? null
    const awayShootOutScore = awayTeamData.ShootOutScore ?? null
    const { homeIsWinning, awayIsWinning, homeIsLosing, awayIsLosing } = determineWinner(
        isFinal, homeScore, awayScore, winnerRef, homeTeamData.TeamRef, awayTeamData.TeamRef, isPenalties, homeShootOutScore, awayShootOutScore
    )

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
        liveMinute,
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
    optaTeams: F1TeamData[],
    liveMinute: string | null = null
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
    const isLive = period !== null && LIVE_PERIODS.includes(period as typeof LIVE_PERIODS[number])
    const isPenalties = winnerType === "ShootOut"
    const isExtraTime = winnerType === "AfterExtraTime"

    const f1Stats = Array.isArray(fixture.Stat) ? fixture.Stat : []
    const matchTimeStat = f1Stats.find(s => s.Type === "match_time")
    const matchTime = matchTimeStat?.value ? Number(matchTimeStat.value) : null

    const homeShootOutScore = ('PenaltyScore' in (homeTeamData || {}) ? (homeTeamData as unknown as Record<string, unknown>).PenaltyScore as number | null | undefined : null) ?? null
    const awayShootOutScore = ('PenaltyScore' in (awayTeamData || {}) ? (awayTeamData as unknown as Record<string, unknown>).PenaltyScore as number | null | undefined : null) ?? null
    const { homeIsWinning, awayIsWinning, homeIsLosing, awayIsLosing } = determineWinner(
        isFinal, homeScore, awayScore, winnerRef, homeTeamData?.TeamRef, awayTeamData?.TeamRef, isPenalties, homeShootOutScore, awayShootOutScore
    )

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
        liveMinute,
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
