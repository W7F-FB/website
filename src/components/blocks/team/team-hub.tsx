import { PlayerLeaderCard } from "@/components/blocks/players/player-leader-card";
import type { PlayerLeaderCard as PlayerLeaderCardProps } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H3 } from "@/components/website-base/typography";
import { cn } from "@/lib/utils";

interface TeamHubProps {
  scorer: PlayerLeaderCardProps | null;
  playmaker: PlayerLeaderCardProps | null;
  keeper: PlayerLeaderCardProps | null;
  className?: string;
}

export function TeamHub({ scorer, playmaker, keeper, className }: TeamHubProps) {
  return (
    <Card banner className={cn("bg-card/50 border-muted/50", className)}>
      <CardHeader>
        <CardTitle>Team Leaders</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div>
          <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Scorer</H3>
          {scorer && <PlayerLeaderCard {...scorer} />}
        </div>
        <div>
          <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Playmaker</H3>
          {playmaker && <PlayerLeaderCard {...playmaker} />}
        </div>
        <div>
          <H3 className="text-xs lg:text-xs text-muted-foreground mb-3 uppercase">Keeper</H3>
          {keeper && <PlayerLeaderCard {...keeper} />}
        </div>
      </CardContent>
    </Card>
  );
}