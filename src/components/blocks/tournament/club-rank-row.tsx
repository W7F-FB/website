import { TableCell } from "@/components/ui/table"
import { PrismicNextImage } from "@prismicio/next"
import { cn } from "@/lib/utils"
import type { ImageField } from "@prismicio/client"
import Link from "next/link"

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
}

export function ClubRankRow({ placement, logo, name, shortName, useShortName = false, record, className, tournamentStatus, href }: ClubRankRowProps) {
    const isComplete = tournamentStatus === 'Complete'
    const displayName = useShortName && shortName ? shortName : name
    
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
        </div>
    )
    
    return (
        <>
            <TableCell className={cn(
                "h-12 py-0 font-medium font-headers text-xxs lg:text-xs lg:w-10 pl-4 pr-0 pr-3",
                isComplete && placement === '1st' && "font-semibold bg-gold-gradient bg-clip-text text-transparent",
                isComplete && placement === '2nd' && "font-semibold bg-silver-gradient bg-clip-text text-transparent",
                isComplete && placement === '3rd' && "font-semibold bg-bronze-gradient bg-clip-text text-transparent",
                placement === 'E' && "text-muted-foreground/80",
                !['1st', '2nd', '3rd', 'E'].includes(placement) && "text-muted-foreground",
                className
            )}>
                {placement}
            </TableCell>
            <TableCell className="h-12 py-0 font-medium font-headers text-xs lg:text-sm px-2">
                {href ? (
                    <Link className="w-fit block" href={href}>
                        {logoAndNameContent}
                    </Link>
                ) : (
                    logoAndNameContent
                )}
            </TableCell>
            <TableCell className="h-12 py-0 font-medium font-headers text-xs lg:text-sm text-right pr-3 pl-0 w-12 lg:w-14">
                {record}
            </TableCell>
        </>
    )
}

