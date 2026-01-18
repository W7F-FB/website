import * as React from "react"
import CountryFlag from "react-country-flag"

import { cn, relativeDateRange, formatDateRange, cleanCountryCode } from "@/lib/utils"

import type { TournamentDocument } from "../../../prismicio-types"
import { Background } from "../ui/background"
import { H3, TextProtect } from "../website-base/typography"
import { PrismicLink } from "@prismicio/react"
import { PrismicNextImage } from "@prismicio/next"
import { CaretRightIcon } from "../website-base/icons"

interface TournamentCardProps {
    tournament: TournamentDocument
    className?: string
}

export function TournamentCard({
    tournament,
    className
}: TournamentCardProps) {
    if (!tournament?.data.nav_image?.url) {
        return null
    }

    const status = relativeDateRange(tournament.data.start_date, tournament.data.end_date)
    const dateRange = formatDateRange(tournament.data.start_date, tournament.data.end_date)

    const getStatusText = () => {
        if (!status || !dateRange) return null

        switch (status) {
            case 'future':
                return `Upcoming • ${dateRange}`
            case 'present':
                return `LIVE • ${dateRange}`
            case 'past':
                return `Final • ${dateRange}`
            default:
                return null
        }
    }

    const statusText = getStatusText()

    return (
        <PrismicLink
            document={tournament}
            className={cn(
                "flex flex-col justify-end min-h-48 md:min-h-96 p-4 md:p-6 relative rounded-sm overflow-hidden border border-border/50 group/tournament",
                "hover:border-border transition-all duration-300",
                className
            )}
        >
            <Background className="-inset-4">
                <PrismicNextImage
                    field={tournament.data.hero_image}
                    fill
                    className="object-cover grayscale-20 opacity-100 group-hover/tournament:scale-102 group-hover/tournament:grayscale-0 transition-all duration-300 mask-b-from-30%"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 from-20% to-background/10" />
            </Background>
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <TextProtect>
                        <H3 variant="h3" className="text-2xl md:!text-4xl font-[500]">{tournament.data.title}</H3>
                    </TextProtect>
                    {cleanCountryCode(tournament.data.country_code) && (
                        <CountryFlag countryCode={cleanCountryCode(tournament.data.country_code)!} svg className="!w-5 !h-5 rounded-full border border-secondary/20 object-cover" />
                    )}
                </div>
                <div className="flex items-center justify-between mt-2">
                    {statusText && (
                        <span className="text-muted-foreground font-[500]">
                            {statusText}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 text-sm font-headers font-medium text-foreground/80 group-hover/tournament:text-foreground">
                        <span>Results</span>
                        <CaretRightIcon className="size-3 mt-0.5 transition-transform duration-300 group-hover/tournament:translate-x-1" />
                    </span>
                </div>
            </div>
        </PrismicLink>
    )
}
