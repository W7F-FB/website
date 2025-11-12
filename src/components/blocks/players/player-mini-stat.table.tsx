"use client"

import { F30Player, getPlayerStat } from "@/types/opta-feeds/f30-season-stats"
import { F30_STAT_TYPES, StatMetadata } from "@/lib/opta/f30-stat-dictionary"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface StatHorizontalProps {
  label: string
  value: string | number
  className?: string
}

function StatHorizontal({ label, value, className }: StatHorizontalProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex-grow border-t border-dotted"></div>
      <span className="font-medium text-sm">{value}</span>
    </div>
  )
}

interface PlayerMiniStatTableProps {
  player: F30Player
  stats: StatMetadata[]
  useCurrentTeamOnly?: boolean
  className?: string
  variant?: "table" | "stacked"
}

export function PlayerMiniStatTable({
  player,
  stats,
  useCurrentTeamOnly = false,
  className,
  variant = "table",
}: PlayerMiniStatTableProps) {
  const getStatValue = (stat: StatMetadata) => {
    if (stat.stat === "totalShotsConceded") {
      const saves = getPlayerStat(player, "Saves Made", useCurrentTeamOnly)
      const goalsConceded = getPlayerStat(player, "Goals Conceded", useCurrentTeamOnly)
      
      if (saves !== undefined && goalsConceded !== undefined) {
        return Number(saves) + Number(goalsConceded)
      }
      return 0
    }
    
    if (stat.stat === "shootingAccuracy") {
      const goals = getPlayerStat(player, "Goals", useCurrentTeamOnly)
      const shotsOnTarget = getPlayerStat(player, "Shots On Target ( inc goals )", useCurrentTeamOnly)
      
      if (goals !== undefined && shotsOnTarget !== undefined && Number(shotsOnTarget) > 0) {
        const percentage = (Number(goals) / Number(shotsOnTarget)) * 100
        return percentage.toFixed(1) + '%'
      }
      return 0
    }
    
    const statEntry = Object.entries(F30_STAT_TYPES).find(
      ([, meta]) => meta.stat === stat.stat
    )
    
    if (!statEntry) return 0
    
    const [statName] = statEntry
    const value = getPlayerStat(player, statName, useCurrentTeamOnly)
    
    return value ?? 0
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {stats.map((stat) => (
          <StatHorizontal
            key={stat.stat}
            label={stat.abbr}
            value={getStatValue(stat)}
          />
        ))}
      </div>
    )
  }

  return (
    <Table className={cn("rounded-xs", className)}>
      <TableHeader className={cn("bg-muted/20")}>
        <TableRow>
          {stats.map((stat) => (
            <TableHead key={stat.stat} className={cn("text-center h-6 text-xs font-medium font-headers")}>{stat.abbr}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={cn("text-sm bg-muted/10")}>
        <TableRow>
          {stats.map((stat) => (
            <TableCell key={stat.stat} className={cn("text-center text-muted-foreground/90 ")}>
              {getStatValue(stat)}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}

export { StatHorizontal }


