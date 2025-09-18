import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import CountryFlag from "react-country-flag"
import { cn, relativeDateRange, formatDateRange, cleanCountryCode } from "@/lib/utils"
import type { TournamentDocument } from "../../../../types.generated"
import { Background } from "../../ui/background"
import { getImageUrl } from "@/cms/utils"
import { TextProtect } from "../typography"
import { NavigationMenuLink } from "../../ui/navigation-menu"

interface NavigationMenuTournamentProps {
    tournament?: TournamentDocument
    className?: string
    children?: React.ReactNode
}



export function NavigationMenuTournament({
    className,
    tournament
}: NavigationMenuTournamentProps) {
    if (!tournament?.data.show_in_navigation || !tournament?.data.nav_image?.url) {
        return null
    }

    const imageUrl = tournament.data.nav_image.url

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
        <NavigationMenuLink className={cn(className, "flex justify-end hover:bg-transparent")} asChild>
            <Link href={`/`} className="px-3 h-36 pb-3 relative rounded-none overflow-hidden border border-border/50 group/tournament">
                <Background className="skew-x-[var(--skew-nav)] origin-top-left -inset-4">
                    <Image
                        src={imageUrl}
                        alt={tournament.data.nav_image.alt || tournament.data.title || 'Tournament'}
                        fill
                        className="origin-top-left object-cover grayscale-20 opacity-100 group-hover/tournament:scale-102 group-hover/tournament:grayscale-0 group-hover/tournament:opacity-100 transition-all duration-300 mask-b-from-40%"
                        sizes="1000px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 from-20% to-background/20" />
                </Background>
                <div className="relative skew-x-[var(--skew-nav)] origin-top-left">
                    <div className="flex items-center gap-3">
                        <TextProtect className="text-lg font-[500]">{tournament.data.title}</TextProtect>
                        {cleanCountryCode(tournament.data.country_code) && (
                            <CountryFlag countryCode={cleanCountryCode(tournament.data.country_code)!} svg className="!w-6 !h-6 rounded-full border object-cover" />
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
