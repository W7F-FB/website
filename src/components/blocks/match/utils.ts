import { normalizeOptaId } from "@/lib/opta/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import type { TeamDocument, MatchDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData, F1TeamMatchData } from "@/types/opta-feeds/f1-fixtures"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import { isFilled } from "@prismicio/client"
import { resolvePlaceholderTeam } from "@/app/(website)/(subpages)/tournament/utils"

export interface OptaGameCardData {
    homeTeamData: F1TeamMatchData | undefined
    awayTeamData: F1TeamMatchData | undefined
    homeTeamRef: string
    awayTeamRef: string
    homeTeam: TeamDocument | undefined
    awayTeam: TeamDocument | undefined
    homeOptaTeam: F1TeamData | undefined
    awayOptaTeam: F1TeamData | undefined
    homeTeamShortName: string | null
    awayTeamShortName: string | null
    homePlaceholderName: string | null
    awayPlaceholderName: string | null
    homeScore: number | null
    awayScore: number | null
    winnerRef: string | undefined
    isPKGame: boolean
    isFinal: boolean
    homeIsLosing: boolean
    awayIsLosing: boolean
    homeIsWinning: boolean
    awayIsWinning: boolean
    startTime: string
    homeLogoUrl: string | null
    awayLogoUrl: string | null
    homeLogoAlt: string
    awayLogoAlt: string
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

export function getOptaGameCardData(
    fixture: F1MatchData,
    prismicTeams: TeamDocument[],
    optaTeams: F1TeamData[],
    allMatches?: F1MatchData[],
    f3StandingsData?: F3StandingsResponse | null
): OptaGameCardData {
    const homeTeamData = fixture.TeamData.find(t => t.Side === "Home")
    const awayTeamData = fixture.TeamData.find(t => t.Side === "Away")

    const homeTeamRefRaw = homeTeamData?.TeamRef || ""
    const awayTeamRefRaw = awayTeamData?.TeamRef || ""

    const resolvedHomeRef = resolvePlaceholderTeam(homeTeamRefRaw, allMatches, f3StandingsData || null, optaTeams)
    const resolvedAwayRef = resolvePlaceholderTeam(awayTeamRefRaw, allMatches, f3StandingsData || null, optaTeams)

    const homeTeamRefToUse = resolvedHomeRef || homeTeamRefRaw
    const awayTeamRefToUse = resolvedAwayRef || awayTeamRefRaw

    const homeTeamRef = normalizeOptaId(homeTeamRefToUse)
    const awayTeamRef = normalizeOptaId(awayTeamRefToUse)

    const homeTeam = prismicTeams.find(t => t.data.opta_id === homeTeamRef)
    const awayTeam = prismicTeams.find(t => t.data.opta_id === awayTeamRef)

    const homeOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === normalizeOptaId(homeTeamRefToUse))
    const awayOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === normalizeOptaId(awayTeamRefToUse))

    const homeTeamShortName = homeOptaTeam?.ShortTeamName || homeOptaTeam?.ShortName || null
    const awayTeamShortName = awayOptaTeam?.ShortTeamName || awayOptaTeam?.ShortName || null

    const homePlaceholderName = !homeTeam && homeOptaTeam ? (homeOptaTeam.Name || homeOptaTeam.name || null) : null
    const awayPlaceholderName = !awayTeam && awayOptaTeam ? (awayOptaTeam.Name || awayOptaTeam.name || null) : null

    const homeScore = homeTeamData?.Score ?? null
    const awayScore = awayTeamData?.Score ?? null

    const winnerRef = fixture.MatchInfo.GameWinner || fixture.MatchInfo.MatchWinner
    const isPKGame = fixture.MatchInfo.GameWinnerType === "ShootOut"
    const isFinal = fixture.MatchInfo.Period === "FullTime"

    const homeIsWinning = isFinal && winnerRef === homeTeamData?.TeamRef
    const awayIsWinning = isFinal && winnerRef === awayTeamData?.TeamRef
    const homeIsLosing = isFinal && winnerRef !== undefined && !homeIsWinning
    const awayIsLosing = isFinal && winnerRef !== undefined && !awayIsWinning

    const startTime = fixture.MatchInfo.DateUtc ? fixture.MatchInfo.DateUtc.replace(' ', 'T') + 'Z' : fixture.MatchInfo.Date

    const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
    const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
    const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : ""
    const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : ""

    return {
        homeTeamData,
        awayTeamData,
        homeTeamRef,
        awayTeamRef,
        homeTeam,
        awayTeam,
        homeOptaTeam,
        awayOptaTeam,
        homeTeamShortName,
        awayTeamShortName,
        homePlaceholderName,
        awayPlaceholderName,
        homeScore,
        awayScore,
        winnerRef,
        isPKGame,
        isFinal,
        homeIsLosing,
        awayIsLosing,
        homeIsWinning,
        awayIsWinning,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    }
}

export function getPrismicGameCardData(prismicMatch: MatchDocument): PrismicGameCardData {
    const hasHomeTeam = isFilled.contentRelationship(prismicMatch.data.home_team) && prismicMatch.data.home_team.data
    const hasAwayTeam = isFilled.contentRelationship(prismicMatch.data.away_team) && prismicMatch.data.away_team.data
    
    const homeTeam = hasHomeTeam ? prismicMatch.data.home_team as unknown as TeamDocument : undefined
    const awayTeam = hasAwayTeam ? prismicMatch.data.away_team as unknown as TeamDocument : undefined

    const homeTeamShortName = homeTeam?.data?.key || null
    const awayTeamShortName = awayTeam?.data?.key || null

    const startTime = prismicMatch.data.start_time || new Date().toISOString()

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
