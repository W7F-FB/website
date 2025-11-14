import { Fragment } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LinePattern } from "@/components/blocks/line-pattern"
import type { RosterPlayer, RosterTeam } from "@/types/components"

type RosterProps = {
  team?: RosterTeam | null
}

export function Roster({ team }: RosterProps) {
  const players = team?.players ?? []
  const goalkeepers = sortPlayers(players.filter(player => player.position === "Goalkeeper"))
  const outfield = sortPlayers(players.filter(player => player.position !== "Goalkeeper"))

  const sections = [
    { label: "Goalkeepers", players: goalkeepers },
    { label: "Outfield Players", players: outfield },
  ].filter(section => section.players.length > 0)

  const hasPlayers = sections.length > 0

  return (
    <div className="border border-border/40 rounded-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[90px]">Pos</TableHead>
            <TableHead className="w-[80px]">Age</TableHead>
            <TableHead className="w-[100px]">Height</TableHead>
            <TableHead className="w-[100px]">Weight</TableHead>
            <TableHead>Nationality</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hasPlayers ? (
            sections.map((section, sectionIndex) => (
              <Fragment key={section.label}>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableCell
                    colSpan={6}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {section.label}
                  </TableCell>
                </TableRow>
                {section.players.map(player => (
                  <TableRow key={player.id} className="h-12">
                    <TableCell className="font-medium">{formatPlayerName(player)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{player.position}</TableCell>
                    <TableCell>{formatAge(player)}</TableCell>
                    <TableCell>{formatHeight(player)}</TableCell>
                    <TableCell>{formatWeight(player)}</TableCell>
                    <TableCell>{formatNationality(player, team)}</TableCell>
                  </TableRow>
                ))}
                {sectionIndex < sections.length - 1 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="p-0 h-4">
                      <LinePattern className="h-full w-full" patternSize={7} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground text-sm">
                Roster data unavailable
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function sortPlayers(players: RosterPlayer[]): RosterPlayer[] {
  return players.slice().sort((a, b) => {
    const jerseyA = getJerseyValue(a)
    const jerseyB = getJerseyValue(b)

    if (jerseyA !== jerseyB) return jerseyA - jerseyB

    return a.name.localeCompare(b.name)
  })
}

function getJerseyValue(player: RosterPlayer): number {
  const jersey = player.jerseyNumber

  if (typeof jersey === "number") return jersey

  if (typeof jersey === "string") {
    const parsed = parseInt(jersey, 10)
    if (!Number.isNaN(parsed)) return parsed
  }

  return Number.MAX_SAFE_INTEGER
}

function formatPlayerName(player: RosterPlayer): string {
  const jersey = player.jerseyNumber

  if (jersey === undefined || jersey === null || jersey === "") {
    return player.name
  }

  return `${player.name} #${jersey}`
}

function formatAge(player: RosterPlayer): string {
  const age = calculateAge(player.birthDate)
  return age !== null ? `${age}` : "-"
}

function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null

  const [yearStr, monthStr, dayStr] = birthDate.split("-")
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  if (!year || !month || !day) return null

  const now = new Date()
  let age = now.getUTCFullYear() - year
  const monthDiff = now.getUTCMonth() - (month - 1)
  const dayDiff = now.getUTCDate() - day

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1
  }

  return age
}

function formatHeight(player: RosterPlayer): string {
  const height = player.height
  return height !== undefined && height !== null ? `${height} cm` : "-"
}

function formatWeight(player: RosterPlayer): string {
  const weight = player.weight
  return weight !== undefined && weight !== null ? `${weight} kg` : "-"
}

function formatNationality(player: RosterPlayer, team?: RosterTeam | null): string {
  const nationality = player.nationality || player.country || team?.country || team?.countryIso
  return nationality || "-"
}
