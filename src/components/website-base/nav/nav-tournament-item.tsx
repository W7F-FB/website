import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import CountryFlag from "react-country-flag"
import { cn, relativeDateRange, formatDateRange } from "@/lib/utils"
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
  if (!tournament?.navImage) {
    return null
  }

  const imageUrl = urlFor(tournament.navImage)
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
    <NavigationMenuLink className={cn(className, "")} asChild>
      <Link href={`/`} className="px-3 pt-6 pb-3 relative rounded-sm overflow-hidden group/tournament">
        <Background>
          <Image
            src={imageUrl}
            alt={tournament.title || 'Tournament'}
            fill
            className="object-cover grayscale-50 opacity-50 group-hover/tournament:scale-102 group-hover/tournament:grayscale-25 group-hover/tournament:opacity-75 transition-all duration-300"
            sizes="1000px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 from-20% to-background/40" />
        </Background>
        <div className="relative flex items-center gap-3">
          <TextProtect className="text-lg font-[500]">{tournament.title}</TextProtect>
          <CountryFlag countryCode={tournament.countryCode!} svg className="!w-6 !h-6 rounded-full border object-cover" />
          {statusText && (
            <span className="text-sm text-muted-foreground font-[400]">
              {statusText}
            </span>
          )}
        </div>
      </Link>
    </NavigationMenuLink>
  )
}
