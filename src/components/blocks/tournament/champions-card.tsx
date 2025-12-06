import { Card } from "@/components/ui/card"
import { H2, H3 } from "@/components/website-base/typography"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F3StandingsResponse } from "@/types/opta-feeds/f3-standings"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChampionIcon } from "@/components/website-base/icons"
import { GradientBg } from "@/components/ui/gradient-bg"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { normalizeOptaId } from "@/lib/opta/utils"

type Props = {
    f3StandingsData: F3StandingsResponse | null
    prismicTeams: TeamDocument[]
    overlayColor?: string
    accentColor?: string
    shadowColor?: string
}

export function ChampionsCard({ f3StandingsData, prismicTeams, overlayColor, accentColor, shadowColor }: Props) {
    const allTeamRecords = f3StandingsData?.SoccerFeed?.SoccerDocument?.Competition?.TeamStandings?.flatMap(
        standings => standings.TeamRecord || []
    ) || []
    
    const championRecord = allTeamRecords.find(record => record.Standing?.Position === 1)
    const championTeamRef = championRecord ? normalizeOptaId(championRecord.TeamRef) : null
    const champion = championTeamRef ? prismicTeams.find(t => t.data.opta_id === championTeamRef) : null
    
    const championLogo = champion ? getImageUrl(champion.data.logo) : null
    const championLogoAlt = champion ? getImageAlt(champion.data.logo) : ""

    return (
        <Card className={cn("py-12 px-8 text-center bg-card/50 border-border/50 gap-0 relative flex flex-col items-center justify-center overflow-hidden")}>
            <GradientBg
                className="inset-0 opacity-20"
                overlayColor={overlayColor}
                accentColor={accentColor}
                shadowColor={shadowColor}
            />
            <ChampionIcon className="hidden absolute -bottom-24 opacity-2 size-100" />
            <H2 className="text-3xl md:text-5xl font-headers tracking-wider italic relative">Champions</H2>
            {champion && championLogo && (
                <div className="flex flex-col items-center gap-6 mt-4 relative">
                    <div className="size-36 relative">
                        <Image
                            src={championLogo}
                            alt={championLogoAlt || champion.data.name || "Champions"}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <H3 className="text-2xl font-headers tracking-wider uppercase">{champion.data.name}</H3>
                </div>
            )}
        </Card>
    )
}
