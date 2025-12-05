import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import type { TeamDocument } from "@/../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import { calculateTeamRecordsFromMatches } from "@/app/(website)/(subpages)/tournament/utils"
import { PlayerMiniStatTable } from "@/components/blocks/players/player-mini-stat.table"
import { GradientBg } from "@/components/ui/gradient-bg"
import { cn } from "@/lib/utils"

type TeamSnapshotProps = {
    prismicTeam?: TeamDocument | null
    fixtures?: F1FixturesResponse | null
    className?: string
    recordBased?: boolean
}

export function TeamSnapshot({ prismicTeam, fixtures, className, recordBased }: TeamSnapshotProps) {
    const teamLogo = prismicTeam?.data?.logo?.url || undefined
    const primaryColor = prismicTeam?.data?.color_primary || undefined
    const teamName = prismicTeam?.data?.name || ""
    const teamOptaId = prismicTeam?.data?.opta_id
    const teamId = teamOptaId ? `t${teamOptaId}` : null

    const teamRecords = useMemo(() =>
        calculateTeamRecordsFromMatches(fixtures?.SoccerFeed?.SoccerDocument?.MatchData),
        [fixtures]
    )

    const teamRecord = teamId ? teamRecords.get(teamId) : null
    const wins = teamRecord?.wins ?? 0
    const losses = teamRecord?.losses ?? 0
    const gamesPlayed = wins + losses
    const goalsFor = teamRecord?.goalsFor ?? 0
    const goalsAgainst = teamRecord?.goalsAgainst ?? 0
    const record = `${wins}-${losses}`

    const statValues = teamRecord ? [
        { label: "GP", value: String(gamesPlayed) },
        { label: "G", value: String(goalsFor) },
        { label: "GA", value: String(goalsAgainst) }
    ] : []

    return (
        <div className={cn(
            "relative overflow-hidden border border-border/50",
            className
        )}>
            <GradientBg
                className="w-[300%] aspect-square absolute bottom-0 right-0"
                overlayColor="oklch(0.1949 0.0274 260.031)"
                accentColor={primaryColor || "#0c224a"}
                shadowColor="oklch(0.1949 0.0274 260.031)"
                accentOpacity={0.4}
            />
            {recordBased && teamLogo && (
                <div className="absolute -top-16 -left-16 w-48 h-48 opacity-10">
                    <Image
                        src={teamLogo}
                        alt={`${teamName} logo`}
                        fill
                        className="object-contain"
                        sizes="1000px"
                    />
                </div>
            )}
            <div className="relative h-full">
                <div className="flex flex-col items-center justify-between gap-3 py-6 px-4 h-full">
                    {recordBased ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-4">
                            {record && (
                                <>
                                    <span className="font-headers text-muted-foreground text-xs font-medium uppercase -mt-8">W-L</span>
                                    <span className="font-headers text-5xl font-medium tracking-widest flex items-center justify-center">
                                        <span className="w-[1ch] text-right">{wins}</span>
                                        <span>-</span>
                                        <span className="w-[1ch] text-left">{losses}</span>
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            {teamLogo && (
                                <Link
                                    href={prismicTeam?.uid ? `/club/${prismicTeam.uid}` : "#"}
                                    className="relative w-16 h-16 flex-shrink-0 hover:opacity-80 transition-opacity"
                                >
                                    <Image
                                        src={teamLogo}
                                        alt={`${teamName} logo`}
                                        fill
                                        className="object-contain"
                                        sizes="100px"
                                    />
                                </Link>
                            )}
                            <div className="text-center space-y-1">
                                <span className="font-headers text-sm font-bold block">
                                    {teamName}
                                </span>
                                {record && (
                                    <span className="text-muted-foreground text-sm block">
                                        {record}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    {statValues.length > 0 && (
                        <PlayerMiniStatTable
                            className={cn(
                                "w-full",
                                recordBased && "[&_th]:text-xs [&_td]:text-xl"
                            )}
                            statDisplays={statValues}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

