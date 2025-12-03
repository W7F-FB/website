import { TableCell } from "@/components/ui/table"
import { PrismicNextImage } from "@prismicio/next"
import { cn } from "@/lib/utils"
import type { ImageField } from "@prismicio/client"

type ClubRankCellProps = {
    placement: string
    logo: ImageField | null | undefined
    name: string
    shortName?: string
    useShortName?: boolean
    record?: string
    className?: string
    tournamentStatus?: string
}

export function ClubRankCell({ placement, logo, name, shortName, useShortName = false, record, className, tournamentStatus }: ClubRankCellProps) {
    const isComplete = tournamentStatus === 'Complete'
    const displayName = useShortName && shortName ? shortName : name
    
    return (
        <TableCell className={cn("h-12 py-0 font-medium font-headers pr-10", className)}>
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "text-xs w-8",
                        isComplete && placement === '1st' && "font-semibold bg-gold-gradient bg-clip-text text-transparent",
                        isComplete && placement === '2nd' && "font-semibold bg-silver-gradient bg-clip-text text-transparent",
                        isComplete && placement === '3rd' && "font-semibold bg-bronze-gradient bg-clip-text text-transparent",
                        placement === 'E' && "text-muted-foreground/80",
                        !['1st', '2nd', '3rd', 'E'].includes(placement) && "text-muted-foreground"
                    )}>{placement}</div>
                    {logo && (
                        <div className="relative size-7 flex-shrink-0">
                            <PrismicNextImage
                                field={logo}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <span>{displayName}</span>
                </div>
                {record && (
                    <span className="min-w-10 text-right flex-grow">{record}</span>
                )}
            </div>
        </TableCell>
    )
}

