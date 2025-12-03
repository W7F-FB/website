"use client";

import React from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPlayerFullName, getPlayerJerseyNumber } from "@/types/opta-feeds/f40-squads-feed";
import { cn } from "@/lib/utils";
import type { F40Player } from "@/types/opta-feeds/f40-squads-feed";
import type { F30SeasonStatsResponse } from "@/types/opta-feeds/f30-season-stats";
import { getPlayerById, getPlayerStat } from "@/types/opta-feeds/f30-season-stats";
import { PrismicNextImage } from "@prismicio/next";
import type { TeamDocument } from "../../../../prismicio-types";
import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/ui/motion-tabs";
import { Button } from "@/components/ui/button";
import { CaretRightIcon } from "@/components/website-base/icons";


interface RosterCardProps extends React.ComponentProps<"div"> {
  players: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
  prismicTeam?: TeamDocument;
}

export function RosterCard({ players, seasonStats, prismicTeam, className }: RosterCardProps) {
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
    <Tabs defaultValue={outfieldPlayers.length > 0 ? "outfield" : "goalkeepers"} className={cn("", className)}>
      <TabsList variant="skew" className="mb-4">
        {outfieldPlayers.length > 0 && (
          <TabsTrigger value="outfield">
            Outfield Players ({outfieldPlayers.length})
          </TabsTrigger>
        )}
        {goalkeepers.length > 0 && (
          <TabsTrigger value="goalkeepers">
            Goalkeepers ({goalkeepers.length})
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContents>
        {outfieldPlayers.length > 0 && (
          <TabsContent value="outfield">
            <PlayersTable
              players={outfieldPlayers}
              seasonStats={seasonStats}
              prismicTeam={prismicTeam}
              isGoalkeeper={false}
            />
          </TabsContent>
        )}
        {goalkeepers.length > 0 && (
          <TabsContent value="goalkeepers">
            <PlayersTable
              players={goalkeepers}
              seasonStats={seasonStats}
              prismicTeam={prismicTeam}
              isGoalkeeper={true}
            />
          </TabsContent>
        )}
      </TabsContents>
    </Tabs>
  );
}

interface PlayersTableProps {
  players: F40Player[];
  seasonStats?: F30SeasonStatsResponse | null;
  prismicTeam?: TeamDocument;
  isGoalkeeper: boolean;
}

const PAGE_SIZE = 10;

function PlayersTable({ players, seasonStats, prismicTeam, isGoalkeeper }: PlayersTableProps) {
  const [hoveredRow, setHoveredRow] = React.useState<number | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);

  React.useEffect(() => {
    setPageIndex(0);
  }, [isGoalkeeper]);

  if (!players.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No players in this category
      </div>
    );
  }

  const totalPages = Math.ceil(players.length / PAGE_SIZE);
  const currentPage = pageIndex + 1;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;
  const pageCount = totalPages;

  const startIndex = pageIndex * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPlayers = players.slice(startIndex, endIndex);

  return (
    <div className="flex gap-0">
      <div className="border-r border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead hasSelect className="pr-10">
                <span className="font-headers font-semibold">Player</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlayers.map((player, index) => {
              const globalIndex = startIndex + index;
              return (
                <TableRow
                  key={player.uID}
                  onMouseEnter={() => setHoveredRow(globalIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={cn(
                    "h-12 py-0 hover:bg-transparent",
                    hoveredRow === globalIndex && "bg-muted/30 hover:bg-muted/30"
                  )}
                >
                  <TableCell className="h-12 py-0 font-medium font-headers pr-10">
                    <div className="flex items-center gap-3">
                      <div className="grid grid-cols-[auto_1fr] gap-2.5">
                        {prismicTeam?.data.logo && (
                          <div className="relative size-6 shrink-0 self-center">
                            <PrismicNextImage
                              field={prismicTeam.data.logo}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-xs">{getPlayerFullName(player)}</span>
                          <span className="text-muted-foreground/80 font-normal text-[0.65rem]">
                            #{getPlayerJerseyNumber(player) !== "Unknown" && getPlayerJerseyNumber(player) !== "?" ? getPlayerJerseyNumber(player) : "-"} • {player.Position || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-muted/30">
              <TableCell>
                <div className="h-[38px]" />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              {isGoalkeeper ? (
                <>
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
                </>
              ) : (
                <>
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
                  <TableHead>
                    <div className="flex items-center gap-1.5">
                      <span className="mt-0.5">Cards</span>
                    </div>
                  </TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlayers.map((player, index) => {
              const globalIndex = startIndex + index;
              return (
                <TableRow
                  key={player.uID}
                  onMouseEnter={() => setHoveredRow(globalIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={cn(
                    "h-12 py-0 text-base hover:bg-transparent",
                    hoveredRow === globalIndex && "bg-muted/30 hover:bg-muted/30"
                  )}
                >
                  {isGoalkeeper ? (
                    <GoalkeeperStatsCells player={player} seasonStats={seasonStats} />
                  ) : (
                    <OutfieldStatsCells player={player} seasonStats={seasonStats} />
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="hover:bg-muted/30">
              <TableCell colSpan={isGoalkeeper ? 6 : 7}>
                <div className="h-[38px] flex items-center justify-end gap-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
                      disabled={!canPreviousPage}
                    >
                      <CaretRightIcon className="rotate-180" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
                      disabled={!canNextPage}
                    >
                      <CaretRightIcon size={16} />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
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
      <TableCell>{cards}</TableCell>
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
    </>
  );
}
