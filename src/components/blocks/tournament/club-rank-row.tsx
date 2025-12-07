import { TableCell } from "@/components/ui/table"
import { PrismicNextImage } from "@prismicio/next"
import { cn, getCountryIsoCode } from "@/lib/utils"
import type { ImageField } from "@prismicio/client"
import Link from "next/link"
import ReactCountryFlag from "react-country-flag"
import { QUALIFIED_ALIVE } from "@/app/(website)/(subpages)/tournament/utils"

type ClubRankRowProps = {
    placement: string
    logo: ImageField | null | undefined
    name: string
    shortName?: string
    useShortName?: boolean
    record?: string
    className?: string
    tournamentStatus?: string
    href?: string
    country?: string | null
    hideRecord?: boolean
}

export function ClubRankRow({ placement, logo, name, shortName, useShortName = false, record, className, tournamentStatus, href, country, hideRecord = false }: ClubRankRowProps) {
    const isComplete = tournamentStatus === 'Complete'
    const displayName = useShortName && shortName ? shortName : name
    const countryIso = country ? getCountryIsoCode(country) : null
    
    const logoAndNameContent = (
        <div className={cn("flex items-center gap-2", href && "group")}>
            {logo && (
                <div className="relative lg:size-7 size-5 flex-shrink-0">
                    <PrismicNextImage
                        field={logo}
                        fill
                        className="object-contain"
                    />
                </div>
            )}
            <span className={cn(
                "overflow-hidden text-ellipsis whitespace-nowrap",
                href && "group-hover:underline"
            )}>
                {displayName}
            </span>
            {countryIso && (
                <ReactCountryFlag
                    countryCode={countryIso}
                    svg
                    className="!w-4 !h-4 rounded flex-shrink-0"
                />
            )}
        </div>
    )
    
    return (
        <>
            <TableCell className={cn(
                "h-12 py-0 font-medium font-headers text-xxs lg:text-xs lg:w-10 pl-4 pr-0 pr-3",
                placement === '1st' && isComplete && "font-semibold bg-gold-gradient bg-clip-text text-transparent",
                placement === '2nd' && isComplete && "font-semibold bg-silver-gradient bg-clip-text text-transparent",
                placement === '3rd' && isComplete && "font-semibold bg-bronze-gradient bg-clip-text text-transparent",
                placement === '4th' && "text-muted-foreground",
                placement === QUALIFIED_ALIVE && "text-muted-foreground",
                placement === 'E' && "text-muted-foreground/80",
                placement === '-' && "text-muted-foreground",
                !['1st', '2nd', '3rd', '4th', QUALIFIED_ALIVE, 'E', '-'].includes(placement) && "text-muted-foreground",
                className
            )}>
                {placement}
            </TableCell>
            <TableCell className={cn(
                "h-12 py-0 font-medium font-headers px-2 text-xs lg:text-sm",
                hideRecord && "pr-6"
            )}>
                {href ? (
                    <Link className="w-fit block" href={href}>
                        {logoAndNameContent}
                    </Link>
                ) : (
                    logoAndNameContent
                )}
            </TableCell>
            {!hideRecord && (
                <TableCell className="h-12 py-0 font-medium font-headers text-xs lg:text-sm text-right pr-3 pl-0 w-12 lg:w-14">
                    {record}
                </TableCell>
            )}
        </>
    )
}

