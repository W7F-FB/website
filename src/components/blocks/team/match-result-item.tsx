"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { H4 } from "@/components/website-base/typography"
import { useRouter } from "next/navigation"
import { PrismicNextImage } from "@prismicio/next"
import Link from "next/link"
import type { TeamDocument, TournamentDocument } from "../../../../prismicio-types"
import type { F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import { normalizeOptaId } from "@/lib/opta/utils"
import { buildMatchUrl } from "@/lib/match-url"
import { cn } from "@/lib/utils"

function formatMatchDate(date: string, roundType?: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })

    if (!roundType) return formattedDate

    let matchType = ""
    if (roundType === "Semi-Finals") {
        matchType = "Semifinals"
    } else if (roundType === "3rd and 4th Place") {
        matchType = "Third place match"
    } else if (roundType === "Final") {
        matchType = "Final"
    }

    return matchType ? `${formattedDate}, ${matchType}` : formattedDate
}

function formatMatchTime(date: string): string {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

function formatDateStacked(date: string): { day: string; month: string } {
    const d = new Date(date)
    return {
        day: d.getDate().toString(),
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    }
}

type Props = {
    match: F1MatchData
    teamOptaRef: string
    opponentTeam?: TeamDocument
    opponentName: string
    currentTournament?: TournamentDocument | null
    matchSlugMap?: Map<string, string>
}

export function MatchResultItem({
    match,
    teamOptaRef,
    opponentTeam,
    opponentName,
    currentTournament,
    matchSlugMap
}: Props) {
    const router = useRouter()
    const period = match.MatchInfo.Period
    const teamData = match.TeamData.find(t => t.TeamRef === teamOptaRef)
    const opponentData = match.TeamData.find(t => t.TeamRef !== teamOptaRef)

    const teamScore = teamData?.Score ?? 0
    const opponentScore = opponentData?.Score ?? 0

    const gameWinner = match.MatchInfo.GameWinner || match.MatchInfo.MatchWinner
    const isWin = gameWinner === teamOptaRef
    const isLoss = gameWinner === opponentData?.TeamRef

    const matchSlug = matchSlugMap?.get(normalizeOptaId(match.uID))
    const matchUrl = currentTournament && matchSlug
        ? buildMatchUrl(currentTournament.uid, matchSlug)
        : null

    const handleRowClick = () => {
        if (matchUrl) {
            router.push(matchUrl)
        }
    }

    const statusCell = (content: React.ReactNode, borderClass?: string, centered?: boolean) => (
        <TableCell className={cn("w-6 md:w-8 pl-2 pr-0 md:pl-3", borderClass && "border-l-2", borderClass, centered && "text-center")}>
            <span className="font-headers font-semibold text-xs md:text-sm ">
                {content}
            </span>
        </TableCell>
    )

    const handleTeamLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation()
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
                    {formatMatchDate(match.MatchInfo.Date, match.MatchInfo.RoundType)}
                </div>
            </div>
        </>
    )

    const opponentCell = (
        <TableCell className="min-w-0 px-2 md:px-4">
            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-muted-foreground font-headers font-medium text-xxs md:text-xs shrink-0 hidden md:inline">vs</span>
                {opponentTeam?.uid ? (
                    <Link
                        href={`/club/${opponentTeam.uid}`}
                        className="flex items-center gap-2 md:gap-3 group min-w-0 flex-1"
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

    if (period === "PreMatch") {
        const { day, month } = formatDateStacked(match.MatchInfo.Date)
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
                        {formatMatchTime(match.MatchInfo.Date)}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    if (period === "Live") {
        const matchMinute = match.Stat?.find(stat => stat.Type === "match_time")?.value;
        return (
            <TableRow className={rowClassName} onClick={handleRowClick}>
                <TableCell className="relative w-6 md:w-8 pl-2 pr-0 md:pl-3">
                    <div className="absolute -left-0.5 top-0 bottom-0 w-1 bg-destructive animate-pulse" />
                    <span className="font-headers font-semibold text-xs md:text-sm ">
                        {matchMinute ? `'${matchMinute}` : "—"}
                    </span>
                </TableCell>
                {opponentCell}
                <TableCell className="text-right align-middle px-2 md:px-4">
                    <span className="text-xs md:text-sm font-headers font-semibold whitespace-nowrap">
                        {teamScore}-{opponentScore}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    if (period === "FullTime") {
        const result = isWin ? "W" : isLoss ? "L" : "D"
        const borderClass = isWin ? "border-primary/70" : isLoss ? "border-destructive/70" : "border-secondary/70"
        const textClass = isWin ? "text-primary" : isLoss ? "text-destructive" : ""

        return (
            <TableRow className={rowClassName} onClick={handleRowClick}>
                {statusCell(<span className={textClass}>{result}</span>, borderClass)}
                {opponentCell}
                <TableCell className="text-right align-middle px-2 md:px-4">
                    <span className="text-xs md:text-sm font-headers font-semibold whitespace-nowrap">
                        {teamScore}-{opponentScore}
                    </span>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <TableRow className={rowClassName} onClick={handleRowClick}>
            {statusCell(<span className="text-muted-foreground">—</span>, "border-muted/30")}
            {opponentCell}
            <TableCell className="text-right align-middle px-2 md:px-4">
                <span className="text-xs font-headers text-muted-foreground uppercase">
                    {period}
                </span>
            </TableCell>
        </TableRow>
    )
}
