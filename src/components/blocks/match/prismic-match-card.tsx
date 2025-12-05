"use client"

import * as React from "react"
import Image from "next/image"
import { cn, formatGameDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import { QuestionMarkIcon } from "@/components/website-base/icons"
import type { MatchDocument, TeamDocument } from "../../../../prismicio-types"
import { getPrismicGameCardData } from "./utils"
import { Separator } from "@/components/ui/separator"

interface PrismicMatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
    prismicMatch: MatchDocument
    banner?: React.ReactNode
}

interface TeamRowProps {
    team: TeamDocument | undefined
    logoUrl: string | null
    logoAlt: string
    teamLabel: string
}

function TeamRow({ team, logoUrl, logoAlt, teamLabel }: TeamRowProps) {
    const displayName = team?.data?.name || teamLabel

    const logoNode = logoUrl ? (
        <div className="relative size-9 mr-3">
            <Image
                src={logoUrl}
                alt={logoAlt || displayName}
                fill
                className="object-contain"
            />
        </div>
    ) : (
        <div className="size-9 mr-3 bg-muted/10 rounded flex items-center justify-center">
            <QuestionMarkIcon className="size-6 text-muted-foreground/20" />
        </div>
    )

    return (
        <div className="px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {team ? (
                        <div className="flex items-center">
                            {logoNode}
                            <div>
                                <H4 className="font-medium text-foreground lg:text-base text-base">
                                    {displayName}
                                </H4>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="size-12 bg-muted/10 rounded flex items-center justify-center">
                                <QuestionMarkIcon className="size-6 text-muted-foreground/20" />
                            </div>
                            <div>
                                <H4 className="font-medium text-foreground lg:text-base text-base">
                                    {displayName}
                                </H4>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function PrismicMatchCard({ prismicMatch, banner, className, ...restProps }: PrismicMatchCardProps) {
    const gameCardData = getPrismicGameCardData(prismicMatch)

    const {
        homeTeam,
        awayTeam,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    } = gameCardData

    const homeTeamLabel = prismicMatch.data.home_team_name_override || "Home Team"
    const awayTeamLabel = prismicMatch.data.away_team_name_override || "Away Team"

    const gameDate = formatGameDate(startTime)

    return (
        <Card
            className={cn(
                "p-0 gap-0 flex flex-col h-full rounded-sm bg-card/50 border-border/50",
                className
            )}
            {...restProps}
        >
            {banner && (
                <CardHeader className="lg:px-4 px-4 py-3 flex items-center justify-between bg-muted/30 text-lg font-headers font-medium tracking-wider uppercase">
                    {banner}
                </CardHeader>
            )}
            <CardContent className="px-0 lg:px-0 flex-grow pb-4 pt-4">
                <TeamRow
                    team={homeTeam}
                    logoUrl={homeLogoUrl}
                    logoAlt={homeLogoAlt}
                    teamLabel={homeTeamLabel}
                />

                <div className="px-4 py-2">
                    <div className="relative">
                        <div className="relative flex items-center justify-start gap-4">
                            <span className="px-2 text-xs text-muted-foreground/75">VS</span>
                            <Separator variant="gradient" gradientDirection="toRight" className="!w-auto flex-grow" />
                        </div>
                    </div>
                </div>

                <TeamRow
                    team={awayTeam}
                    logoUrl={awayLogoUrl}
                    logoAlt={awayLogoAlt}
                    teamLabel={awayTeamLabel}
                />
            </CardContent>
            <CardFooter className="md:px-4 px-4 py-3 bg-muted/50 flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground uppercase">
                    {gameDate.weekday}, {gameDate.month} {gameDate.day}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                    {gameDate.time} ET
                </div>
            </CardFooter>
        </Card>
    )
}

export { PrismicMatchCard }

