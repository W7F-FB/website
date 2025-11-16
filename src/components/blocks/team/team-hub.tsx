import { PlayerLeaderCard } from "@/components/blocks/players/player-leader-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H3 } from "@/components/website-base/typography";
import type { PlayerLeaderCard as PlayerLeaderCardProps } from "@/types/components";

type TeamHubProps = {
    scorer: PlayerLeaderCardProps | null;
    playmaker: PlayerLeaderCardProps | null;
    keeper: PlayerLeaderCardProps | null;
}

export function TeamHub({ scorer, playmaker, keeper }: TeamHubProps) {
    return (
        <Card banner className="bg-card/50 border-muted/50">
            <CardHeader>
                <CardTitle>Team Leaders</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-8">
                <div>
                    <H3 className="text-xs text-muted-foreground mb-3 uppercase">Scorer</H3>
                    {scorer && <PlayerLeaderCard {...scorer} />}
                </div>
                <div>
                    <H3 className="text-xs text-muted-foreground mb-3 uppercase">Playmaker</H3>
                    {playmaker && <PlayerLeaderCard {...playmaker} />}
                </div>
                <div>
                    <H3 className="text-xs text-muted-foreground mb-3 uppercase">Keeper</H3>
                    {keeper && <PlayerLeaderCard {...keeper} />}
                </div>
            </CardContent>
        </Card>
    )
}