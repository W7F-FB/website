"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from "@/components/ui/motion-tabs";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPlayerFullName, getPlayerJerseyNumber, getPlayerNationality, getPlayerCountry } from "@/types/opta-feeds/f40-squads-feed";
import { cn, getCountryIsoCode } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import type { F40Player } from "@/types/opta-feeds/f40-squads-feed";
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats";
import { getPlayerById, getPlayerStat } from "@/types/opta-feeds/f30-season-stats";
import { LinePattern } from "../line-pattern";

interface RosterCardProps extends React.ComponentProps<"div"> {
  players: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
}

export function RosterCard({ players, seasonStats, className }: RosterCardProps) {
  const goalkeepers = players.filter((p) => p.Position === "Goalkeeper");
  const defenders = players.filter((p) => p.Position === "Defender");
  const midfielders = players.filter((p) => p.Position === "Midfielder");
  const forwards = players.filter((p) => p.Position === "Forward");

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players available
      </div>
    );
  }

  const totalPlayers = goalkeepers.length + defenders.length + midfielders.length + forwards.length;
  if (totalPlayers === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players available in any position
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="goalkeepers" className={cn("", className)}>
        <TabsList className="bg-card w-full">
          <TabsTrigger value="goalkeepers">Goalkeepers ({goalkeepers.length})</TabsTrigger>
          <TabsTrigger value="defenders">Defenders ({defenders.length})</TabsTrigger>
          <TabsTrigger value="midfielders">Midfielders ({midfielders.length})</TabsTrigger>
          <TabsTrigger value="forwards">Forwards ({forwards.length})</TabsTrigger>
        </TabsList>
        <TabsContents>
          <TabsContent value="goalkeepers">
            <PlayersTable players={goalkeepers} seasonStats={seasonStats} />
          </TabsContent>
          <TabsContent value="defenders">
            <PlayersTable players={defenders} seasonStats={seasonStats} />
          </TabsContent>
          <TabsContent value="midfielders">
            <PlayersTable players={midfielders} seasonStats={seasonStats} />
          </TabsContent>
          <TabsContent value="forwards">
            <PlayersTable players={forwards} seasonStats={seasonStats} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}

interface PlayersTableProps {
  players: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
}

function PlayersTable({ players, seasonStats }: PlayersTableProps) {
  if (!players.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players in this position
      </div>
    );
  }

  return (
    <Table>
      <TableBody>
        <TableRow className="bg-background font-headers font-semibold uppercase hover:bg-muted/10 relative overflow-hidden">
          <TableHead className="w-20 relative z-10">#</TableHead>
          <TableHead className="relative z-10">Name</TableHead>
          <TableHead className="relative text-center z-10">Country</TableHead>
          <TableHead className="relative text-center z-10">
            <div className="flex items-center justify-center gap-1.5">
              <span className="mt-0.5">GP</span>
              <Tooltip>
                <TooltipTrigger className="size-3" />
                <TooltipContent header="Games Played">
                  <p>Total number of games played</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TableHead>
          <TableHead className="relative text-center z-10">Goals</TableHead>
          <TableHead className="relative text-center z-10">Assists</TableHead>
          <TableHead className="relative text-center z-10">Cards</TableHead>
          <td className="absolute inset-0 pointer-events-none p-0 m-0 border-0">
            <LinePattern patternSize={5} className="absolute inset-0" />
          </td>
        </TableRow>
        {players.map((player) => (
          <PlayerRow key={player.uID} player={player} seasonStats={seasonStats} />
        ))}
      </TableBody>
    </Table>
  );
}

interface PlayerRowProps {
  player: F40Player;
  seasonStats?: F30SeasonStatsResponse | null;
}

function PlayerRow({ player, seasonStats }: PlayerRowProps) {
  const jerseyNum = getPlayerJerseyNumber(player);
  const fullName = getPlayerFullName(player);
  const nationality = getPlayerNationality(player) || getPlayerCountry(player);
  const countryInput = nationality;
  const countryIso = countryInput ? getCountryIsoCode(countryInput) : null;

  const playerId = parseInt(player.uID.replace("p", ""), 10);

  const f30Player = seasonStats ? getPlayerById(seasonStats, playerId) : null;

  const appearances = f30Player
    ? Number(getPlayerStat(f30Player, "Appearances") ?? 0)
    : 0;

  const goals = f30Player
    ? Number(getPlayerStat(f30Player, "Goals") ?? 0)
    : 0;

  const assists = f30Player
    ? Number(getPlayerStat(f30Player, "Goal Assists") ?? 0)
    : 0;

  const yellowCards = f30Player
    ? Number(getPlayerStat(f30Player, "Yellow Cards") ?? 0)
    : 0;
  const redCards = f30Player
    ? Number(getPlayerStat(f30Player, "Total Red Cards") ?? 0)
    : 0;
    const cards = f30Player ? yellowCards + redCards : 0;

  return (
    <TableRow className="hover:bg-accent/50 transition-colors">
      <TableCell className="w-20">
        <span className="font-medium text-accent-foreground">
          # {jerseyNum !== "Unknown" && jerseyNum !== "?" ? jerseyNum : "-"}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-medium text-base">{fullName}</span>
      </TableCell>
      <TableCell className="text-center">
        {countryIso && (
          <span className="flex items-center justify-center gap-1.5">
            <ReactCountryFlag
              countryCode={countryIso}
              svg
              className="w-4.5! h-4.5! rounded"
            />
          </span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-base">{appearances}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-base">{goals}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-base">{assists}</span>
      </TableCell>
      <TableCell className="text-center">
        <span className="font-medium text-base">{cards}</span>
      </TableCell>
    </TableRow>
  );
}


