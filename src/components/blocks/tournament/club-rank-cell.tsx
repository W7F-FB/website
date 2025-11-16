import { TableCell } from "@/components/ui/table"
import { PrismicNextImage } from "@prismicio/next"
import { cn } from "@/lib/utils"
import type { ImageField } from "@prismicio/client"

type ClubRankCellProps = {
    placement: string
    logo: ImageField | null | undefined
    name: string
    record?: string
    className?: string
}

export function ClubRankCell({ placement, logo, name, record, className }: ClubRankCellProps) {
    return (
        <TableCell className={cn("h-12 py-0 font-medium font-headers pr-10", className)}>
            <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    <span className={cn("text-muted-foreground text-xs w-8", placement === 'E' && "text-muted-foreground/80")}>{placement}</span>
                    {logo && (
                        <div className="relative size-7 flex-shrink-0">
                            <PrismicNextImage
                                field={logo}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <span>{name}</span>
                </div>
                {record && (
                    <span className="min-w-10 text-right flex-grow">{record}</span>
                )}
            </div>
        </TableCell>
    )
}

