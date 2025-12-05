"use client";

import React, { Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPlayerFullName, getPlayerJerseyNumber, getPlayerNationality, getPlayerCountry } from "@/types/opta-feeds/f40-squads-feed";
import { cn, getCountryIsoCode } from "@/lib/utils";
import type { F40Player } from "@/types/opta-feeds/f40-squads-feed";
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats";
import { getPlayerById, getPlayerStat } from "@/types/opta-feeds/f30-season-stats";
import { LinePattern } from "@/components/blocks/line-pattern";
import ReactCountryFlag from "react-country-flag";

interface RosterCardProps extends React.ComponentProps<"div"> {
  players: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
}

export function RosterCard({ players, seasonStats, className }: RosterCardProps) {
  const filteredPlayers = players.filter((p) => p.Position !== "Substitute");
  const goalkeepers = filteredPlayers.filter((p) => p.Position === "Goalkeeper");
  const outfieldPlayers = filteredPlayers.filter((p) => p.Position !== "Goalkeeper");

  if (filteredPlayers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players available
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <PlayersTable
        outfieldPlayers={outfieldPlayers}
        goalkeepers={goalkeepers}
        seasonStats={seasonStats}
      />
    </div>
  );
}

interface PlayersTableProps {
  outfieldPlayers: F40Player[];
  goalkeepers: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
}

function PlayersTable({ outfieldPlayers, goalkeepers, seasonStats }: PlayersTableProps) {
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  return (
    <div className="flex gap-0">
      <div className="border-r border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead hasSelect className="md:pl-6 pl-3 md:pr-10 pr-3">
                <span className="font-headers font-semibold text-xs md:text-base">Outfield ({outfieldPlayers.length})</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outfieldPlayers.length > 0 && (
              <Fragment>
                {outfieldPlayers.map((player) => (
                  <TableRow
                    key={player.uID}
                    onMouseEnter={() => setHoveredRow(player.uID)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "h-12 py-0 hover:bg-transparent",
                      hoveredRow === player.uID && "bg-muted/30 hover:bg-muted/30"
                    )}
                  >
                    <TableCell className="h-12 py-0 md:pl-6 pl-3 font-medium font-headers md:pr-10 pr-3">
                      <div className="flex items-center md:gap-3 gap-2">
                        <div className="grid grid-cols-[auto_1fr] gap-2.5">
                          <PlayerCountryFlag player={player} />
                          <div className="flex flex-col items-start">
                            <span className="text-xs overflow-hidden md:max-w-none max-w-24 text-ellipsis">{getPlayerFullName(player)}</span>
                            <span className="text-muted-foreground/80 font-normal text-[0.65rem]">
                              #{getPlayerJerseyNumber(player) !== "Unknown" && getPlayerJerseyNumber(player) !== "?" ? getPlayerJerseyNumber(player) : "-"} • {player.Position || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            )}
            {goalkeepers.length > 0 && (
              <Fragment>
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={999} className="h-6 p-0">
                    <LinePattern className="h-full w-full" patternSize={7} />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/20">
                  <TableHead hasSelect className="md:pl-6 pl-3 md:pr-10 pr-3">
                    <span className="font-headers font-semibold text-xs md:text-base">Goalkeepers ({goalkeepers.length})</span>
                  </TableHead>
                </TableRow>
                {goalkeepers.map((player) => (
                  <TableRow
                    key={player.uID}
                    onMouseEnter={() => setHoveredRow(player.uID)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "h-12 py-0 hover:bg-transparent",
                      hoveredRow === player.uID && "bg-muted/30 hover:bg-muted/30"
                    )}
                  >
                    <TableCell className="h-12 py-0 md:pl-6 pl-3 font-medium font-headers md:pr-10 pr-3">
                      <div className="flex items-center md:gap-3 gap-2">
                        <div className="grid grid-cols-[auto_1fr] gap-2.5">
                          <PlayerCountryFlag player={player} />
                          <div className="flex flex-col items-start">
                            <span className="text-xs overflow-hidden md:max-w-none max-w-24 text-ellipsis">{getPlayerFullName(player)}</span>
                            <span className="text-muted-foreground/80 font-normal text-[0.65rem]">
                              #{getPlayerJerseyNumber(player) !== "Unknown" && getPlayerJerseyNumber(player) !== "?" ? getPlayerJerseyNumber(player) : "-"} • {player.Position || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Goals</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">GP</span>
                  <Tooltip>
                    <TooltipTrigger className="size-3" />
                    <TooltipContent header="Games Played">
                      <p>Total number of games played</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Mins</span>
                  <Tooltip>
                    <TooltipTrigger className="size-3" />
                    <TooltipContent header="Time Played">
                      <p>Total minutes played</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Shots/On Target</span>
                  <Tooltip>
                    <TooltipTrigger className="size-3" />
                    <TooltipContent>
                      <p>Total shots at goal (excluding own goals and blocked shots) / All shots which either force a goalkeeper save or score a goal</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Assists</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Fouls</span>
                </div>
              </TableHead>
              <TableHead className="pr-6">
                <div className="flex items-center gap-1.5">
                  <span className="mt-0.5">Cards</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outfieldPlayers.length > 0 && (
              <Fragment>
                {outfieldPlayers.map((player) => (
                  <TableRow
                    key={player.uID}
                    onMouseEnter={() => setHoveredRow(player.uID)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "h-12 py-0 text-base hover:bg-transparent",
                      hoveredRow === player.uID && "bg-muted/30 hover:bg-muted/30"
                    )}
                  >
                    <OutfieldStatsCells player={player} seasonStats={seasonStats} />
                  </TableRow>
                ))}
              </Fragment>
            )}
            {goalkeepers.length > 0 && (
              <Fragment>
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-6 p-0">
                    <LinePattern className="h-full w-full" patternSize={7} />
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/20">
                  <TableHead className="pl-6">
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">Saves</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">GP</span>
                      <Tooltip>
                        <TooltipTrigger className="size-3" />
                        <TooltipContent header="Games Played">
                          <p>Total number of games played</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">Mins</span>
                      <Tooltip>
                        <TooltipTrigger className="size-3" />
                        <TooltipContent header="Time Played">
                          <p>Total minutes played</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">Shots Faced</span>
                      <Tooltip>
                        <TooltipTrigger className="size-3" />
                        <TooltipContent>
                          <p>The total number of shots the team has allowed their opposition teams to take</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">GA</span>
                      <Tooltip>
                        <TooltipTrigger className="size-3" />
                        <TooltipContent header="Goals Conceded">
                          <p>Total goals scored by the opposition</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">CS</span>
                      <Tooltip>
                        <TooltipTrigger className="size-3" />
                        <TooltipContent header="Clean Sheets">
                          <p>No goals conceded in the game</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="pr-6" />
                </TableRow>
                {goalkeepers.map((player) => (
                  <TableRow
                    key={player.uID}
                    onMouseEnter={() => setHoveredRow(player.uID)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "h-12 py-0 text-base hover:bg-transparent",
                      hoveredRow === player.uID && "bg-muted/30 hover:bg-muted/30"
                    )}
                  >
                    <GoalkeeperStatsCells player={player} seasonStats={seasonStats} />
                  </TableRow>
                ))}
              </Fragment>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PlayerStatsCellsProps {
  player: F40Player;
  seasonStats?: F30SeasonStatsResponse | null;
}

function OutfieldStatsCells({ player, seasonStats }: PlayerStatsCellsProps) {
  const playerId = parseInt(player.uID.replace("p", ""), 10);
  const f30Player = seasonStats ? getPlayerById(seasonStats, playerId) : null;

  const goals = f30Player ? Number(getPlayerStat(f30Player, "Goals") ?? 0) : 0;
  const gamesPlayed = f30Player ? Number(getPlayerStat(f30Player, "Games Played") ?? 0) : 0;
  const timePlayed = f30Player ? Number(getPlayerStat(f30Player, "Time Played") ?? 0) : 0;
  const shots = f30Player ? Number(getPlayerStat(f30Player, "Total Shots") ?? 0) : 0;
  const shotsOnTarget = f30Player ? Number(getPlayerStat(f30Player, "Shots On Target ( inc goals )") ?? 0) : 0;
  const assists = f30Player ? Number(getPlayerStat(f30Player, "Goal Assists") ?? 0) : 0;
  const fouls = f30Player ? Number(getPlayerStat(f30Player, "Total Fouls Conceded") ?? 0) : 0;
  const yellowCards = f30Player ? Number(getPlayerStat(f30Player, "Yellow Cards") ?? 0) : 0;
  const redCards = f30Player ? Number(getPlayerStat(f30Player, "Total Red Cards") ?? 0) : 0;
  const cards = yellowCards + redCards;

  return (
    <>
      <TableCell className="pl-6 font-semibold">{goals}</TableCell>
      <TableCell>{gamesPlayed}</TableCell>
      <TableCell>{timePlayed}</TableCell>
      <TableCell>{shots} / {shotsOnTarget}</TableCell>
      <TableCell>{assists}</TableCell>
      <TableCell>{fouls}</TableCell>
      <TableCell className="pr-6">{cards}</TableCell>
    </>
  );
}

function GoalkeeperStatsCells({ player, seasonStats }: PlayerStatsCellsProps) {
  const playerId = parseInt(player.uID.replace("p", ""), 10);
  const f30Player = seasonStats ? getPlayerById(seasonStats, playerId) : null;

  const saves = f30Player ? Number(getPlayerStat(f30Player, "Saves Made") ?? 0) : 0;
  const gamesPlayed = f30Player ? Number(getPlayerStat(f30Player, "Games Played") ?? 0) : 0;
  const timePlayed = f30Player ? Number(getPlayerStat(f30Player, "Time Played") ?? 0) : 0;
  const totalShotsConceded = f30Player ? Number(getPlayerStat(f30Player, "Total Shots Conceded") ?? 0) : 0;
  const goalsConceded = f30Player ? Number(getPlayerStat(f30Player, "Goals Conceded") ?? 0) : 0;
  const shotsAgainst = totalShotsConceded > 0 ? totalShotsConceded : saves + goalsConceded;
  const cleanSheets = f30Player ? Number(getPlayerStat(f30Player, "Clean Sheets") ?? 0) : 0;

  return (
    <>
      <TableCell className="pl-6 font-semibold">{saves}</TableCell>
      <TableCell>{gamesPlayed}</TableCell>
      <TableCell>{timePlayed}</TableCell>
      <TableCell>{shotsAgainst}</TableCell>
      <TableCell>{goalsConceded}</TableCell>
      <TableCell>{cleanSheets}</TableCell>
      <TableCell className="pr-6" />
    </>
  );
}

function PlayerCountryFlag({ player }: { player: F40Player }) {
  const countryInput = getPlayerNationality(player) || getPlayerCountry(player);
  const countryIso = countryInput ? getCountryIsoCode(countryInput) : null;

  if (!countryIso) return null;

  return (
    <ReactCountryFlag
      countryCode={countryIso}
      svg
      className="!w-4.5 !h-4.5 rounded self-center"
    />
  );
}
