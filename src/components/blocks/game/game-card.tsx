"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { Card, CardContent } from "@/components/ui/card"
import { H4 } from "@/components/website-base/typography"
import { Button } from "@/components/ui/button"
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

    const formatGameTime = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const today = new Date()
            const isToday = date.toDateString() === today.toDateString()
            
            if (isToday) {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
                return `Today, ${formatter.format(date)}`
            } else {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
                return formatter.format(date)
            }
        } catch {
            return dateString
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Scheduled":
                return "text-muted-foreground"
            case "In Progress":
                return "text-green-500"
            case "Played":
                return "text-muted-foreground"
            case "Postponed":
                return "text-yellow-500"
            default:
                return "text-muted-foreground"
        }
    }

    return (
        <Card
            className={cn(
                "rounded-sm p-0 bg-card border-muted",
                className
            )}
            {...props}
        >
            <CardContent className="px-0">
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {formatGameTime(startTime)}
                        </div>
                        <div className={`text-sm font-medium ${getStatusColor(status)}`}>
                            {status === "Scheduled" ? "Upcoming" :
                             status === "In Progress" ? "Live" :
                             status === "Played" ? "Finished" :
                             status === "Postponed" ? "Postponed" : status}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {homeTeam ? (
                                <>
                                    {homeLogoUrl ? (
                                        <div className="w-12 h-12 rounded flex items-center justify-center">
                                            <Link href={`/team/${homeTeam.uid}`}>
                                                <Image
                                                    src={homeLogoUrl}
                                                    alt={homeLogoAlt || homeTeam?.data?.name || "Home team"}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                            <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    <div>
                                        <Button asChild variant="link" className="h-auto p-0">
                                            <Link href={`/team/${homeTeam.uid}`}>
                                                <H4 className="text-base font-semibold text-foreground">
                                                    {homeTeam?.data?.name || "Home Team"}
                                                </H4>
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                        <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                                    </div>
                                    <div>
                                        <H4 className="text-base font-semibold text-foreground">
                                            Home Team
                                        </H4>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {home.score !== null ? home.score : "-"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-2">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-l from-muted to-transparent"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="px-2 text-sm text-muted-foreground font-medium">VS</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {awayTeam ? (
                                <>
                                    {awayLogoUrl ? (
                                        <div className="w-12 h-12 rounded flex items-center justify-center">
                                            <Link href={`/team/${awayTeam.uid}`}>
                                                <Image
                                                    src={awayLogoUrl}
                                                    alt={awayLogoAlt || awayTeam?.data?.name || "Away team"}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                            <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                                        </div>
                                    )}
                                    <div>
                                        <Button asChild variant="link" className="h-auto p-0">
                                            <Link href={`/team/${awayTeam.uid}`}>
                                                <H4 className="text-base font-semibold text-foreground">
                                                    {awayTeam?.data?.name || "Away Team"}
                                                </H4>
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-muted/10 rounded flex items-center justify-center">
                                        <QuestionMarkIcon className="w-6 h-6 text-muted-foreground/20" />
                                    </div>
                                    <div>
                                        <H4 className="text-base font-semibold text-foreground">
                                            Away Team
                                        </H4>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                                {away.score !== null ? away.score : "-"}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export { GameCard }



