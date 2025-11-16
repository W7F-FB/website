import { TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { OPTA_POSITIONS } from "@/lib/opta/dictionaries/position-dictionary"
import { getCountryIsoCode } from "@/lib/utils"
import ReactCountryFlag from "react-country-flag"
import { SoccerIcon } from "@/components/website-base/icons"
import type { MatchLineupPlayer } from "@/types/components"
import { CARD_REASONS } from "@/lib/opta/dictionaries/qualifiers"
import type { F24Event } from "@/types/opta-feeds/f24-match-events"

type MatchLineupPlayerProps = {
  player: MatchLineupPlayer
}

type PlayerEventDisplay = {
  type: 'goal' | 'card'
  time: number
  event: F24Event
  cardType?: 'yellow' | 'red'
  cardReason?: string
}

function getCardInfo(event: F24Event): { cardType: 'yellow' | 'red', reason?: string } | null {
  if (event.type_id !== 17) return null
  
  const qualifiers = Array.isArray(event.Q) ? event.Q : event.Q ? [event.Q] : []
  
  let cardType: 'yellow' | 'red' = 'yellow'
  let reason: string | undefined
  
  for (const qualifier of qualifiers) {
    if (qualifier.qualifier_id === 31) {
      cardType = 'yellow'
    } else if (qualifier.qualifier_id === 32) {
      cardType = 'red'
    } else if (qualifier.qualifier_id === 33) {
      cardType = 'red'
    }
    
    if (CARD_REASONS[qualifier.qualifier_id]) {
      reason = CARD_REASONS[qualifier.qualifier_id]
    }
  }
  
  return { cardType, reason }
}

export function MatchLineupPlayer({ player }: MatchLineupPlayerProps) {
  const isCaptain = player.Captain === 1 || player.Captain === true
  const countryInput = player.nationality || player.country
  const countryIso = getCountryIsoCode(countryInput)

  const goals = player.Position === 'Goalkeeper' ? [] : (player.events?.filter(event => event.type_id === 16) || [])
  const cards = player.events?.filter(event => event.type_id === 17) || []
  
  const eventDisplays: PlayerEventDisplay[] = [
    ...goals.map(event => ({
      type: 'goal' as const,
      time: event.min,
      event
    })),
    ...cards.map(event => {
      const cardInfo = getCardInfo(event)
      return {
        type: 'card' as const,
        time: event.min,
        event,
        cardType: cardInfo?.cardType || 'yellow',
        cardReason: cardInfo?.reason
      }
    })
  ].sort((a, b) => a.time - b.time)

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {player.ShirtNumber && (
            <span className="text-muted-foreground font-medium w-6 text-[0.7rem] h-[1.2em]">
              #{player.ShirtNumber}
            </span>
          )}
          <span className="font-medium h-[1.25em]">{player.name || player.PlayerRef}</span>

          <span className="text-muted-foreground text-xs h-[1.1em]">
            {getPositionAbbreviation(player.Position)}
          </span>
          {eventDisplays.map((eventDisplay, index) => (
            eventDisplay.type === 'goal' ? (
              <Tooltip key={`${eventDisplay.event.id}-${index}`}>
                <TooltipTrigger>
                  <SoccerIcon className="text-foreground size-3" />
                </TooltipTrigger>
                <TooltipContent className="font-headers font-medium">
                  {eventDisplay.event.min}&apos;
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip key={`${eventDisplay.event.id}-${index}`}>
                <TooltipTrigger>
                  <div className={`h-3.5 w-2.5 rounded-sm ${
                    eventDisplay.cardType === 'red' ? 'bg-red-600' : 'bg-yellow-500'
                  }`} />
                </TooltipTrigger>
                <TooltipContent className="font-headers font-medium [&>div]:p-0">
                  <div className="grid grid-cols-[auto_1fr]">
                    <div className="h-full px-2 pl-3 flex items-center border-r relative">
                      <div className={`absolute h-full top-0 bottom-0 left-0 w-1 ${
                        eventDisplay.cardType === 'red' 
                          ? 'bg-red-600' 
                          : 'bg-yellow-500'
                      }`} />
                      {eventDisplay.event.min}&apos;
                    </div>
                    {eventDisplay.cardReason && (
                      <div className="text-xs text-muted-foreground font-body mt-0.5 p-2">{eventDisplay.cardReason}</div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right pr-3">
        <div className="relative flex items-center justify-end">
          {isCaptain && (
            <Tooltip>
              <TooltipTrigger>
                <div className="absolute right-6 text-xxs text-muted-foreground opacity-50 size-3.5 border border-muted-foreground rounded-xs bg-muted/30  flex items-center justify-center">
                  <div className="font-headers font-semibold select-none">C</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Captain
              </TooltipContent>
            </Tooltip>
          )}
          {countryIso && (
            <ReactCountryFlag
              countryCode={countryIso}
              svg
              className="!w-4.5 !h-4.5 rounded"
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

function getPositionAbbreviation(position: string): string {
  return OPTA_POSITIONS[position]?.abbr || position.substring(0, 3).toUpperCase()
}

