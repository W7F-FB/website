import { Card } from "@/components/ui/card"
import { H2, H3 } from "@/components/website-base/typography"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse, F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import type { F9MatchResponse } from "@/types/opta-feeds/f9-match"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChampionIcon } from "@/components/website-base/icons"
import { GradientBg } from "@/components/ui/gradient-bg"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { normalizeOptaId } from "@/lib/opta/utils"
import { useMemo } from "react"

type Props = {
    finalMatch: F1MatchData | null
    finalMatchF9?: F9MatchResponse
    prismicTeams: TeamDocument[]
    f1FixturesData?: F1FixturesResponse | null
}

export function ChampionsCard({ finalMatch, finalMatchF9, prismicTeams, f1FixturesData: _f1FixturesData }: Props) {
    const finalF9Doc = useMemo(
        () => Array.isArray(finalMatchF9?.SoccerFeed?.SoccerDocument) 
            ? finalMatchF9?.SoccerFeed?.SoccerDocument[0] 
            : finalMatchF9?.SoccerFeed?.SoccerDocument,
        [finalMatchF9]
    )
    
    const finalWinner = finalF9Doc?.MatchData?.MatchInfo?.Result?.Winner 
        || finalMatch?.MatchInfo?.MatchWinner 
        || finalMatch?.MatchInfo?.GameWinner
    
    const championTeamRef = finalWinner ? normalizeOptaId(finalWinner) : null
    const champion = championTeamRef ? prismicTeams.find(t => normalizeOptaId(`t${t.data.opta_id}`) === championTeamRef) : null
    
    const championLogo = champion ? getImageUrl(champion.data.logo) : null
    const championLogoAlt = champion ? getImageAlt(champion.data.logo) : ""
    const championColor = champion?.data.color_primary || "#0c224a"

    return (
        <Card className={cn("py-12 px-8 text-center bg-card/50 border-border/50 gap-0 relative flex flex-col items-center justify-center overflow-hidden")}>
            <GradientBg
                className="absolute top-0 left-0 w-[175%] h-[175%] opacity-20 rotate-y-180"
                overlayColor="oklch(0.1949 0.0274 260.031)"
                accentColor={championColor}
                shadowColor="oklch(0.1949 0.0274 260.031)"
                accentOpacity={1}
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
