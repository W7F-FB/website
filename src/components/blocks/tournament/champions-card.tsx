import { Card } from "@/components/ui/card"
import { H2, H3 } from "@/components/website-base/typography"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1FixturesResponse } from "@/types/opta-feeds/f1-fixtures"
import type { F1MatchData } from "@/types/opta-feeds/f1-fixtures"
import Image from "next/image"
import { getGameCardData } from "@/components/blocks/match/utils"
import { cn } from "@/lib/utils"
import { ChampionIcon } from "@/components/website-base/icons"
import { GradientBg } from "@/components/ui/gradient-bg"

type Props = {
    finalMatches: F1MatchData[]
    f1FixturesData: F1FixturesResponse | null
    prismicTeams: TeamDocument[]
    overlayColor?: string
    accentColor?: string
    shadowColor?: string
}

export function ChampionsCard({ finalMatches, f1FixturesData, prismicTeams, overlayColor, accentColor, shadowColor }: Props) {
    return (
        <Card className={cn("py-12 px-8 text-center bg-card/50 border-border/50 gap-0 relative flex flex-col items-center justify-center overflow-hidden")}>
            <GradientBg
                className="inset-0 opacity-20"
                overlayColor={overlayColor}
                accentColor={accentColor}
                shadowColor={shadowColor}
            />
            <ChampionIcon className="hidden absolute -bottom-24 opacity-2 size-100" />
            <H2 className="text-5xl font-headers tracking-wider italic relative">Champions</H2>
            {finalMatches[0] && (() => {
                const finalMatch = finalMatches[0]
                const optaTeams = f1FixturesData?.SoccerFeed?.SoccerDocument?.Team || []
                const gameData = getGameCardData(finalMatch, prismicTeams, optaTeams)
                
                const champion = gameData.homeIsWinning ? gameData.homeTeam : gameData.awayTeam
                const championLogo = gameData.homeIsWinning ? gameData.homeLogoUrl : gameData.awayLogoUrl
                const championLogoAlt = gameData.homeIsWinning ? gameData.homeLogoAlt : gameData.awayLogoAlt
                
                return championLogo && champion ? (
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
                ) : null
            })()}
        </Card>
    )
}

