import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { RosterTeam } from "@/types/components"

type RosterBasicProps = {
  team?: RosterTeam | null
}

export function RosterBasic({ team }: RosterBasicProps) {
  const players = team?.players ?? []

  return (
    <Table>
      <TableBody>
        {players.length > 0 ? (
          players.map(player => (
            <TableRow key={player.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {player.jerseyNumber && (
                    <span className="text-muted-foreground font-medium min-w-[2ch]">
                      {player.jerseyNumber}
                    </span>
                  )}
                  <span className="font-medium">{player.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {getPositionAbbreviation(player.position)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getNationalityFlag(player.nationality || player.country || team?.country || team?.countryIso)}
              </TableCell>
            </TableRow>
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

function getPositionAbbreviation(position: string): string {
  const abbreviations: Record<string, string> = {
    "Goalkeeper": "GK",
    "Defender": "DEF",
    "Midfielder": "MID",
    "Forward": "FWD",
    "Substitute": "SUB",
  }
  return abbreviations[position] || position.substring(0, 3).toUpperCase()
}

function getNationalityFlag(countryCode?: string): string {
  if (!countryCode) return "-"
  
  if (countryCode.length === 2) {
    const codePoints = [...countryCode.toUpperCase()].map(char => 
      127397 + char.charCodeAt(0)
    )
    return String.fromCodePoint(...codePoints)
  }
  
  return countryCode
}

