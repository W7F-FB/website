import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { H4, P } from "@/components/website-base/typography"
import type { LeadershipMember } from "@/types/leadership"

interface LeadershipCardProps extends React.ComponentProps<"div"> {
  team: LeadershipMember
}

function LeadershipCard({ team, className, ...props }: LeadershipCardProps) {
  return (
    <Card
      className={cn("rounded-sm p-0 bg-card/50 border-muted/50", className)}
      {...props}
    >
        <div className="relative w-full aspect-square overflow-hidden grayscale">
          <Image
            src={team.headshot}
            alt={team.name}
            fill
            className="object-cover object-top"
            sizes="1500"
          />
        </div>
      <CardContent className="flex flex-col p-4 pt-0">
        
        <div>
          <H4>{team.name}</H4>
          <P noSpace className="text-muted-foreground text-sm mt-2.5">{team.role}</P>
        </div>
      </CardContent>
    </Card>
  )
}

export { LeadershipCard }
