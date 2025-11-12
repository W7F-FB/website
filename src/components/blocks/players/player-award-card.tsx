import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { F30Player } from "@/types/opta-feeds/f30-season-stats"
import type { F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import { PlayerHeadshot } from "./player"
import { getPositionAbbr } from "@/lib/opta/position-dictionary"
import { isFilled } from "@prismicio/client"
import { PlayerMiniStatTable } from "./player-mini-stat.table"
import { F30_STAT_TYPES } from "@/lib/opta/f30-stat-dictionary"
import type { TournamentDocumentDataAwardsItem } from "../../../../prismicio-types"
import type * as prismic from "@prismicio/client"

type AwardAwardsField = TournamentDocumentDataAwardsItem['awards']
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AwardData = AwardAwardsField extends prismic.ContentRelationshipField<infer _ID, infer _Lang, infer TData>
    ? TData
    : never

type PlayerAwardCardProps = {
    award: AwardData
    player?: F30Player
    optaTeam?: F1TeamData
}

export function PlayerAwardCard({ award, player, optaTeam }: PlayerAwardCardProps) {
    const teamShortName = optaTeam?.ShortTeamName || optaTeam?.ShortName || "";
    const teamName = teamShortName || (isFilled.contentRelationship(award.player_team) && award.player_team.data?.name 
        ? award.player_team.data.name 
        : "");
    
    const teamLogo = isFilled.contentRelationship(award.player_team) && award.player_team.data?.logo?.url
        ? award.player_team.data.logo.url
        : undefined;
    
    const primaryColor = isFilled.contentRelationship(award.player_team) && award.player_team.data?.color_primary
        ? award.player_team.data.color_primary ?? undefined
        : undefined;
    
    const position = player?.position ? getPositionAbbr(player.position) : "";
    const jerseyNumber = player?.shirtNumber;
    
    const playerDetails = [teamName, position, jerseyNumber ? `#${jerseyNumber}` : ""]
        .filter(Boolean)
        .join(", ");

    return (
        <Card className="p-0 gap-0">
            <CardHeader className="px-3 h-14 bg-muted/50 font-headers text-base font-semibold gap-0 flex flex-col items-start justify-center">
                <span>
                    {award.award_title || ""}
                </span>
                <span className="text-muted-foreground/75 text-xs font-normal">
                    {award.award_subtitle || ""}
                </span>
            </CardHeader>
            <CardContent className="grid grid-cols-[auto_1fr] gap-3 p-3">
                <PlayerHeadshot 
                    logoUrl={teamLogo}
                    headshotUrl={award.player_headshot?.url ?? undefined}
                    primaryColor={primaryColor}
                />
                <div className="flex flex-col justify-center">
                    <span className="flex flex-col justify-start">
                        <span className="font-headers text-base font-medium">
                            {award.player_name || ""}
                        </span>
                        {playerDetails && (
                            <span className="text-muted-foreground/75 text-sm">
                                {playerDetails}
                            </span>
                        )}
                        {player && (
                            <PlayerMiniStatTable className="mt-3"
                                player={player}
                                stats={player.position === "Goalkeeper" ? [
                                    F30_STAT_TYPES["Saves Made"],
                                    F30_STAT_TYPES["Total Shots Conceded"],
                                    F30_STAT_TYPES["Goals Conceded"],
                                ] : [
                                    F30_STAT_TYPES["Shots On Target ( inc goals )"],
                                    F30_STAT_TYPES["Goals"],
                                    F30_STAT_TYPES["Goal Assists"],
                                ]}
                            />
                        )}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

