import { TableCell, TableRow } from "@/components/ui/table"
import type { RosterPlayer as RosterPlayerType } from "@/types/components"
import { OPTA_POSITIONS } from "@/lib/opta/dictionaries/position-dictionary"
import { getCountryIsoCode } from "@/lib/utils"
import ReactCountryFlag from "react-country-flag"

type RosterPlayerProps = {
  player: RosterPlayerType
}

export function RosterPlayer({ player }: RosterPlayerProps) {
  const countryInput = player.nationality || player.country
  const countryIso = getCountryIsoCode(countryInput)

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {player.jerseyNumber && (
            <span className="text-muted-foreground font-medium w-6 text-[0.7rem] ">
              #{player.jerseyNumber}
            </span>
          )}
          <span className="font-medium">{player.name}</span>
          <span className="text-muted-foreground text-sm">
            {getPositionAbbreviation(player.position)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {countryIso && (
          <ReactCountryFlag
            countryCode={countryIso}
            svg
            className="!w-4.5 !h-4.5 rounded"
          />
        )}
      </TableCell>
    </TableRow>
  )
}

function getPositionAbbreviation(position: string): string {
  return OPTA_POSITIONS[position]?.abbr || position.substring(0, 3).toUpperCase()
}

