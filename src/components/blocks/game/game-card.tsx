"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import { QuestionMarkIcon, CaretFilledIcon, CaretRightIcon } from "@/components/website-base/icons"
import Link from "next/link"
import type { TeamDocument } from "../../../../prismicio-types"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import { normalizeOptaId, getStatusDisplay } from "@/lib/opta/utils"
import { getGameCardData, formatGameTime } from "./utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface GameCardTeamProps {
    team: TeamDocument | null
    logoUrl: string | null
    logoAlt: string
    score: number | null
    teamLabel: string
    teamShortName: string
    compact?: boolean
    isLosing?: boolean
    isWinning?: boolean
}

function GameCardTeam({ team, logoUrl, logoAlt, score, teamLabel, teamShortName, compact, isLosing, isWinning }: GameCardTeamProps) {
    const displayName = compact && teamShortName ? teamShortName : (team?.data?.name || teamLabel)
    
    return (
        <div className="px-6 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {team ? (
                        <Link href={`/team/${team.uid}`} className="flex items-center space-x-3 group">
                            {logoUrl ? (
                                <div className="w-10 h-10  relative">
                                    <Image
                                        src={logoUrl}
                                        alt={logoAlt || displayName}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                    <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                                </div>
                            )}
                            <div>
                                <H4 className="text-base font-semibold text-foreground group-hover:underline">
                                    {displayName}
                                </H4>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                            </div>
                            <div>
                                <H4 className="text-base font-semibold text-foreground">
                                    {displayName}
                                </H4>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-center">
                    <div className={cn("text-2xl font-bold relative inline-block", isLosing ? "text-foreground/60" : "text-foreground")}>
                        {score !== null ? score : "-"}
                        {isWinning && <CaretFilledIcon className="size-2 -mt-0.5 scale-x-[-1] absolute -right-3.5 top-1/2 -translate-y-1/2" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
    fixture: F1MatchData
    prismicTeams: TeamDocument[]
    optaTeams: F1TeamData[]
    timeOnly?: boolean
    compact?: boolean
}
function GameCard({ fixture, prismicTeams, optaTeams, timeOnly = false, compact = false, className, ...props }: GameCardProps) {
    const {
        homeTeam,
        awayTeam,
        homeTeamShortName,
        awayTeamShortName,
        homeScore,
        awayScore,
        homeIsLosing,
        awayIsLosing,
        homeIsWinning,
        awayIsWinning,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    } = getGameCardData(fixture, prismicTeams, optaTeams)

    return (
        <Card
            className={cn(
                "rounded-sm p-0 bg-card/50 border-border/50 gap-0",
                className
            )}
            {...props}
        >
            <CardHeader className="px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {formatGameTime(startTime, timeOnly)}
                </div>
                <div className="text-sm font-headers font-medium tracking-widest">
                    {getStatusDisplay(fixture.MatchInfo)}
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-4">
                <GameCardTeam
                    team={homeTeam ?? null}
                    logoUrl={homeLogoUrl}
                    logoAlt={homeLogoAlt}
                    score={homeScore}
                    teamLabel="Home Team"
                    teamShortName={homeTeamShortName || ""}
                    compact={compact}
                    isLosing={homeIsLosing}
                    isWinning={homeIsWinning}
                />

                <div className="px-6 py-2">
                    <div className="relative">

                        <div className="relative flex items-center justify-start gap-4">
                            <span className="px-2 text-sm text-muted-foreground font-medium">VS</span>
                            <Separator variant="gradient" gradientDirection="toRight" className="w-auto flex-grow" />
                        </div>
                    </div>
                </div>

                <GameCardTeam
                    team={awayTeam ?? null}
                    logoUrl={awayLogoUrl}
                    logoAlt={awayLogoAlt}
                    score={awayScore}
                    teamLabel="Away Team"
                    teamShortName={awayTeamShortName || ""}
                    compact={compact}
                    isLosing={awayIsLosing}
                    isWinning={awayIsWinning}
                />
            </CardContent>
            <CardFooter className="px-6 py-3 bg-muted/50 flex items-center">
                <Button asChild variant="link" size="sm" className="!p-0 px-0 h-auto font-medium">
                    <Link href={`/game`}>
                        Gamecast
                        <CaretRightIcon
                            className="size-2.5 mt-0.5"
                        />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export { GameCard }



