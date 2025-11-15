"use client"

import * as React from "react"
import Image from "next/image"
import { cn, formatGameDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import { QuestionMarkIcon, CaretFilledIcon, CaretRightIcon } from "@/components/website-base/icons"
import Link from "next/link"
import type { GameCardTeam, GameCard as GameCardType } from "@/types/components"
import { getStatusDisplay, normalizeOptaId } from "@/lib/opta/utils"
import { getGameCardData } from "./utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const GAME_CARD_VARIANTS = {
    default: {
        card: "rounded-sm bg-card/50 border-border/50",
        bannerHeader: "px-6 py-3",
        header: "px-6 py-3",
        time: "text-sm font-light",
        status: "text-sm tracking-widest",
        vsText: "px-2 text-xs",
        content: "pb-4",
        score: "text-2xl",
        teamLogos: "size-10 mr-3",
        teams: "px-6 py-2",
        teamNames: "text-base",
        indicator: "size-2 -right-3.5",
        showFooter: true,
        linkTeams: true,
        wrapper: "",
    },
    mini: {
        card: "rounded-none bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-muted/20",
        bannerHeader: "px-4 py-2",
        header: "px-4 pt-2 pb-1",
        time: "text-[0.65rem] font-normal",
        status: "text-xxs tracking-widest font-medium",
        vsText: "px-1 text-[0.55rem] text-muted-foreground/70",
        content: "pb-2",
        score: "text-base",
        teamLogos: "size-4 mr-2",
        teams: "px-4 py-0",
        teamNames: "text-[0.7rem]",
        indicator: "size-1.5 -right-3",
        showFooter: false,
        linkTeams: false,
        wrapper: "rounded-none no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
    },
} as const

type GameCardVariant = keyof typeof GAME_CARD_VARIANTS

function GameCardTeam({
    team,
    logoUrl,
    logoAlt,
    score,
    teamLabel,
    teamShortName,
    compact,
    isLosing,
    isWinning,
    linkToTeam = true,
    scoreClassName,
    logoClassName,
    teamsClassName,
    teamNamesClassName,
    indicatorClassName,
}: GameCardTeam) {
    const displayName = compact && teamShortName ? teamShortName : (team?.data?.name || teamLabel)
    
    const getIconSize = (logoSize: string) => {
        if (logoSize === "size-5") return "size-4"
        if (logoSize === "size-8") return "size-5"
        return "size-6"
    }
    
    const logoSize = cn(logoClassName, !logoClassName && compact && "size-8", !logoClassName && !compact && "size-10")
    const iconSize = getIconSize(logoSize || cn(compact && "size-8", !compact && "size-10"))
    
    const logoNode = logoUrl ? (
        <div className={cn("relative", logoSize)}>
            <Image
                src={logoUrl}
                alt={logoAlt || displayName}
                fill
                className="object-contain"
            />
        </div>
    ) : (
        <div className={cn("bg-muted/10 rounded flex items-center justify-center", logoSize)}>
            <QuestionMarkIcon className={cn("text-muted-foreground/20", iconSize)} />
        </div>
    )
    
    const teamIdentity = (
        <>
            {logoNode}
            <div>
                <H4 className={cn(linkToTeam && "group-hover:underline", teamNamesClassName)}>
                    {displayName}
                </H4>
            </div>
        </>
    )

    return (
        <div className={teamsClassName}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {team ? (
                        linkToTeam ? (
                            <Link href={`/team/${team.uid}`} className="flex items-center space-x-3 group">
                                {teamIdentity}
                            </Link>
                        ) : (
                            <div className="flex items-center">
                                {teamIdentity}
                            </div>
                        )
                    ) : (
                        <>
                            <div className="size-12 bg-muted/10 rounded flex items-center justify-center">
                                <QuestionMarkIcon className="size-6 text-muted-foreground/20" />
                            </div>
                            <div>
                                <H4 className={cn(teamNamesClassName, "font-semibold")}>
                                    {displayName}
                                </H4>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-center">
                    <div className={cn(scoreClassName, isLosing ? "text-foreground/60" : "text-foreground")}>
                        {score !== null ? score : "-"}
                        {isWinning && <CaretFilledIcon className={indicatorClassName} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function GameCard({ fixture, prismicTeams, optaTeams, compact = false, banner, className, variant = "default", ...props }: GameCardType) {
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

    const gameDate = formatGameDate(startTime)
    const resolvedVariant: GameCardVariant = variant ?? "default"
    const variantStyles = GAME_CARD_VARIANTS[resolvedVariant] ?? GAME_CARD_VARIANTS.default
    const isCompact = compact || resolvedVariant === "mini"
    const matchHref = `/match/${normalizeOptaId(fixture.uID)}`
    const interstitialPadding = resolvedVariant === "mini" ? "px-4 pl-6.5 py-0 hidden" : "px-6 py-2"

    const cardBody = (
        <Card
            className={cn(
                "p-0 gap-0",
                variantStyles.card,
                className
            )}
            {...props}
        >
            {banner && (
                <CardHeader className={cn(variantStyles.bannerHeader, "flex items-center justify-between bg-muted/30 text-lg font-headers font-medium tracking-wider uppercase")}>
                    {banner}
                </CardHeader>
            )}
            <CardHeader className={cn("flex items-center justify-between", variantStyles.header)}>
                <div className={cn("text-muted-foreground/75", variantStyles.time)}>
                    {gameDate.time} ET
                </div>
                <div className={cn("font-headers font-medium", variantStyles.status)}>
                    {getStatusDisplay(fixture.MatchInfo)}
                </div>
            </CardHeader>
            <CardContent className={cn("px-0", variantStyles.content)}>
                <GameCardTeam
                    team={homeTeam ?? null}
                    logoUrl={homeLogoUrl}
                    logoAlt={homeLogoAlt}
                    score={homeScore}
                    teamLabel="Home Team"
                    teamShortName={homeTeamShortName || ""}
                    compact={isCompact}
                    isLosing={homeIsLosing}
                    isWinning={homeIsWinning}
                    linkToTeam={variantStyles.linkTeams}
                    scoreClassName={cn("font-bold relative inline-block", variantStyles.score)}
                    logoClassName={variantStyles.teamLogos}
                    teamsClassName={variantStyles.teams}
                    teamNamesClassName={cn("font-medium text-foreground", variantStyles.teamNames)}
                    indicatorClassName={cn("-mt-0.5 scale-x-[-1] absolute top-1/2 -translate-y-1/2", variantStyles.indicator)}
                />

                <div className={interstitialPadding}>
                    <div className="relative">
                        <div className="relative flex items-center justify-start gap-4">
                            <span className={cn("text-muted-foreground/75", variantStyles.vsText)}>VS</span>
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
                    compact={isCompact}
                    isLosing={awayIsLosing}
                    isWinning={awayIsWinning}
                    linkToTeam={variantStyles.linkTeams}
                    scoreClassName={cn("font-bold relative inline-block", variantStyles.score)}
                    logoClassName={variantStyles.teamLogos}
                    teamsClassName={variantStyles.teams}
                    teamNamesClassName={cn("font-medium text-foreground", variantStyles.teamNames)}
                    indicatorClassName={cn("-mt-0.5 scale-x-[-1] absolute top-1/2 -translate-y-1/2", variantStyles.indicator)}
                />
            </CardContent>
            {variantStyles.showFooter && (
                <CardFooter className="px-6 py-3 bg-muted/50 flex items-center justify-between">
                    <div className="grid grid-cols-[auto_1fr] hidden">
                        <div className="flex flex-col items-center font-headers text-muted-foreground/75 bg-background/20 rounded-l-xs p-1 px-2  border border-border/50">
                            <span className="text-xs font-medium text-muted-foreground">{gameDate.day}</span>
                            <span className="text-[0.5rem]">{gameDate.month}</span>
                        </div>
                        <div className="bg-border/50 h-full rounded-r-xs p-1 px-2 flex items-center text-xs font-medium text-muted-foreground/90 pb-0.5">{gameDate.time} ET</div>
                    </div>
                    <Button asChild variant="link" size="sm" className="!p-0 px-0 h-auto font-medium">
                        <Link href={matchHref}>
                            Gamecast
                            <CaretRightIcon
                                className="size-2.5 mt-0.5"
                            />
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    )

    if (resolvedVariant === "mini") {
        return (
            <Link href={matchHref} className={cn("block", variantStyles.wrapper)}>
                {cardBody}
            </Link>
        )
    }

    return cardBody
}

export { GameCard }



