"use client"

import * as React from "react"
import {
    ResponsiveDialog,
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
    ResponsiveDialogDescription,
    ResponsiveDialogBody,
} from "@/components/ui/responsive-dialog"
import { BroadcastPartnerLink } from "./broadcast-partner"
import type { BroadcastPartnersDocument } from "@/../prismicio-types"
import { Subtitle, P } from "@/components/website-base/typography"
import { Separator } from "@/components/ui/separator"

interface StreamingAvailabilityDialogProps {
    broadcastPartners: BroadcastPartnersDocument[]
    children: React.ReactNode
}

export function StreamingAvailabilityDialog({
    broadcastPartners,
    children
}: StreamingAvailabilityDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    
    const dazn = broadcastPartners.find(p => p.uid === "dazn")
    const tnt = broadcastPartners.find(p => p.uid === "tnt")
    const truTV = broadcastPartners.find(p => p.uid === "trutv")
    const hboMax = broadcastPartners.find(p => p.uid === "max")
    const univision = broadcastPartners.find(p => p.uid === "univision")
    const espn = broadcastPartners.find(p => p.uid === "espn")
    const disneyPlus = broadcastPartners.find(p => p.uid === "disney-plus")

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
            <ResponsiveDialogContent className="sm:max-w-[600px]">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle className="text-2xl">Streaming Availability</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription className="sr-only">View streaming options by region</ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogBody className="flex flex-col gap-6">
                    {dazn && (
                        <div className="flex flex-col gap-5">
                            <Subtitle className="text-lg mb-0">Stream Live, <span className="text-primary whitespace-nowrap">for Free</span> Worldwide</Subtitle>
                            <div className="border-y border-border/50 mb-1">
                                <BroadcastPartnerLink partner={dazn} size="lg" showName className="bg-muted/20" />
                            </div>
                        </div>
                    )}

                    {(tnt || truTV || hboMax) && (
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Subtitle className="text-sm normal-case mb-0">Available in the U.S.</Subtitle>
                                <Separator variant="gradient" gradientDirection="toRight" className="!w-auto flex-grow" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tnt && <BroadcastPartnerLink partner={tnt} size="sm" showName noLink />}
                                {truTV && <BroadcastPartnerLink partner={truTV} size="sm" showName noLink />}
                                {hboMax && <BroadcastPartnerLink partner={hboMax} size="sm" showName noLink />}
                            </div>
                        </div>
                    )}

                    {univision && (
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Subtitle className="text-sm normal-case mb-0">Available in the U.S. & Mexico</Subtitle>
                                <Separator variant="gradient" gradientDirection="toRight" className="!w-auto flex-grow" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <BroadcastPartnerLink partner={univision} size="sm" showName noLink />
                            </div>
                            <P className="text-sm text-muted-foreground italic !mt-2">Transmisión en Español</P>
                        </div>
                    )}

                    {(espn || disneyPlus) && (
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Subtitle className="text-sm normal-case mb-0">Available in Latin America, Central America, the Caribbean</Subtitle>
                                <Separator variant="gradient" gradientDirection="toRight" className="!w-auto flex-grow" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {espn && <BroadcastPartnerLink partner={espn} size="sm" showName noLink />}
                                {disneyPlus && <BroadcastPartnerLink partner={disneyPlus} size="sm" showName noLink />}
                            </div>
                            <P className="text-xs text-muted-foreground italic !mt-2">Excluding Mexico</P>
                        </div>
                    )}
                </ResponsiveDialogBody>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
        </>
    )
}

