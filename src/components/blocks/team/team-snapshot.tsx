import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import type { TeamDocument } from "@/../prismicio-types"
import type { TeamRecord } from "@/lib/v2-utils/records-from-f9"
import type { TeamStats } from "@/lib/v2-utils/team-stats-from-f9"
import { PlayerMiniStatTable } from "@/components/blocks/players/player-mini-stat.table"
import { GradientBg } from "@/components/ui/gradient-bg"
import { cn } from "@/lib/utils"

type TeamSnapshotProps = {
    prismicTeam?: TeamDocument | null
    teamRecords?: TeamRecord[]
    teamStats?: TeamStats[]
    className?: string
    recordBased?: boolean
}

export function TeamSnapshot({ prismicTeam, teamRecords = [], teamStats = [], className, recordBased }: TeamSnapshotProps) {
    const teamLogo = prismicTeam?.data?.logo?.url || undefined
    const primaryColor = prismicTeam?.data?.color_primary || undefined
    const teamName = prismicTeam?.data?.name || ""
    const teamOptaId = prismicTeam?.data?.opta_id

    const recordsMap = useMemo(() => {
        const map = new Map<string, { wins: number; losses: number }>()
        for (const record of teamRecords) {
            map.set(record.optaNormalizedTeamId, { wins: record.wins, losses: record.losses })
        }
        return map
    }, [teamRecords])

    const statsMap = useMemo(() => {
        const map = new Map<string, { gamesPlayed: number; goalsFor: number; goalsAgainst: number }>()
        for (const stat of teamStats) {
            map.set(stat.optaNormalizedTeamId, { 
                gamesPlayed: stat.gamesPlayed, 
                goalsFor: stat.goalsFor, 
                goalsAgainst: stat.goalsAgainst 
            })
        }
        return map
    }, [teamStats])

    const teamRecord = teamOptaId ? recordsMap.get(teamOptaId) : null
    const teamStat = teamOptaId ? statsMap.get(teamOptaId) : null
    const wins = teamRecord?.wins ?? 0
    const losses = teamRecord?.losses ?? 0
    const gamesPlayed = teamStat?.gamesPlayed ?? 0
    const goalsFor = teamStat?.goalsFor ?? 0
    const goalsAgainst = teamStat?.goalsAgainst ?? 0
    const record = `${wins}-${losses}`

    const statValues = teamStat ? [
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
