import * as React from "react"
import CountryFlag from "react-country-flag"

import { cn, relativeDateRange, formatDateRange, cleanCountryCode } from "@/lib/utils"

import type { TournamentDocument } from "../../../../prismicio-types"
import { Background } from "../../ui/background"
import { TextProtect } from "../typography"
import { PrismicLink } from "@prismicio/react"
import { isFilled } from "@prismicio/client"
import { Separator } from "@/components/ui/separator"
import { CategoryButton } from "@/components/blocks/category-button"
import { SoccerIcon, TicketIcon, WhistleIcon, VIPIcon, BarGraphIcon, ChampionIcon } from "../icons"
import { PrismicNextImage } from "@prismicio/next"
import { NavSheetLink } from "@/components/ui/navigation-menu"
import type { TeamDocument } from "../../../../prismicio-types"

interface NavigationMenuTournamentProps {
    tournament?: TournamentDocument
    className?: string
    children?: React.ReactNode
    useHeroImage?: boolean
}

interface NavigationMenuTournamentFeaturedProps {
    tournament?: TournamentDocument
    teams?: TeamDocument[]
    className?: string
    children?: React.ReactNode
}



export function NavigationMenuTournament({
    className,
    tournament,
    useHeroImage = false
}: NavigationMenuTournamentProps) {
    const imageField = useHeroImage ? tournament?.data.hero_image : tournament?.data.nav_image
    if (!tournament?.data.show_in_navigation || !imageField?.url) {
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
        <NavSheetLink className="flex-1">
            <PrismicLink
                document={tournament}
                data-slot="navigation-menu-link"
                className={cn(
                    className,
                    "flex justify-end hover:bg-transparent px-3 pr-8 h-full flex-grow min-w-full min-h-24 pb-3 relative rounded-none overflow-hidden border border-border/50 group/tournament",
                    "hover:bg-background hover:text-accent-foreground focus:bg-bg-background focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 font-headers rounded-none"
                )}
            >
                <Background className="-inset-4">
                    <PrismicNextImage
                        field={imageField}
                        fill
                        priority
                        loading="eager"
                        className="object-cover grayscale-20 opacity-100 group-hover/tournament:scale-102 group-hover/tournament:grayscale-0 group-hover/tournament:opacity-100 transition-all duration-300 mask-b-from-30%"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 from-20% to-background/20" />
                </Background>
                <div className="relative">
                    <div className="flex items-center gap-3">
                        <TextProtect className="text-base font-[500]">{tournament.data.title}</TextProtect>
                        {cleanCountryCode(tournament.data.country_code) && (
                            <CountryFlag countryCode={cleanCountryCode(tournament.data.country_code)!} svg className="!w-4.5 !h-4.5 rounded-full border border-secondary/20 object-cover" />
                        )}
                    </div>
                    {statusText && (
                        <span className="text-xs text-muted-foreground font-[500] mt-1.5">
                            {statusText}
                        </span>
                    )}
                </div>
            </PrismicLink>
        </NavSheetLink>
    )
}

export function NavigationMenuTournamentFeatured({
    className,
    tournament,
    teams = []
}: NavigationMenuTournamentFeaturedProps) {
    if (!tournament?.data.show_in_navigation || !tournament?.data.nav_image?.url) {
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
                return `FINAL • ${dateRange}`
            case 'past':
                return `Final • ${dateRange}`
            default:
                return null
        }
    }

    const statusText = getStatusText()

    return (
        <div className="grid lg:grid-cols-[auto_1fr] bg-gradient-to-txxx from-muted/50 to-muted/20 ">
            <NavSheetLink>
                <PrismicLink document={tournament} className=" hidden lg:block relative w-full lg:w-64 h-full group/tournament overflow-hidden border-muted border">
                    <div className="relative h-full w-full">
                        <PrismicNextImage
                            field={tournament.data.nav_image}
                            fill
                            priority
                            loading="eager"
                            className="object-bottom-right object-cover grayscale-20 opacity-100 group-hover/tournament:scale-102 group-hover/tournament:grayscale-0 group-hover/tournament:opacity-100 transition-all duration-300 mask-b-from-30% "
                        />
                    </div>
                </PrismicLink>
            </NavSheetLink>
            <div
                data-slot="navigation-menu-link"
                className={cn(
                    className,
                    "min-w-80 h-full min-h-48 flex flex-col justify-between gap-6 lg:gap-12 lg:pr-0 relative rounded-none overflow-hidden",
                    "[&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col rounded-sm text-sm [&_svg:not([class*='size-'])]:size-4 font-headers rounded-none lg:px-4 lg:py-3 py-0 px-0"
                )}
            >
                <div className="relative origin-top-left">
                    <div className="flex items-center gap-3">
                        <TextProtect className="text-xl font-[500]">{tournament.data.title}</TextProtect>
                        {cleanCountryCode(tournament.data.country_code) && (
                            <CountryFlag countryCode={cleanCountryCode(tournament.data.country_code)!} svg className="!w-4.5 !h-4.5 rounded-full border border-secondary/20 object-cover" />
                        )}
                    </div>
                    {statusText && (
                        <span className="text-sm text-muted-foreground font-[500] mt-1.5">
                            {statusText}
                        </span>
                    )}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            {teams.slice(0, 8).map((team) => {
                                if (!isFilled.image(team.data.logo)) return null

                                return (
                                    <NavSheetLink key={team.id}>
                                        <PrismicLink
                                            href={`/club/${team.uid}`}
                                            className="relative size-6.5 flex-shrink-0 opacity-100 hover:opacity-80 transition-opacity"
                                        >
                                            <PrismicNextImage
                                                field={team.data.logo}
                                                fill
                                                className="object-contain"
                                                sizes="32px"
                                                priority
                                                loading="eager"
                                            />
                                        </PrismicLink>
                                    </NavSheetLink>
                                )
                            })}
                            {teams.length > 8 && (
                                <span className="text-xs text-muted-foreground">+{teams.length - 8}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid w-full">
                    <Separator variant="gradient" gradientDirection="toRight" />
                    <CategoryButton href={`/tournament/${tournament.uid}`}>
                        <div className="flex items-center gap-3">
                            <SoccerIcon className="size-4 text-foreground" />
                            Results
                        </div>
                    </CategoryButton>
                    <Separator variant="gradient" gradientDirection="toRight" />
                    <CategoryButton href={`/tournament/${tournament.uid}#standouts`}>
                        <div className="flex items-center gap-3">
                            <ChampionIcon className="size-4 text-foreground" />
                            Awards
                        </div>
                    </CategoryButton>
                    {tournament.data.tickets_available && (
                        <>
                            <Separator variant="gradient" gradientDirection="toRight" />
                            <CategoryButton href={`/tournament/${tournament.uid}/tickets`}>
                                <div className="flex items-center gap-3">
                                    <TicketIcon className="size-4 text-foreground" />
                                    Tickets
                                </div>
                            </CategoryButton>
                            <Separator variant="gradient" gradientDirection="toRight" />
                            <CategoryButton href={`/tournament/${tournament.uid}/vip-cabanas`}>
                                <div className="flex items-center gap-3">
                                    <VIPIcon className="size-4 text-foreground" />
                                    VIP Cabanas
                                </div>
                            </CategoryButton>
                        </>
                    )}
                    <Separator variant="gradient" gradientDirection="toRight" />
                    <CategoryButton href={`/tournament/${tournament.uid}${tournament.data.tickets_available ? '/tickets#schedule' : '/schedule'}`}>
                        <div className="flex items-center gap-3">
                            <WhistleIcon className="size-4 text-foreground" />
                            Schedule
                        </div>
                    </CategoryButton>
                    <Separator variant="gradient" gradientDirection="toRight" />
                    <CategoryButton href={`/tournament/${tournament.uid}#stat-sheet`}>
                        <div className="flex items-center gap-3">
                            <BarGraphIcon className="size-4 text-foreground" />
                            Stat Sheet
                        </div>
                    </CategoryButton>
                </div>
            </div>
        </div>
    )
}
