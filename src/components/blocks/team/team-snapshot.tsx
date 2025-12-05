import Image from "next/image"
import type { TeamDocument } from "@/../prismicio-types"
import type { F3TeamRecord } from "@/types/opta-feeds/f3-standings"
import { PlayerMiniStatTable } from "@/components/blocks/players/player-mini-stat.table"
import { GradientBg } from "@/components/ui/gradient-bg"
import { cn } from "@/lib/utils"

type TeamSnapshotProps = {
    prismicTeam?: TeamDocument | null
    f3Standing?: F3TeamRecord | null
    record?: string | null
    className?: string
}

export function TeamSnapshot({ prismicTeam, f3Standing, record, className }: TeamSnapshotProps) {
    const teamLogo = prismicTeam?.data?.logo?.url || undefined
    const primaryColor = prismicTeam?.data?.color_primary || undefined
    const teamName = prismicTeam?.data?.name || ""

    const statValues = f3Standing ? [
        { label: "GP", value: String(f3Standing.Standing.Played) },
        { label: "G", value: String(f3Standing.Standing.For) },
        { label: "GA", value: String(f3Standing.Standing.Against) }
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
            <div className="relative h-full">
                <div className="flex flex-col items-center justify-between gap-3 py-6 px-4 h-full">
                    <div className="flex flex-col items-center gap-3">
                        {teamLogo && (
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                    src={teamLogo}
                                    alt={`${teamName} logo`}
                                    fill
                                    className="object-contain"
                                    sizes="100px"
                                />
                            </div>
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
                    {statValues.length > 0 && (
                        <PlayerMiniStatTable
                            className="w-full"
                            statDisplays={statValues}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

