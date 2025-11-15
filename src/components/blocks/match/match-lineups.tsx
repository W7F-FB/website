"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RosterBasic } from "@/components/blocks/clubs/roster/roster-basic"
import type { F40Team, F40Player } from "@/types/opta-feeds/f40-squads-feed"
import { getPlayerStat } from "@/types/opta-feeds/f40-squads-feed"
import type { RosterTeam } from "@/types/components"
import Image from "next/image"

type MatchLineupsProps = {
  homeTeam?: F40Team
  awayTeam?: F40Team
  homeLogo?: string | null
  awayLogo?: string | null
}

export function MatchLineups({ homeTeam, awayTeam, homeLogo, awayLogo }: MatchLineupsProps) {
  const homeRoster = convertF40ToRoster(homeTeam)
  const awayRoster = convertF40ToRoster(awayTeam)

  const homeTeamName = homeTeam?.short_club_name || homeTeam?.Name || "Home Team"
  const awayTeamName = awayTeam?.short_club_name || awayTeam?.Name || "Away Team"

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger variant="underline" value="home" className="flex-1">
          <div className="flex items-center gap-2">
            {homeLogo && (
              <Image
                src={homeLogo}
                alt={homeTeamName}
                width={100}
                height={100}
                className="object-contain size-6"
              />
            )}
            <span className="font-headers">{homeTeamName}</span>
          </div>
        </TabsTrigger>
        <TabsTrigger variant="underline" value="away" className="flex-1">
          <div className="flex items-center gap-2">
            {awayLogo && (
              <Image
                src={awayLogo}
                alt={awayTeamName}
                width={100}
                height={100}
                className="object-contain size-6"
              />
            )}
            <span className="font-headers">{awayTeamName}</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <RosterBasic team={homeRoster} />
      </TabsContent>
      <TabsContent value="away">
        <RosterBasic team={awayRoster} />
      </TabsContent>
    </Tabs>
  )
}

function convertF40ToRoster(team?: F40Team): RosterTeam | null {
  if (!team) return null

  return {
    id: team.uID,
    name: team.short_club_name || team.Name,
    country: team.country || team.Country,
    countryIso: team.country_iso,
    players: team.Player?.map(convertF40Player) || []
  }
}

function convertF40Player(player: F40Player) {
  return {
    id: player.uID,
    name: player.Name,
    position: player.Position,
    jerseyNumber: getPlayerStat(player, "jersey_num"),
    nationality: getPlayerStat(player, "first_nationality")?.toString(),
    country: getPlayerStat(player, "country")?.toString()
  }
}

