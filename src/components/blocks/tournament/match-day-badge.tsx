import { Badge } from "@/components/ui/badge"
import { formatMatchDayDate } from "@/app/(website)/(subpages)/tournament/utils"
import { cn } from "@/lib/utils"

type MatchDayBadgeProps = {
    matchDay?: number
    label?: string
    date?: string | null
    className?: string
}

export function MatchDayBadge({ matchDay, label, date, className }: MatchDayBadgeProps) {
    const displayText = label ?? `Match day ${matchDay}`
    
    return (
        <div className={cn("flex justify-start gap-0.5 pr-3", className)}>
            <div className="flex-grow">
                <Badge fast variant="muted" origin="bottom-left" size="lg" className="text-base lg:text-2xl">
                    {displayText}
                </Badge>
            </div>
            {date && (
                <Badge variant="muted" origin="bottom-left" size="lg" className="text-xs lg:text-base relative">
                    <span className="relative z-10">{formatMatchDayDate(date)}</span>
                </Badge>
            )}
        </div>
    )
}

