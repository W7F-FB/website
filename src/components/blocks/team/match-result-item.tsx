"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { H4 } from "@/components/website-base/typography"
import { useRouter } from "next/navigation"
import { PrismicNextImage } from "@prismicio/next"
import Link from "next/link"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import { normalizeOptaId } from "@/lib/opta/utils"
import { buildMatchUrl } from "@/lib/match-url"
import { cn, formatGameDate } from "@/lib/utils"
import { getF9GameCardData, getF1GameCardData } from "@/components/blocks/match/utils"
import { Status, StatusIndicator } from "@/components/ui/status"

function getRoundTypeLabel(roundType?: string): string {
    if (!roundType) return ""
    if (roundType === "Semi-Finals") return "Semifinals"
    if (roundType === "3rd and 4th Place") return "Third place match"
    if (roundType === "Final") return "Final"
    return ""
}

type Props = {
    fixture: F1MatchData
    prismicTeams: TeamDocument[]
    optaTeams: F1TeamData[]
    f9Feed?: F9MatchResponse
    tournamentSlug?: string
    matchSlugMap?: Map<string, string>
    currentTeamOptaId: string
}

export function MatchResultItem({
    fixture,
    prismicTeams,
    optaTeams,
    f9Feed,
    tournamentSlug,
    matchSlugMap,
    currentTeamOptaId
}: Props) {
    const router = useRouter()
    
    // Use F9 data if available, otherwise fall back to F1
    const gameCardData = f9Feed 
        ? getF9GameCardData(f9Feed, prismicTeams, optaTeams) 
        : null
    const finalData = gameCardData || getF1GameCardData(fixture, prismicTeams, optaTeams)

    const {
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        homeIsWinning,
        awayIsWinning,
        isFinal,
        isLive,
        matchTime,
        startTime,
        isPenalties,
        isExtraTime,
    } = finalData

    // Determine which team is "current" and which is "opponent"
    const normalizedCurrentId = normalizeOptaId(currentTeamOptaId)
    const isCurrentTeamHome = homeTeam?.data.opta_id === normalizedCurrentId
    const _isCurrentTeamAway = awayTeam?.data.opta_id === normalizedCurrentId
    
    const _currentTeam = isCurrentTeamHome ? homeTeam : awayTeam
    const opponentTeam = isCurrentTeamHome ? awayTeam : homeTeam
    
    const currentScore = isCurrentTeamHome ? homeScore : awayScore
    const opponentScore = isCurrentTeamHome ? awayScore : homeScore
    
    const isWin = isFinal && (isCurrentTeamHome ? homeIsWinning : awayIsWinning)
    const isLoss = isFinal && (isCurrentTeamHome ? awayIsWinning : homeIsWinning)
    const _isDraw = isFinal && !homeIsWinning && !awayIsWinning

    // Get opponent name from various sources
    const opponentOptaTeam = optaTeams.find(t => {
        const teamRef = normalizeOptaId(t.TeamRef || t.uID)
        return teamRef === opponentTeam?.data.opta_id
    })
    const opponentName = opponentTeam?.data.name || opponentOptaTeam?.Name || opponentOptaTeam?.name || "Unknown"

    const matchSlug = matchSlugMap?.get(normalizeOptaId(fixture.uID))
    const matchUrl = tournamentSlug && matchSlug
        ? buildMatchUrl(tournamentSlug, matchSlug)
        : null

    const handleRowClick = () => {
        if (matchUrl) {
            router.push(matchUrl)
        }
    }

    const statusCell = (content: React.ReactNode, borderClass?: string) => (
        <TableCell className={cn("w-6 md:w-8 pl-2 pr-0 md:pl-3", borderClass && "border-l-2", borderClass)}>
            <span className="font-headers font-semibold text-xs md:text-sm">
                {content}
            </span>
        </TableCell>
    )

    const handleTeamLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const getFinalStatus = () => {
        if (!isFinal) return ""
        if (isPenalties) return "FT/PKs"
        if (isExtraTime) return "FT/OT"
        return "FT"
    }

    const opponentIdentity = (
        <>
            {opponentTeam?.data.logo && (
                <div className="relative w-5 h-5 md:w-7 md:h-7 shrink-0">
                    <PrismicNextImage field={opponentTeam.data.logo} fill className="object-contain" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <H4 className={cn("text-xs lg:text-sm truncate", opponentTeam?.uid && "group-hover:underline")}>
                    {opponentName}
                </H4>
                <div className="text-xs text-muted-foreground mt-0.5 truncate md:truncate-none">
                    {`${formatGameDate(startTime).month} ${formatGameDate(startTime).day}${getRoundTypeLabel(fixture.MatchInfo.RoundType) ? `, ${getRoundTypeLabel(fixture.MatchInfo.RoundType)}` : ''}${isFinal && getFinalStatus() ? `, ${getFinalStatus()}` : ''}`}
                </div>
            </div>
        </>
    )

    const opponentCell = (
        <TableCell className="min-w-0 px-2 md:px-4">
            <div className="flex items-center justify-start gap-2 w-fit md:gap-3">
                <span className="text-muted-foreground font-headers font-medium text-xxs md:text-xs shrink-0 hidden md:inline">vs</span>
                {opponentTeam?.uid ? (
                    <Link
                        href={`/club/${opponentTeam.uid}`}
                        className="flex items-center w-fit gap-2 md:gap-3 group min-w-0 flex-1"
                        onClick={handleTeamLinkClick}
                    >
                        {opponentIdentity}
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                        {opponentIdentity}
                    </div>
                )}
            </div>
        </TableCell>
    )

    const rowClassName = matchUrl ? "cursor-pointer hover:bg-muted/30 transition-colors" : ""

    // PreMatch state
    if (!isFinal && !isLive) {
        const { day, month } = formatGameDate(startTime)
        return (
            <TableRow className={rowClassName} onClick={handleRowClick}>
                <TableCell className="w-6 md:w-8 pl-2 pr-0 md:pl-3 border-l-2 border-muted/50">
                    <div className="flex flex-col items-center leading-none">
                        <span className="font-headers font-medium text-xs md:text-sm">{day}</span>
                        <span className="font-headers font-medium text-xxs md:text-xxs text-muted-foreground">{month}</span>
                    </div>
                </TableCell>
                <TableCell className="min-w-0 px-2 md:px-4 py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-muted-foreground font-headers font-medium text-xxs md:text-xs shrink-0 hidden md:inline">vs</span>
                        {opponentTeam?.uid ? (
                            <Link
                                href={`/club/${opponentTeam.uid}`}
                                className="flex items-center gap-2 md:gap-3 group min-w-0 flex-1"
                                onClick={handleTeamLinkClick}
                            >
                                {opponentTeam?.data.logo && (
                                    <div className="relative w-5 h-5 md:w-7 md:h-7 shrink-0">
                                        <PrismicNextImage field={opponentTeam.data.logo} fill className="object-contain" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <H4 className="text-xs lg:text-sm truncate group-hover:underline">
                                        {opponentName}
                                    </H4>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                {opponentTeam?.data.logo && (
                                    <div className="relative w-5 h-5 md:w-7 md:h-7 shrink-0">
                                        <PrismicNextImage field={opponentTeam.data.logo} fill className="object-contain" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <H4 className="text-xs lg:text-sm truncate">
                                        {opponentName}
                                    </H4>
                                </div>
                            </div>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right align-middle px-2 md:px-4">
                    <span className="text-xxs md:text-xs font-headers font-medium tracking-tight text-muted-foreground whitespace-nowrap">
                        {formatGameDate(startTime).time}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    // Live state
    if (isLive) {
        return (
            <TableRow className={rowClassName} onClick={handleRowClick}>
                <TableCell className="relative w-6 md:w-8 pl-2 pr-0 md:pl-3">
                    <div className="absolute -left-0.5 top-0 bottom-0 w-1 bg-destructive animate-pulse" />
                    <Status className="p-0 bg-transparent border-0">
                        <StatusIndicator className="text-destructive size-2.5" />
                        <span className="hidden font-headers font-semibold text-xs md:text-sm">
                            {matchTime !== null ? `'${matchTime}` : "—"}
                        </span>
                    </Status>
                </TableCell>
                {opponentCell}
                <TableCell className="text-right align-middle px-2 md:px-4">
                    <span className="text-xs md:text-sm font-headers font-semibold whitespace-nowrap">
                        {currentScore ?? 0}-{opponentScore ?? 0}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    // Final state
    if (isFinal) {
        const result = isWin ? "W" : isLoss ? "L" : "D"
        const borderClass = isWin ? "border-primary/70" : isLoss ? "border-destructive/70" : "border-secondary/70"
        const textClass = isWin ? "text-primary" : isLoss ? "text-destructive" : ""

        return (
            <TableRow className={rowClassName} onClick={handleRowClick}>
                {statusCell(<span className={textClass}>{result}</span>, borderClass)}
                {opponentCell}
                <TableCell className="text-right align-middle px-2 md:px-4">
                    <span className="text-xs md:text-sm font-headers font-semibold whitespace-nowrap">
                        {currentScore ?? 0}-{opponentScore ?? 0}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    // Unknown state fallback
    return (
        <TableRow className={rowClassName} onClick={handleRowClick}>
            {statusCell(<span className="text-muted-foreground">—</span>, "border-muted/30")}
            {opponentCell}
            <TableCell className="text-right align-middle px-2 md:px-4">
                <span className="text-xs font-headers text-muted-foreground uppercase">
                    —
                </span>
            </TableCell>
        </TableRow>
    )
}
