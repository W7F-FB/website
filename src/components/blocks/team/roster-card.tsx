"use client"
import type { F40Player } from "@/types/opta-feeds/f40-squads-feed"
import { getPlayerFullName, getPlayerJerseyNumber, getPlayerNationality } from "@/types/opta-feeds/f40-squads-feed"
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContents } from "@/components/ui/motion-tabs"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import React from "react"
import { cn, getCountryIsoCode } from "@/lib/utils"
import ReactCountryFlag from "react-country-flag"

function CountryFlag({ country }: { country: string }) {
    const countryIso = getCountryIsoCode(country)

    if (!countryIso) return null

    return (
        <ReactCountryFlag
            countryCode={countryIso}
            svg
            className="w-5! h-5! rounded"
        />
    )
}

type Props = {
    players: F40Player[]
    className?: string
}

export function RosterCard({ players, className }: Props) {
    const goalkeepers = players.filter(p => p.Position === "Goalkeeper")
    const defenders = players.filter(p => p.Position === "Defender")
    const midfielders = players.filter(p => p.Position === "Midfielder")
    const forwards = players.filter(p => p.Position === "Forward")

    return (
        <div className="space-y-8">
            <Tabs defaultValue="goalkeepers" className={cn("", className)}>
                <TabsList className="bg-card w-full">
                    <TabsTrigger value="goalkeepers">Goalkeepers</TabsTrigger>
                    <TabsTrigger value="defenders">Defenders</TabsTrigger>
                    <TabsTrigger value="midfielders">Midfielders</TabsTrigger>
                    <TabsTrigger value="forwards">Forwards</TabsTrigger>
                </TabsList>
                <TabsContents>
                    <TabsContent value="goalkeepers">
                        <PlayersTable players={goalkeepers} />
                    </TabsContent>
                    <TabsContent value="defenders">
                        <PlayersTable players={defenders} />
                    </TabsContent>
                    <TabsContent value="midfielders">
                        <PlayersTable players={midfielders} />
                    </TabsContent>
                    <TabsContent value="forwards">
                        <PlayersTable players={forwards} />
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </div>
    )
}

function PlayersTable({ players }: { players: F40Player[] }) {
    if (!players.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No players in this position
            </div>
        )
    }

    return (
        <Table>
            <TableBody>
                <TableRow className="bg-muted/20 text-sm font-semibold uppercase hover:bg-muted/20">
                    <TableHead className="w-20">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right w-32">Country</TableHead>
                </TableRow>
                {players.map(player => (
                    <PlayerRow key={player.uID} player={player} />
                ))}
            </TableBody>
        </Table>
    )
}


function PlayerRow({ player }: { player: F40Player }) {
    const jerseyNum = getPlayerJerseyNumber(player)
    const fullName = getPlayerFullName(player)
    const nationality = getPlayerNationality(player)

    return (
        <TableRow className="hover:bg-accent/50 transition-colors">
            <TableCell className="w-20">
                <span className="font-[450] font-headers uppercase text-accent-foreground">
                    {jerseyNum !== "Unknown" && jerseyNum !== "?" ? jerseyNum : "-"}
                </span>
            </TableCell>
            <TableCell>
                <p className="font-semibold text-base truncate">
                    {fullName}
                </p>
            </TableCell>
            <TableCell className="text-right w-32">
                {nationality && nationality !== "Unknown" && (
                    <span className="flex items-center gap-1.5 justify-end">
                        <CountryFlag country={nationality} />
                    </span>
                )}
            </TableCell>
        </TableRow>
    )
}
