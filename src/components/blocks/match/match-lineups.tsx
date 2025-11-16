"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { MatchLineupPlayer as MatchLineupPlayerComponent } from "@/components/blocks/match/match-lineup-player"
import type { F9TeamData } from "@/types/opta-feeds/f9-match"
import type { F40Team } from "@/types/opta-feeds/f40-squads-feed"
import type { MatchLineupPlayer } from "@/types/components"
import type { F24EventDetailsFeed } from "@/types/opta-feeds/f24-match-events"
import { getPlayerStat } from "@/types/opta-feeds/f40-squads-feed"
import { normalizeOptaId } from "@/lib/opta/utils"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

type MatchLineupsProps = {
  homeTeamData: F9TeamData
  awayTeamData: F9TeamData
  homeSquadTeam?: F40Team
  awaySquadTeam?: F40Team
  homeLogo?: string | null
  awayLogo?: string | null
  f24Events?: F24EventDetailsFeed | null
}

export function MatchLineups({ homeTeamData, awayTeamData, homeSquadTeam, awaySquadTeam, homeLogo, awayLogo, f24Events }: MatchLineupsProps) {
  const enrichPlayers = (teamData: F9TeamData, squadTeam?: F40Team): MatchLineupPlayer[] => {
    if (!teamData.PlayerLineUp) return []
    const matchPlayers = Array.isArray(teamData.PlayerLineUp.MatchPlayer) 
      ? teamData.PlayerLineUp.MatchPlayer 
      : [teamData.PlayerLineUp.MatchPlayer]
    
    return matchPlayers.map(f9Player => {
      const f40Player = squadTeam?.Player?.find(p => p.uID === f9Player.PlayerRef)
      
      const game = Array.isArray(f24Events?.Games?.Game) 
        ? f24Events.Games.Game[0] 
        : f24Events?.Games?.Game
      
      const playerEvents = game?.Event?.filter(
        event => event.player_id?.toString() === normalizeOptaId(f9Player.PlayerRef)
      ) || []
      
      if (!f40Player) {
        return {
          ...f9Player,
          events: playerEvents,
        } as MatchLineupPlayer
      }

      const teamCountry = squadTeam?.country || squadTeam?.Country
      const position = f9Player.Position === "Substitute" && f40Player.Position !== "Substitute" 
        ? f40Player.Position 
        : f9Player.Position
      
      return {
        ...f9Player,
        Position: position,
        name: f40Player.Name,
        nationality: getPlayerStat(f40Player, "first_nationality")?.toString() || teamCountry,
        country: getPlayerStat(f40Player, "country")?.toString() || teamCountry,
        events: playerEvents,
      } as MatchLineupPlayer
    })
  }

  const homePlayers = enrichPlayers(homeTeamData, homeSquadTeam)
  const awayPlayers = enrichPlayers(awayTeamData, awaySquadTeam)

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger variant="underline" value="home" className="flex-1">
          <div className="flex items-center gap-2">
            {homeLogo && (
              <Image
                src={homeLogo}
                alt="Home Team"
                width={100}
                height={100}
                className="object-contain size-6"
              />
            )}
            <span className="font-headers">Home</span>
          </div>
        </TabsTrigger>
        <TabsTrigger variant="underline" value="away" className="flex-1">
          <div className="flex items-center gap-2">
            {awayLogo && (
              <Image
                src={awayLogo}
                alt="Away Team"
                width={100}
                height={100}
                className="object-contain size-6"
              />
            )}
            <span className="font-headers">Away</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="py-3">
        <LineupAccordion players={homePlayers} />
      </TabsContent>
      <TabsContent value="away" className="py-3">
        <LineupAccordion players={awayPlayers} />
      </TabsContent>
    </Tabs>
  )
}

function LineupAccordion({ players }: { players: MatchLineupPlayer[] }) {
  const filteredPlayers = players.filter(player => {
    if (!player.ShirtNumber) return true
    const num = Number(player.ShirtNumber)
    return isNaN(num) || num <= 500
  })

  const starters = filteredPlayers.filter(p => p.Status === "Start")
  const substitutes = filteredPlayers.filter(p => p.Status === "Sub")

  const positionOrder: Record<string, number> = {
    "Striker": 1,
    "Forward": 1,
    "Midfielder": 2,
    "Defender": 3,
    "Goalkeeper": 4,
  }

  const sortPlayers = (playerList: MatchLineupPlayer[]) => {
    return [...playerList].sort((a, b) => {
      const orderA = positionOrder[a.Position] ?? 99
      const orderB = positionOrder[b.Position] ?? 99
      return orderA - orderB
    })
  }

  const sortedStarters = sortPlayers(starters)
  const sortedSubstitutes = sortPlayers(substitutes)

  return (

    <Accordion
      type="single"
      collapsible
      defaultValue="starters"
      className="w-full"
    >
      <Separator variant="gradient" gradientDirection="toRight" />
      <AccordionItem value="starters">
        <AccordionTrigger bgLines plusMinus iconClass="size-3" className="text-sm py-2.5 px-2 items-center">
          <div className="flex items-center gap-2">
            <span className="font-headers">Starting Lineup</span>
            <span className="text-muted-foreground text-xxs mt-0.5 font-body">
              ({sortedStarters.length})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="!p-0 !px-0">
          {sortedStarters.length > 0 ? (
            <Table>
              <TableBody>
                {sortedStarters.map(player => (
                  <MatchLineupPlayerComponent key={player.PlayerRef} player={player} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground text-sm">
                    No starting players available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="substitutes">
          <AccordionTrigger bgLines plusMinus iconClass="size-3" className="text-sm py-2.5 px-2 items-center">
          <div className="flex items-center gap-2">
            <span className="font-headers">Substitutes</span>
            <span className="text-muted-foreground text-xxs mt-0.5 font-body">
              ({sortedSubstitutes.length})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="!p-0 !px-0">
          {sortedSubstitutes.length > 0 ? (
            <Table>
              <TableBody>
                {sortedSubstitutes.map(player => (
                  <MatchLineupPlayerComponent key={player.PlayerRef} player={player} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground text-sm">
                    No substitute players available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

