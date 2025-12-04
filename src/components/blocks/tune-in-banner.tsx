import * as React from "react"

import { GradientBanner } from "@/components/ui/gradient-banner"
import { cn } from "@/lib/utils"
import { H2, P, Subtitle } from "../website-base/typography"
import { Separator } from "../ui/separator"
import { BroadcastPartnerLink } from "./broadcast-partner"
import type { BroadcastPartnersDocument } from "@/../prismicio-types"
import { Background } from "@/components/ui/background"
import { PalmtreeIcon } from "../website-base/icons"

interface TuneInBannerProps extends React.ComponentProps<typeof GradientBanner> {
    dazn?: BroadcastPartnersDocument | null
    tnt?: BroadcastPartnersDocument | null
    truTV?: BroadcastPartnersDocument | null
    hboMax?: BroadcastPartnersDocument | null
    univision?: BroadcastPartnersDocument | null
    espn?: BroadcastPartnersDocument | null
    disneyPlus?: BroadcastPartnersDocument | null
}

const TuneInBanner = React.forwardRef<
    HTMLDivElement,
    TuneInBannerProps
>(({ className, dazn, tnt, truTV, hboMax, univision, espn, disneyPlus, ...props }, ref) => {
    return (
        <GradientBanner
            ref={ref}
            data-slot="tune-in-banner"
            className={cn("flex lg:flex-row flex-col relative overflow-hidden lg:gap-0 gap-6", className)}
            {...props}
        >
            <Background className="flex items-start justify-start">
                <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
            </Background>
            <div className="pr-12 relative">
                <Subtitle className="mb-2 text-muted-foreground whitespace-nowrap">Starting FRI Dec 5th, 5pm EST</Subtitle>
                <H2 variant="h1" className="lg:text-6xl text-5xl">Tune in <span className="text-destructive">LIVE</span></H2>
                <P className="text-xl uppercase">To Electrifying 7v7 football.</P>
            </div>
            <Separator variant="gradient" orientation="vertical" className="!h-auto" />
            <div className="lg:px-12 flex flex-col gap-2 relative">
                <Subtitle className="text-xl mb-2">Stream Live, <span className="text-primary whitespace-nowrap">for Free</span> Worldwide</Subtitle>
                <div className="border-y border-border/50 divide-y !divide-border/50">
                    {dazn && <BroadcastPartnerLink partner={dazn} size="lg" showName className="bg-muted/20" />}
                </div>
            </div>
            <Separator variant="gradient" orientation="vertical" className="!h-auto" />
            <div className="lg:pl-12 flex flex-col gap-2 relative">
                <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-12 gap-6">
                    <div className="">
                        <Subtitle className="text-xs mb-3 normal-case text-muted-foreground h-8 flex items-end">Available in the U.S.</Subtitle>
                        <div className="border-y border-border/50 divide-y !divide-border/50">
                            {tnt && <BroadcastPartnerLink partner={tnt} size="sm" showName noLink />}
                            {truTV && <BroadcastPartnerLink partner={truTV} size="sm" showName noLink />}
                            {hboMax && <BroadcastPartnerLink partner={hboMax} size="sm" showName noLink />}
                        </div>
                    </div>
                    <div className="">
                        <Subtitle className="text-xs mb-3 normal-case text-muted-foreground h-8 flex items-end">Available in the U.S. & Mexico</Subtitle>
                        <div className="border-y border-border/50 divide-y !divide-border/50">
                            {univision && <BroadcastPartnerLink partner={univision} size="sm" showName noLink />}
                        </div>
                        <P className="text-sm text-muted-foreground italic !mt-2">Transmisión en Español</P>
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <Subtitle className="text-xs mb-3 normal-case text-muted-foreground h-8 flex items-end">Available in Latin America, Central America, the Caribbean</Subtitle>
                        <div className="border-y border-border/50 divide-y !divide-border/50">
                            {espn && <BroadcastPartnerLink partner={espn} size="sm" showName noLink />}
                            {disneyPlus && <BroadcastPartnerLink partner={disneyPlus} size="sm" showName noLink />}
                        </div>
                        <P className="text-xs text-muted-foreground text-right italic !mt-2">Excluding Mexico</P>
                    </div>
                </div>
            </div>
        </GradientBanner>
    )
})

TuneInBanner.displayName = "TuneInBanner"

export { TuneInBanner }

