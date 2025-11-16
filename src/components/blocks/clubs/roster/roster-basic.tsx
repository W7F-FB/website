import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { RosterTeam } from "@/types/components"
import { RosterPlayer } from "./roster-player"

type RosterBasicProps = {
  team?: RosterTeam | null
}

export function RosterBasic({ team }: RosterBasicProps) {
  const positionOrder: Record<string, number> = {
    "Forward": 1,
    "Midfielder": 2,
    "Defender": 3,
    "Goalkeeper": 4,
  }

  const players = (team?.players ?? [])
    .filter(player => {
      if (!player.jerseyNumber) return true
      const num = Number(player.jerseyNumber)
      return isNaN(num) || num <= 100
    })
    .sort((a, b) => {
      const orderA = positionOrder[a.position] ?? 99
      const orderB = positionOrder[b.position] ?? 99
      return orderA - orderB
    })

  return (
    <Table>
      <TableBody>
        {players.length > 0 ? (
          players.map(player => (
            <RosterPlayer key={player.id} player={player} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-muted-foreground text-sm">
              No players available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
