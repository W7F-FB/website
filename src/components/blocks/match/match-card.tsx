"use client"

import * as React from "react"
import Image from "next/image"
import { cn, formatGameDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import { QuestionMarkIcon, CaretFilledIcon, CaretRightIcon, StreamIcon, InformationCircleIcon } from "@/components/website-base/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { GameCardTeam, GameCardOpta } from "@/types/components"
import { normalizeOptaId } from "@/lib/opta/utils"
import { buildMatchUrl } from "@/lib/match-url"
import { getF9GameCardData, getF1GameCardData } from "./utils"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Status, StatusIndicator } from "@/components/ui/status"
import { MiniPlaceholders } from "@/lib/data/mini-placeholders"
import { StreamingAvailabilityDialog } from "../streaming-availability-dialog"

const MATCH_CARD_VARIANTS = {
    default: {
        card: "rounded-sm bg-card/50 border-border/50",
        bannerHeader: "lg:px-4 px-4 py-3",
        header: "lg:px-4 px-4 py-3",
        time: "text-sm font-light",
        status: "text-sm tracking-widest",
        liveStatus: "p-0 bg-transparent border-0",
        liveStatusIndicator: "size-2.5",
        liveStatusText: "",
        vsText: "px-2 text-xs",
        content: "pb-4",
        score: "text-2xl mr-2",
        teamLogos: "size-9 mr-3",
        teams: "px-4 py-2",
        teamNames: "lg:text-base text-base",
        indicator: "size-2 -right-3.5",
        showFooter: true,
        linkTeams: true,
        wrapper: "",
    },
    mini: {
        card: "rounded-none bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-muted/20",
        bannerHeader: "lg:px-4 px-4 py-2",
        header: "px-4 md:px-4 lg:px-4 pt-2 pb-1",
        time: "text-[0.65rem] font-normal",
        status: "text-xxs tracking-widest font-medium",
        liveStatus: "p-0 bg-transparent border-0",
        liveStatusIndicator: "size-2",
        liveStatusText: "text-xxs",
        vsText: "px-1 text-[0.55rem] text-muted-foreground/70",
        content: "pb-2",
        score: "text-base",
        teamLogos: "size-4 mr-2",
        teams: "px-4 py-0",
        teamNames: "lg:text-[0.7rem] text-[0.7rem]",
        indicator: "size-1.5 -right-2.5",
        showFooter: false,
        linkTeams: true,
        wrapper: "rounded-none no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
    },
} as const

type MatchCardVariant = keyof typeof MATCH_CARD_VARIANTS

function MatchCardTeam({
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
    showResponsiveNameSwap,
    optaDisplayName,
    preventLinkPropagation,
}: GameCardTeam & { showResponsiveNameSwap?: boolean; optaDisplayName?: string; preventLinkPropagation?: boolean }) {
    const baseDisplayName = optaDisplayName || teamShortName || team?.data?.name || teamLabel
    const shortDisplayName = compact && teamShortName ? teamShortName : null
    const nameNode = showResponsiveNameSwap && compact ? (
        <>
            <span className="block lg:hidden">{shortDisplayName || baseDisplayName}</span>
            <span className="hidden lg:block">{baseDisplayName}</span>
        </>
    ) : (
        shortDisplayName || baseDisplayName
    )

    const getIconSize = (logoSize: string) => {
        if (logoSize.includes("size-4")) return "size-2.5"
        if (logoSize.includes("size-5")) return "size-4"
        if (logoSize.includes("size-8")) return "size-5"
        return "size-6"
    }

    const logoSize = cn(logoClassName, !logoClassName && compact && "size-8", !logoClassName && !compact && "size-10")
    const iconSize = getIconSize(logoSize || cn(compact && "size-8", !compact && "size-10"))

    const logoNode = logoUrl ? (
        <div className={cn("relative", logoSize)}>
            <Image
                src={logoUrl}
                alt={logoAlt || baseDisplayName}
                fill
                className="object-contain"
            />
        </div>
    ) : (
        <div className={cn("bg-muted/10 rounded flex items-center justify-center", logoSize)}>
            <QuestionMarkIcon className={cn("text-muted-foreground/20", iconSize)} />
        </div>
    )

    const router = useRouter()

    const teamIdentity = (
        <>
            {logoNode}
            <div>
                <H4 className={cn(linkToTeam && team?.uid && "group-hover:underline", teamNamesClassName)}>
                    {nameNode}
                </H4>
            </div>
        </>
    )

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (team?.uid) {
            router.push(`/club/${team.uid}`)
        }
    }

    return (
        <div className={teamsClassName}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {team ? (
                        linkToTeam && team.uid ? (
                            preventLinkPropagation ? (
                                <button
                                    type="button"
                                    className="flex items-center group cursor-pointer"
                                    onClick={handleButtonClick}
                                >
                                    {teamIdentity}
                                </button>
                            ) : (
                                <Link
                                    href={`/club/${team.uid}`}
                                    className="flex items-center group"
                                >
                                    {teamIdentity}
                                </Link>
                            )
                        ) : (
                            <div className="flex items-center">
                                {teamIdentity}
                            </div>
                        )
                    ) : (
                        <>
                            <div className={cn("bg-muted/30 flex items-center justify-center", logoSize)}>
                                <QuestionMarkIcon className={cn("text-muted-foreground/50", iconSize)} />
                            </div>
                            <div>
                                <H4 className={teamNamesClassName}>
                                    {nameNode}
                                </H4>
                            </div>
                        </>
                    )}
                </div>

                <div className="text-center">
                    <div className={cn(scoreClassName, isLosing ? "text-foreground/60" : "text-foreground")}>
                        {score !== null ? score : ""}
                        {isWinning && <CaretFilledIcon className={indicatorClassName} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function MatchCard({
    fixture,
    prismicTeams,
    optaTeams,
    tournamentSlug,
    matchSlugMap,
    compact = false,
    banner,
    className,
    variant = "default",
    f9Feed,
    streamingLink,
    broadcastPartners,
    ...restProps
}: GameCardOpta) {
    const gameCardData = f9Feed 
        ? getF9GameCardData(f9Feed, prismicTeams, optaTeams) 
        : null
    const finalData = gameCardData || getF1GameCardData(fixture, prismicTeams, optaTeams)
    
    const normalizedMatchId = normalizeOptaId(fixture.uID)
    const matchSlug = matchSlugMap?.get(normalizedMatchId)
    const matchHref = matchSlug ? buildMatchUrl(tournamentSlug, matchSlug) : `/tournament/${tournamentSlug}`

    const {
        homeTeam,
        awayTeam,
        homeTeamShortName,
        awayTeamShortName,
        homePlaceholderName,
        awayPlaceholderName,
        homeScore,
        awayScore,
        homeIsLosing,
        awayIsLosing,
        homeIsWinning,
        awayIsWinning,
        isFinal,
        isLive,
        isPenalties,
        isExtraTime,
        matchTime,
        startTime,
        homeLogoUrl,
        awayLogoUrl,
        homeLogoAlt,
        awayLogoAlt,
    } = finalData
    
    const homeOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === normalizeOptaId(fixture.TeamData.find(td => td.Side === "Home")?.TeamRef || ""))
    const awayOptaTeam = optaTeams.find(t => normalizeOptaId(t.TeamRef || t.uID) === normalizeOptaId(fixture.TeamData.find(td => td.Side === "Away")?.TeamRef || ""))

    const gameDate = formatGameDate(startTime)
    const currentMinute = matchTime !== null ? String(matchTime) : null
    
    const getStatusText = () => {
        if (isFinal) {
            if (isPenalties) return "FT/PKs"
            if (isExtraTime) return "AET"
            return "FT"
        }
        if (isLive) return "Live"
        return ""
    }
    const fixtureStatus = getStatusText()
    const resolvedVariant: MatchCardVariant = variant ?? "default"
    const variantStyles = MATCH_CARD_VARIANTS[resolvedVariant] ?? MATCH_CARD_VARIANTS.default
    const isCompact = compact || resolvedVariant === "mini"
    const isMini = resolvedVariant === "mini"
    const interstitialPadding = isMini ? "px-4 pl-6.5 py-0 hidden" : "px-4 py-2"
    const getMiniPlaceholder = (placeholder: string | null | undefined) => {
        if (!placeholder) return undefined
        return MiniPlaceholders[placeholder] || placeholder
    }
    const homeShortName = isMini ? (homeTeam?.data?.key || getMiniPlaceholder(homePlaceholderName) || homeTeam?.data?.name || "Home Team") : (homeTeamShortName || "")
    const awayShortName = isMini ? (awayTeam?.data?.key || getMiniPlaceholder(awayPlaceholderName) || awayTeam?.data?.name || "Away Team") : (awayTeamShortName || "")
    
    // Only show scores if match has started (live or final)
    const showScores = isLive || isFinal
    const displayHomeScore = showScores ? homeScore : null
    const displayAwayScore = showScores ? awayScore : null
    const homeOptaDisplayName = homeTeamShortName || homeOptaTeam?.ShortTeamName || homeOptaTeam?.ShortName || homeOptaTeam?.Name || homeOptaTeam?.name || homePlaceholderName || "Home Team"
    const awayOptaDisplayName = awayTeamShortName || awayOptaTeam?.ShortTeamName || awayOptaTeam?.ShortName || awayOptaTeam?.Name || awayOptaTeam?.name || awayPlaceholderName || "Away Team"

    const cardBody = (
        <Card
            className={cn(
                "p-0 gap-0 flex flex-col h-full",
                variantStyles.card,
                className
            )}
            {...restProps}
        >
            {banner && (
                <CardHeader className={cn(variantStyles.bannerHeader, "flex items-center justify-between bg-muted/30 text-lg font-headers font-medium tracking-wider uppercase")}>
                    {banner}
                </CardHeader>
            )}
            <CardHeader className={cn("flex items-center justify-between", variantStyles.header)}>
                {isLive ? (
                    <Status className={variantStyles.liveStatus}>
                        <StatusIndicator className={cn("text-destructive", variantStyles.liveStatusIndicator)} />
                        <span className={cn("tracking-widest", variantStyles.liveStatusText)}>LIVE</span>
                    </Status>
                ) : (
                    <div className={cn("text-muted-foreground/75", variantStyles.time)}>
                        {gameDate.time} ET
                    </div>
                )}
                <div className={cn("font-headers font-medium", variantStyles.status)}>
                    {isLive ? (currentMinute ? <span className="hidden">{`'${currentMinute}`}</span> : "") : fixtureStatus}
                </div>
            </CardHeader>
            <CardContent className={cn("px-0 lg:px-0 flex-grow", variantStyles.content)}>
                <MatchCardTeam
                    team={homeTeam ?? null}
                    logoUrl={homeLogoUrl}
                    logoAlt={homeLogoAlt}
                    score={displayHomeScore}
                    teamLabel={homePlaceholderName || "Home Team"}
                    teamShortName={homeShortName}
                    compact={isCompact}
                    isLosing={homeIsLosing}
                    isWinning={homeIsWinning}
                    linkToTeam={variantStyles.linkTeams}
                    scoreClassName={cn("font-bold relative inline-block", variantStyles.score)}
                    logoClassName={variantStyles.teamLogos}
                    teamsClassName={variantStyles.teams}
                    teamNamesClassName={cn("font-medium text-foreground", variantStyles.teamNames)}
                    indicatorClassName={cn("-mt-0.5 scale-x-[-1] absolute top-1/2 -translate-y-1/2", variantStyles.indicator)}
                    showResponsiveNameSwap={isMini}
                    optaDisplayName={homeOptaDisplayName}
                    preventLinkPropagation={isMini}
                />

                <div className={interstitialPadding}>
                    <div className="relative">
                        <div className="relative flex items-center justify-start gap-4">
                            <span className={cn("text-muted-foreground/75", variantStyles.vsText)}>VS</span>
                            <Separator variant="gradient" gradientDirection="toRight" className="!w-auto flex-grow" />
                        </div>
                    </div>
                </div>

                <MatchCardTeam
                    team={awayTeam ?? null}
                    logoUrl={awayLogoUrl}
                    logoAlt={awayLogoAlt}
                    score={displayAwayScore}
                    teamLabel={awayPlaceholderName || "Away Team"}
                    teamShortName={awayShortName}
                    compact={isCompact}
                    isLosing={awayIsLosing}
                    isWinning={awayIsWinning}
                    linkToTeam={variantStyles.linkTeams}
                    scoreClassName={cn("font-bold relative inline-block", variantStyles.score)}
                    logoClassName={variantStyles.teamLogos}
                    teamsClassName={variantStyles.teams}
                    teamNamesClassName={cn("font-medium text-foreground", variantStyles.teamNames)}
                    indicatorClassName={cn("-mt-0.5 scale-x-[-1] absolute top-1/2 -translate-y-1/2", variantStyles.indicator)}
                    showResponsiveNameSwap={isMini}
                    optaDisplayName={awayOptaDisplayName}
                    preventLinkPropagation={isMini}
                />
            </CardContent>
            {variantStyles.showFooter && (
                <CardFooter className="md:px-4 px-4 py-0 h-12 bg-muted/50 flex items-center justify-between">
                    <Button asChild variant="link" size="sm" className="!p-0 px-0 h-auto font-medium">
                        <Link href={matchHref}>
                            Gamecast
                            <CaretRightIcon
                                className="size-2.5 mt-0.5"
                            />
                        </Link>
                    </Button>
                    {isLive && streamingLink && (
                        <div className="flex items-center gap-1">
                            <Button asChild variant="outline" size="sm" className="text-xs">
                                <Link href={streamingLink} target="_blank" rel="noopener noreferrer">
                                    <StreamIcon className="size-3" />
                                    Stream
                                </Link>
                            </Button>
                            <StreamingAvailabilityDialog broadcastPartners={broadcastPartners || []}>
                                <Button variant="outline" size="icon" className="size-8">
                                    <InformationCircleIcon className="size-4" />
                                </Button>
                            </StreamingAvailabilityDialog>
                        </div>
                    )}
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

export { MatchCard }
