import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import CountryFlag from "react-country-flag"
import { cn, relativeDateRange, formatDateRange, cleanCountryCode } from "@/lib/utils"
import type { Tournament } from "../../../../studio-website/sanity.types"
import { Background } from "../../ui/background"
import { urlFor } from "@/sanity/client"
import { TextProtect } from "../typography"
import { NavigationMenuLink } from "../../ui/navigation-menu"

interface NavigationMenuTournamentProps {
    tournament?: Tournament
    className?: string
    children?: React.ReactNode
}



export function NavigationMenuTournament({
    className,
    tournament
}: NavigationMenuTournamentProps) {
    if (!tournament?.showInNavigation?.enabled || !tournament?.showInNavigation?.navImage) {
        return null
    }

    const imageUrl = urlFor(tournament.showInNavigation.navImage)
        .auto('format')
        .url()

    const status = relativeDateRange(tournament.startDate, tournament.endDate)
    const dateRange = formatDateRange(tournament.startDate, tournament.endDate)

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
        <NavigationMenuLink className={cn(className, "flex justify-end hover:bg-transparent")} asChild>
            <Link href={`/`} className="px-3 h-36 pb-3 relative rounded-none overflow-hidden border border-border/50 group/tournament">
                <Background className="skew-x-[var(--skew-nav)] origin-top-left -inset-4">
                    <Image
                        src={imageUrl}
                        alt={tournament.showInNavigation.navImage.alt || tournament.title || 'Tournament'}
                        fill
                        className="origin-top-left object-cover grayscale-20 opacity-100 group-hover/tournament:scale-102 group-hover/tournament:grayscale-0 group-hover/tournament:opacity-100 transition-all duration-300 mask-b-from-40%"
                        sizes="1000px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 from-20% to-background/20" />
                </Background>
                <div className="relative skew-x-[var(--skew-nav)] origin-top-left">
                    <div className="flex items-center gap-3">
                        <TextProtect className="text-lg font-[500]">{tournament.title}</TextProtect>
                        {cleanCountryCode(tournament.countryCode) && (
                            <CountryFlag countryCode={cleanCountryCode(tournament.countryCode)!} svg className="!w-6 !h-6 rounded-full border object-cover" />
                        )}
                    </div>
                    {statusText && (
                        <span className="text-sm text-muted-foreground font-[500] mt-1.5">
                            {statusText}
                        </span>
                    )}
                </div>
            </Link>
        </NavigationMenuLink>
    )
}
