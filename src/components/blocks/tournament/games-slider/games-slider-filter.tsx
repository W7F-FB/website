"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { TournamentDocument } from "../../../../../prismicio-types"
import { Label } from "@/components/ui/label"

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
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00Z')
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
        }).format(date)
    }

    return (
        <Select value={value} onValueChange={onValueChange} clearable={clearable}>
            <SelectTrigger className="lg:min-w-48 min-w-32 pt-4 relative text-xxs lg:text-sm [&_.match-day-date]:hidden">
                <Label className="absolute top-1.5 left-4 text-xxs text-muted-foreground/80 font-light">{tournament.data.title}</Label>
                <SelectValue placeholder={placeholder} />
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

