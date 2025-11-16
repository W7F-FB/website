import { normalizeOptaId } from "@/lib/opta/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData, F1TeamMatchData } from "@/types/opta-feeds/f1-fixtures"

export interface GameCardData {
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

export function getGameCardData(
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

    const homeScore = homeTeamData?.Score ?? null
    const awayScore = awayTeamData?.Score ?? null

    const winnerRef = fixture.MatchInfo.GameWinner || fixture.MatchInfo.MatchWinner
    const isPKGame = fixture.MatchInfo.GameWinnerType === "ShootOut"
    const isFinal = fixture.MatchInfo.Period === "FullTime"

    const homeIsWinning = isFinal && winnerRef === homeTeamData?.TeamRef
    const awayIsWinning = isFinal && winnerRef === awayTeamData?.TeamRef
    const homeIsLosing = isFinal && winnerRef !== undefined && !homeIsWinning
    const awayIsLosing = isFinal && winnerRef !== undefined && !awayIsWinning

    const startTime = fixture.MatchInfo.Date

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

