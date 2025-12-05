import { TableCell } from "@/components/ui/table"
import { PrismicNextImage } from "@prismicio/next"
import { cn } from "@/lib/utils"
import type { ImageField } from "@prismicio/client"
import Link from "next/link"

type ClubRankCellProps = {
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

export function ClubRankCell({ placement, logo, name, shortName, useShortName = false, record, className, tournamentStatus, href }: ClubRankCellProps) {
    const isComplete = tournamentStatus === 'Complete'
    const displayName = useShortName && shortName ? shortName : name
    
    const logoAndNameContent = (
        <>
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
                "overflow-hidden lg:max-w-none max-w-22 text-ellipsis",
                href && "group-hover:underline"
            )}>
                {displayName}
            </span>
        </>
    )
    
    return (
        <TableCell className={cn("h-12 py-0 font-medium font-headers lg:pr-10 pr-3 text-xs lg:sm", className)}>
            <div className="flex items-center gap-3 justify-between">
                <div className={cn("flex items-center gap-3", href && "group")}>
                    <div className={cn(
                        "text-xxs lg:text-xs lg:w-8 w-6",
                        isComplete && placement === '1st' && "font-semibold bg-gold-gradient bg-clip-text text-transparent",
                        isComplete && placement === '2nd' && "font-semibold bg-silver-gradient bg-clip-text text-transparent",
                        isComplete && placement === '3rd' && "font-semibold bg-bronze-gradient bg-clip-text text-transparent",
                        placement === 'E' && "text-muted-foreground/80",
                        !['1st', '2nd', '3rd', 'E'].includes(placement) && "text-muted-foreground"
                    )}>{placement}</div>
                    {href ? (
                        <Link href={href} className="flex items-center gap-3">
                            {logoAndNameContent}
                        </Link>
                    ) : (
                        logoAndNameContent
                    )}
                </div>
                {record && (
                    <span className="min-w-10 text-right flex-grow">{record}</span>
                )}
            </div>
        </TableCell>
    )
}

