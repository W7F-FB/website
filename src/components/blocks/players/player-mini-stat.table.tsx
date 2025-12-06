"use client"

import { F30Player, getPlayerStat } from "@/types/opta-feeds/f30-season-stats"
import { STAT_TYPES, StatMetadata } from "@/lib/opta/dictionaries/stat-dictionary"
import type { PlayerStatDisplay } from "@/types/components"
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

type PlayerMiniStatTableProps = 
  | {
      statDisplays: PlayerStatDisplay[]
      className?: string
      variant?: "table" | "stacked"
      player?: never
      stats?: never
      useCurrentTeamOnly?: never
    }
  | {
      player: F30Player
      stats: StatMetadata[]
      useCurrentTeamOnly?: boolean
      className?: string
      variant?: "table" | "stacked"
      statDisplays?: never
    }

export function PlayerMiniStatTable(props: PlayerMiniStatTableProps) {
  const { className, variant = "table" } = props

  let statDisplays: PlayerStatDisplay[]

  if (props.statDisplays) {
    statDisplays = props.statDisplays
  } else {
    const { player, stats, useCurrentTeamOnly = false } = props
    statDisplays = computeStatDisplays(player, stats, useCurrentTeamOnly)
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {statDisplays.map((stat, idx) => (
          <StatHorizontal
            key={idx}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    )
  }

  return (
    <Table className={cn("rounded-xs table-fixed w-full", className)}>
      <TableHeader className={cn("bg-muted/30")}>
        <TableRow>
          {statDisplays.map((stat, idx) => (
            <TableHead key={idx} className={cn("text-center h-5 text-xxs font-normal text-muted-foreground/90 font-headers border-b border-muted/60 w-[1%]")}>{stat.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={cn("text-sm bg-muted/10")}>
        <TableRow className="">
          {statDisplays.map((stat, idx) => (
            <TableCell key={idx} className={cn("text-center py-0 h-6 text-base text-foreground pt-0.5 font-medium w-[1%]")}>
              {stat.value}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  )
}

function computeStatDisplays(player: F30Player, stats: StatMetadata[], useCurrentTeamOnly: boolean): PlayerStatDisplay[] {
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
    
    const statEntry = Object.entries(STAT_TYPES).find(
      ([, meta]) => meta.stat === stat.stat
    )
    
    if (!statEntry) return 0
    
    const [, metadata] = statEntry
    if (!metadata.f30Key) return 0
    
    const value = getPlayerStat(player, metadata.f30Key, useCurrentTeamOnly)
    
    return value ?? 0
  }

  return stats.map(stat => ({
    label: stat.abbr,
    value: getStatValue(stat)
  }))
}

export { StatHorizontal }


