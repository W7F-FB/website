"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import type { F40Team, F40Player } from "@/types/opta-feeds/f40-squads-feed"
import { getPlayerStat, getPlayerJerseyNumber } from "@/types/opta-feeds/f40-squads-feed"
import { getCountryIsoCode } from "@/lib/utils"
import ReactCountryFlag from "react-country-flag"
import { OPTA_POSITIONS } from "@/lib/opta/dictionaries/position-dictionary"
import Image from "next/image"

type MatchRostersProps = {
  homeSquadTeam?: F40Team
  awaySquadTeam?: F40Team
  homeLogo?: string | null
  awayLogo?: string | null
}

export function MatchRosters({ homeSquadTeam, awaySquadTeam, homeLogo, awayLogo }: MatchRostersProps) {
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
        {homeSquadTeam ? (
          <RosterAccordion squadTeam={homeSquadTeam} />
        ) : (
          <p className="text-muted-foreground text-sm">No roster available</p>
        )}
      </TabsContent>
      <TabsContent value="away" className="py-3">
        {awaySquadTeam ? (
          <RosterAccordion squadTeam={awaySquadTeam} />
        ) : (
          <p className="text-muted-foreground text-sm">No roster available</p>
        )}
      </TabsContent>
    </Tabs>
  )
}

function RosterAccordion({ squadTeam }: { squadTeam: F40Team }) {
  const players = squadTeam.Player || []
  const teamCountry = squadTeam.country || squadTeam.Country

  const goalkeepers = players.filter(p => p.Position === "Goalkeeper")
  const outfielders = players.filter(p => p.Position !== "Goalkeeper")

  const positionOrder: Record<string, number> = {
    "Forward": 1,
    "Midfielder": 2,
    "Defender": 3,
  }

  const sortedOutfielders = [...outfielders].sort((a, b) => {
    const orderA = positionOrder[a.Position] ?? 99
    const orderB = positionOrder[b.Position] ?? 99
    if (orderA !== orderB) return orderA - orderB
    return a.Name.localeCompare(b.Name)
  })

  const sortedGoalkeepers = [...goalkeepers].sort((a, b) => a.Name.localeCompare(b.Name))

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="outfielders"
      className="w-full"
    >
      <Separator variant="gradient" gradientDirection="toRight" />
      <AccordionItem value="outfielders">
        <AccordionTrigger bgLines plusMinus iconClass="size-3" className="text-sm py-2.5 px-2 items-center">
          <div className="flex items-center gap-2">
            <span className="font-headers text-sm">Outfielders</span>
            <span className="text-muted-foreground text-xxs mt-0.5 font-body">
              ({sortedOutfielders.length})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="!p-0 !px-0">
          {sortedOutfielders.length > 0 ? (
            <Table>
              <TableBody>
                {sortedOutfielders.map(player => (
                  <RosterPlayerRow key={player.uID} player={player} teamCountry={teamCountry} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground text-sm">
                    No outfielders available
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="goalkeepers">
        <AccordionTrigger bgLines plusMinus iconClass="size-3" className="text-sm py-2.5 px-2 items-center">
          <div className="flex items-center gap-2">
            <span className="font-headers text-sm">Goalkeepers</span>
            <span className="text-muted-foreground text-xxs mt-0.5 font-body">
              ({sortedGoalkeepers.length})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="!p-0 !px-0">
          {sortedGoalkeepers.length > 0 ? (
            <Table>
              <TableBody>
                {sortedGoalkeepers.map(player => (
                  <RosterPlayerRow key={player.uID} player={player} teamCountry={teamCountry} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground text-sm">
                    No goalkeepers available
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

function RosterPlayerRow({ player, teamCountry }: { player: F40Player; teamCountry?: string }) {
  const nationality = getPlayerStat(player, "first_nationality")?.toString() || teamCountry
  const countryIso = getCountryIsoCode(nationality)
  const jerseyNumber = getPlayerJerseyNumber(player)
  const hasJerseyNumber = jerseyNumber && jerseyNumber !== "Unknown"

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {hasJerseyNumber && (
            <span className="text-muted-foreground font-medium w-6 text-[0.7rem] h-[1.2em]">
              #{jerseyNumber}
            </span>
          )}
          <span className="font-medium h-[1.25em]">{player.Name}</span>
          <span className="text-muted-foreground text-xs h-[1.1em]">
            {getPositionAbbreviation(player.Position)}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right pr-3">
        <div className="relative flex items-center justify-end">
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

