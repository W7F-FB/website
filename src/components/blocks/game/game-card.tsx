"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { Card, CardContent } from "@/components/ui/card"
import { H4, P } from "@/components/website-base/typography"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuestionMarkIcon } from "@/components/website-base/icons"
import Link from "next/link"
import type { TeamDocument } from "../../../../prismicio-types"

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
    fixture: {
        id: string
        startTime: string
        status: string
        home: { id: string; score: number | null }
        away: { id: string; score: number | null }
        homeTeam?: TeamDocument | null
        awayTeam?: TeamDocument | null
    }
}

function GameCard({ fixture, className, ...props }: GameCardProps) {
    const { homeTeam, awayTeam, home, away, startTime, status } = fixture

    const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
    const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
    const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : ""
    const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : ""

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Scheduled":
                return "bg-blue-500/20 text-blue-400"
            case "In Progress":
                return "bg-green-500/20 text-green-400"
            case "Played":
                return "bg-gray-500/20 text-gray-400"
            case "Postponed":
                return "bg-yellow-500/20 text-yellow-400"
            default:
                return "bg-muted/20 text-muted-foreground"
        }
    }

    const formatGameTime = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const formatter = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })
            return formatter.format(date)
        } catch {
            return dateString
        }
    }


    return (
        <Card
            className={cn(
                "rounded-sm p-0 bg-card/50 border-muted",
                className
            )}
            {...props}
        >
            <CardContent className="px-0">
                <div className="flex justify-between items-center py-2 px-6 border-b border-muted bg-accent-foreground/5">
                    <div className="text-sm text-muted-foreground">
                        {formatGameTime(startTime)}
                    </div>
                    <Badge
                        variant="secondary"
                        className={cn("text-xs cursor-default", getStatusColor(status))}
                    >
                        {status === "Scheduled" ? "Scheduled" :
                            status === "In Progress" ? "Live" :
                                status === "Played" ? "Finished" :
                                    status === "Postponed" ? "Postponed" : status}
                    </Badge>
                </div>

                <div className="flex items-center justify-between py-4 px-6">
                    <div className="flex flex-col items-center flex-1">
                        {homeTeam ? (
                            <>
                                {homeLogoUrl ? (
                                    <div className="mb-3">
                                        <Link href={`/team/${homeTeam.uid}`}>
                                            <Image
                                                src={homeLogoUrl}
                                                alt={homeLogoAlt || homeTeam?.data?.name || "Home team"}
                                                width={65}
                                                height={65}
                                                className="object-contain"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 mb-3 bg-muted/10 rounded flex items-center justify-center">
                                        <QuestionMarkIcon className="w-10 h-10 text-muted-foreground/20" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center">
                                    <Button asChild variant="link" className="h-auto p-0">
                                        <Link href={`/team/${homeTeam.uid}`}>
                                            <H4 className="text-sm font-semibold truncate">
                                                {homeTeam?.data?.name || "Home Team"}
                                            </H4>
                                        </Link>
                                    </Button>
                                    {homeTeam?.data?.country && (
                                        <P noSpace className="text-xs text-muted-foreground">
                                            {homeTeam.data.country}
                                        </P>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 mb-3 bg-muted/10 rounded flex items-center justify-center">
                                    <QuestionMarkIcon className="w-10 h-10 text-muted-foreground/20" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <H4 className="text-sm font-semibold truncate">
                                        Home Team
                                    </H4>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 mx-4">
                        {home.score !== null && away.score !== null ? (
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {home.score} - {away.score}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="text-lg text-muted-foreground">vs</div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center flex-1 justify-end">
                        {awayTeam ? (
                            <>
                                {awayLogoUrl ? (
                                    <div className="mb-3">
                                        <Link href={`/team/${awayTeam.uid}`}>
                                            <Image
                                                src={awayLogoUrl}
                                                alt={awayLogoAlt || awayTeam?.data?.name || "Away team"}
                                                width={65}
                                                height={65}
                                                className="object-contain"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 mb-3 bg-muted/10 rounded flex items-center justify-center">
                                        <QuestionMarkIcon className="w-10 h-10 text-muted-foreground/20" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center">
                                    <Button asChild variant="link" className="h-auto p-0">
                                        <Link href={`/team/${awayTeam.uid}`}>
                                            <H4 className="text-sm font-semibold truncate">
                                                {awayTeam?.data?.name || "Away Team"}
                                            </H4>
                                        </Link>
                                    </Button>
                                    {awayTeam?.data?.country && (
                                        <P noSpace className="text-xs text-muted-foreground">
                                            {awayTeam.data.country}
                                        </P>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 mb-3 bg-muted/10 rounded flex items-center justify-center">
                                    <QuestionMarkIcon className="w-10 h-10 text-muted-foreground/20" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <H4 className="text-sm font-semibold truncate">
                                        Away Team
                                    </H4>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center px-6 border-t border-muted bg-accent-foreground/5">
                    <Button asChild variant="link">
                        <Link href={`/match/${fixture.id}`}>
                            Match page
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export { GameCard }



