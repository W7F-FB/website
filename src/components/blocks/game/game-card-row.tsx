"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GameCard } from "./game-card"
import type { TeamDocument } from "../../../../prismicio-types"
import { H2 } from "@/components/website-base/typography"

interface GameCardRowProps extends React.ComponentProps<"div"> {
    fixtures: Array<{
        id: string
        startTime: string
        status: string
        home: { id: string; score: number | null }
        away: { id: string; score: number | null }
        homeTeam?: TeamDocument | null
        awayTeam?: TeamDocument | null
    }>
    title?: string
    showDate?: boolean
}

function GameCardRow({ fixtures, title, showDate = true, className, ...props }: GameCardRowProps) {
    if (!fixtures || fixtures.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">There are no matches available.</p>
            </div>
        )
    }

    const groupedFixtures: Record<string, typeof fixtures> = showDate
        ? fixtures.reduce((groups, fixture) => {
            const dateKey = new Date(fixture.startTime).toDateString()
            if (!groups[dateKey]) groups[dateKey] = []
            groups[dateKey].push(fixture)
            return groups
        }, {} as Record<string, typeof fixtures>)
        : { "": fixtures }

    const formatDateHeader = (dateString: string) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            })
        } catch {
            return dateString
        }
    }

    return (
        <div className={cn("space-y-6", className)} {...props}>
            {title && (
                <div className="text-center">
                    <H2 className="text-2xl font-bold text-foreground">{title}</H2>
                </div>
            )}

            {Object.entries(groupedFixtures).map(([date, dateFixtures]) => (
                <div key={date} className="space-y-4">
                    {showDate && date && (
                        <div className="border-b border-muted pb-2">
                            <h3 className="text-lg font-semibold text-foreground capitalize">
                                {formatDateHeader(date)}
                            </h3>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dateFixtures.map((fixture) => (
                            <GameCard
                                key={fixture.id}
                                fixture={fixture}
                                className="w-full"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { GameCardRow }
