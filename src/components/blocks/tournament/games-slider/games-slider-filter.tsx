"use client"

import { useState, useEffect } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"
import type { TournamentDocument } from "../../../../../prismicio-types"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type GamesSliderFilterProps = {
    dates: string[]
    tournament: TournamentDocument
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    clearable?: boolean
}

export function GamesSliderFilter({
    dates,
    tournament,
    value,
    onValueChange,
    placeholder = "Select a date",
    clearable = false,
}: GamesSliderFilterProps) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00Z')
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        }).format(date)
    }

    const getDateParts = (dateString?: string) => {
        if (!dateString) return { day: "--", month: "---" }
        const date = new Date(dateString + 'T00:00:00Z')
        return {
            day: date.getUTCDate().toString(),
            month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(date).toUpperCase(),
        }
    }

    const { day, month } = getDateParts(value)
    const matchDayIndex = value ? dates.indexOf(value) : -1
    const matchDayLabel = matchDayIndex >= 0 ? `Match Day ${matchDayIndex + 1}` : placeholder

    const triggerContent = (
        <>
            <div className="h-full flex flex-col border-r border-border">
                <div className="w-full flex-grow text-sm flex items-center justify-center px-1 pt-0.5 font-headers font-[400]">
                    {day}
                </div>
                <div className="w-full flex-shrink-0 text-[0.55rem] pt-0.5 flex items-center justify-center pb-0.5 font-headers px-1.5 border-t border-border">
                    {month}
                </div>
            </div>
            <div className="relative pt-4 h-full flex items-center flex-grow ">
                <Label className="absolute top-1.5 text-xxs text-muted-foreground/80 font-light">{tournament.data.title}</Label>
                <span className="font-headers uppercase font-medium">{matchDayLabel}</span>
            </div>
        </>
    )

    if (!hasMounted) {
        return (
            <button
                type="button"
                className={cn(
                    "lg:min-w-48 lg:pr-12 pr-9 relative text-xxs lg:text-sm pl-0",
                    "border-input hover:bg-extra-muted flex h-full items-center gap-2 rounded-md border bg-transparent shadow-xs"
                )}
            >
                {triggerContent}
            </button>
        )
    }

    return (
        <Select value={value} onValueChange={onValueChange} clearable={clearable}>
            <SelectTrigger className="lg:min-w-48 lg:pr-12 pr-9 [&_.caret-icon]:size-2.5 lg:[&_.caret-icon]:size-3.5  relative text-xxs lg:text-sm [&_.match-day-date]:hidden pl-0">
                {triggerContent}
            </SelectTrigger>
            <SelectContent>
                {dates.map((dateString, index) => (
                    <SelectItem key={dateString} value={dateString}>
                        <div className="flex flex-col gap-0.5 items-start">
                            <div className="font-headers uppercase font-medium">Match Day {index + 1} </div>
                            <div className="match-day-date text-muted-foreground/80 font-light text-xs">{formatDate(dateString)}</div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

