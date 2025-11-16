import { PlayerHeadshot } from "./player"
import { getPositionAbbr } from "@/lib/opta/dictionaries/position-dictionary"
import { LEADER_OFFENSIVE, LEADER_DEFENSIVE, LEADER_GOALKEEPER, type LeaderType } from "@/types/game-leaders"
import type { PlayerLeaderCard as PlayerLeaderCardProps } from "@/types/components"
import type { F9MatchPlayer } from "@/types/opta-feeds/f9-match"
import { PlayerMiniStatTable } from "./player-mini-stat.table"
import { STAT_TYPES } from "@/lib/opta/dictionaries/stat-dictionary"

export function PlayerLeaderCard({ prismicTeam, playerHeadshotUrl, player, leaderType, f40Position }: PlayerLeaderCardProps) {
    const teamLogo = prismicTeam?.data?.logo?.url || undefined;

    const primaryColor = prismicTeam?.data?.color_primary || undefined;

    const playerName = (player && 'name' in player ? (player as F9MatchPlayer & { name?: string }).name : undefined) || player?.PlayerRef || "";

    const displayPosition = player?.Position === "Substitute" && f40Position ? f40Position : player?.Position;
    const position = displayPosition ? getPositionAbbr(displayPosition) : "";
    const jerseyNumber = player?.ShirtNumber;

    const playerDetails = [position, jerseyNumber ? `#${jerseyNumber}` : ""]
        .filter(Boolean)
        .join(", ");

    const statKeys = getStatKeysForLeaderType(leaderType)
    const statValues = player ? extractPlayerStats(player, statKeys) : []

    return (
        <div className="grid grid-cols-[auto_1fr] gap-3">
            <div className="flex flex-col justify-center items-center gap-1.5">
                <PlayerHeadshot
                    logoUrl={teamLogo}
                    headshotUrl={playerHeadshotUrl}
                    primaryColor={primaryColor}
                />
                {playerDetails && (
                    <span className="text-muted-foreground/75 text-xs">
                        {playerDetails}
                    </span>
                )}
            </div>
            <div className="flex flex-col justify-center">
                <span className="flex flex-col justify-start">
                    <span className="font-headers text-sm font-medium">
                        {playerName}
                    </span>
                    {statValues.length > 0 && (
                        <PlayerMiniStatTable
                            className="mt-3"
                            statDisplays={statValues}
                        />
                    )}
                </span>
            </div>
        </div>
    )
}

function getStatKeysForLeaderType(leaderType: LeaderType): readonly string[] {
    switch (leaderType) {
        case 'offensive':
            return LEADER_OFFENSIVE
        case 'defensive':
            return LEADER_DEFENSIVE
        case 'goalkeeper':
            return LEADER_GOALKEEPER
    }
}

function extractPlayerStats(player: F9MatchPlayer, statKeys: readonly string[]) {
    if (!player.Stat) return []

    const statArray = Array.isArray(player.Stat) ? player.Stat : [player.Stat]

    return statKeys.map(key => {
        const statEntry = statArray.find(s => s.Type === key)
        const value = statEntry?.value ?? 0

        const metadata = Object.values(STAT_TYPES).find(s => s.f9Key === key)
        const abbr = metadata?.abbr || key.toUpperCase()

        return {
            label: abbr,
            value: String(value)
        }
    })
}


