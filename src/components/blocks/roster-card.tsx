"use client"
import { useState } from "react"
import Image from "next/image"
import type { F40Player } from "@/types/opta-feeds/f40-squads-feed"
import { getPlayerFullName, getPlayerJerseyNumber, getPlayerNationality, getPlayerRealPosition } from "@/types/opta-feeds/f40-squads-feed"
import { H2, H3 } from "@/components/website-base/typography"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TeamDocument } from "../../../prismicio-types"

function getCountryFlagUrl(nationality: string, size: string = "21x21"): string {
    const baseUrl = "https://omo.akamai.opta.net/image.php"
    const params = new URLSearchParams({
        secure: "true",
        h: "omo.akamai.opta.net",
        sport: "football",
        entity: "flags",
        description: "countries",
        dimensions: size,
        id: nationality
    })
    return `${baseUrl}?${params.toString()}`
}

function CountryFlag({ country }: { country: string }) {
    const [error, setError] = useState(false)

    if (error) {
        return <span className="text-base">-</span>
    }

    return (
        <Image
            src={getCountryFlagUrl(country)}
            alt={`${country} flag`}
            width={21}
            height={21}
            className="inline-block"
            onError={() => setError(true)}
        />
    )
}

type Props = {
    players: F40Player[]
    team: TeamDocument
}

export function RosterCard({ players, team }: Props) {
    const goalkeepers = players.filter(p => p.Position === "Goalkeeper")
    const defenders = players.filter(p => p.Position === "Defender")
    const midfielders = players.filter(p => p.Position === "Midfielder")
    const forwards = players.filter(p => p.Position === "Forward")

    return (
        <div className="space-y-8">
            <div>
                <H2>{team.data.name}</H2>
                <Separator className="my-2" variant="gradient" />
            </div>

            {goalkeepers.length > 0 && (
                <Card>
                    <CardHeader>
                        <H3 className="uppercase">
                            Goalkeepers
                        </H3>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <HeaderRow />
                        <div className="grid">
                            {goalkeepers.map(player => (
                                <PlayerRow key={player.uID} player={player} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {defenders.length > 0 && (
                <Card>
                    <CardHeader>
                        <H3 className="uppercase">
                            Defenders
                        </H3>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <HeaderRow />
                        <div className="grid">
                            {defenders.map(player => (
                                <PlayerRow key={player.uID} player={player} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {midfielders.length > 0 && (
                <Card>
                    <CardHeader>
                        <H3 className="uppercase">
                            Midfielders
                        </H3>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <HeaderRow />
                        <div className="grid">
                            {midfielders.map(player => (
                                <PlayerRow key={player.uID} player={player} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {forwards.length > 0 && (
                <Card>
                    <CardHeader>
                        <H3 className="uppercase">
                            Forwards
                        </H3>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <HeaderRow />
                        <div className="grid">
                            {forwards.map(player => (
                                <PlayerRow key={player.uID} player={player} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function HeaderRow() {
    return (
        <div className="grid grid-cols-[20rem_1fr_1fr] px-4 py-4 border-b bg-muted/20 text-sm font-semibold uppercase text-muted-foreground">
            <span>#</span>
            <span>Name</span>
            <span className="justify-self-end">Country</span>
        </div>
    )
}

function PlayerRow({ player }: { player: F40Player }) {
    const jerseyNum = getPlayerJerseyNumber(player)
    const fullName = getPlayerFullName(player)
    const nationality = getPlayerNationality(player)
    const position = getPlayerRealPosition(player)

    return (
        <div className="grid grid-cols-[20rem_1fr_1fr] p-4 border-b hover:bg-accent/50 transition-colors">
            <div className="">
                <span className="inline-block font-[450] font-headers uppercase text-accent-foreground">
                    {jerseyNum !== "Unknown" && jerseyNum !== "?" ? jerseyNum : "-"}
                </span>
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-base truncate">
                        {fullName}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-self-end">
                {nationality && nationality !== "Unknown" && (
                    <span className="flex items-center gap-1.5">
                        <CountryFlag country={nationality} />
                    </span>
                )}
            </div>
        </div>
    )
}