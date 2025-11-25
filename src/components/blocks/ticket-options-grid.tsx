"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { H2, P, H3 } from "@/components/website-base/typography";
import Image from "next/image";
import { CheckIcon, PalmtreeIcon, CaretRightIcon, CalendarIcon, MapPinAreaIcon, TagChevronIcon } from "@/components/website-base/icons";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { GradientAside } from "@/components/ui/gradient-aside";

interface TicketOption {
    id: string;
    title: string;
    description: string;
    subtitle?: string;
    features: string[];
}

const eventDetails = {
    title: "Event #2 tickets",
    location: "Fort Lauderdale, Florida, USA",
    date: "December 5-7, 2025",
    venue: "Beyond Bancard Field",
    includedFeatures: [
        "W7F Fan Fest",
        "Player Appearances",
        "Giveaways"
    ]
};

const ticketOptions: TicketOption[] = [
    {
        id: "3day",
        title: "3-Day Passes",
        description: "Access every match all weekend long—three days of fast-paced 7v7 football and nonstop W7F energy.",
        features: [
            "W7F Fan Fest access",
            "3-Day Premium Sideline also receives a $15 gift card for merchandise purchase at the event.",
            "3-Day Pitchside also receives a $20 gift card for merchandise purchase at the event.",
            "3-Day Goal Line Party Deck also receives a $15 gift card for merchandise purchase at the event.",
        ]
    },
    {
        id: "sideline",
        title: "Premium Sideline",
        description: "Prime sideline views, chair back seats or front-row bleachers, and full access to the W7F Fan Fest—where the action never stops.",
        subtitle: "Youth pricing available",
        features: [
            "Includes access to W7F Fan Fest with food and beverages for purchase.",
        ]
    },
    {
        id: "pitchside",
        title: "Pitchside",
        description: "Just feet from the player benches with cushioned seating or bar-rail views—right in the heart of the action. Includes access to W7F Fan Fest.",
        features: [
            "Includes access to W7F Fan Fest activities with food and beverages for purchase.",
        ]
    },
    {
        id: "party-deck",
        title: "Goal Line Party Deck",
        description: "Goal line standing room with nonstop energy, live DJ, and the loudest crowd in the stadium. Includes one drink (21+ for alcohol) and access to W7F Fan Fest.",
        subtitle: "Includes one drink",
        features: [
            "Includes one drink (of any kind, must be 21+ for alcohol) access to W7F Fan Fest and food and beverages for purchase.",
        ]
    },
    {
        id: "sideline-cabana",
        title: "VIP Sideline Cabana",
        description: "Touchline shaded lounge seating with premium hospitality and unbeatable views. Includes all-day food, drinks, exclusive gift and access to W7F Fan Fest.",
        subtitle: "Individual Ticket",
        features: [
            "Includes all-day access to food and beverages (must be 21+ for alcohol), exclusive merchandise and more.",
        ]
    },
];

export function TicketOptionsGrid() {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const layoutImages = [
        {
            src: "/images/static-media/layout.avif",
            alt: "Stadium Layout"
        }
    ];

    return (
        <div className="grid grid-cols-[30rem_1fr] gap-4">
            <Card className="w-[30rem] sticky mb-26 top-36 self-start">
                <div className="absolute inset-0 flex items-end justify-center opacity-1 pointer-events-none overflow-hidden">
                    <PalmtreeIcon fill="currentColor" className="text-foreground w-auto h-full rotate-y-180" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                </div>
                <CardHeader>
                    <CardTitle>
                        <span className="font-[450] font-headers uppercase text-accent-foreground mb-4 block">
                            {eventDetails.title}
                        </span>
                        <H2 className="text-3xl font-bold uppercase text-white">
                            {eventDetails.location}
                        </H2>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="size-3.5 mb-1" />
                            <span className="text-lg">{eventDetails.date}</span>
                            <Button asChild variant="link" size="sm" className="p-0">
                                <Link href="/tournament/fort-lauderdale#schedule">View Schedule</Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPinAreaIcon className="size-3.5 mb-0.75" />
                            <span className="text-lg">{eventDetails.venue}</span>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => setLightboxOpen(true)}
                                className="p-0 text-foreground"
                            >
                                View Layout
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <ul className="flex flex-wrap gap-2">
                        {eventDetails.includedFeatures.map((feature, index) => (
                            <li key={index}>
                                <div className="bg-muted  -skew-x-8">
                                    <div className="border-1 border-muted-foreground/5">
                                        <div className="flex items-center">
                                            <div className="border-r border-muted-foreground/5 p-1">
                                                <div className="bg-background/75 size-6 flex items-center justify-center">
                                                    <CheckIcon className="size-3 skew-x-8" />
                                                </div>
                                            </div>
                                            <span className="pl-2 pr-3 py-1 text-xs leading-none font-headers font-semibold skew-x-8">{feature}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Separator />
                    <div className="pr-5 w-full">
                        <Button asChild size="skew_lg" className="w-full origin-bottom-left">
                            <Link href="/checkout"><span>Purchase Tickets</span></Link>
                        </Button>
                    </div>
                    <GradientAside>
                        <p >
                            Interested in watching the action from a pitchside cabana?
                            <span>
                                <Button asChild variant="link" size="sm" className="mt-1 p-0 h-auto !px-0">
                                    <Link href="/">
                                        Contact Us
                                        <CaretRightIcon className="size-3 mt-px" />
                                    </Link>
                                </Button>
                            </span>
                        </p>
                    </GradientAside>
                </CardContent>
                <CardFooter className="border-t">
                    <Link href="https://www.dazn.com/en-US/competition/Competition:2ysblq9gh9ulnfw31299e659p?utm_source=web&utm_medium=organicpartner&utm_campaign=dazn_global_gl_display_soccer_acquisition_fs_2024&utm_term=allwomensfootballfreemium-worldsevensfootball_fixed" className="flex gap-3">
                        <Image src="/images/decorative/dazn_logo.svg" width={30} height={30} alt="DAZN Logo" className="opacity-80" style={{ height: "auto" }} />
                        <P noSpace className="leading-none font-headers font-bold">Watch LIVE for <br />free on DAZN</P>
                    </Link>
                </CardFooter>
            </Card>

            <div className="grid gap-6">
                {ticketOptions.map(option => (
                    <Card key={option.id} className="overflow-hidden relative bg-card/30">
                        <div className="absolute w-1 left-0 top-0 bottom-0 bg-border"></div>
                        <CardHeader className="border-b">
                            <CardTitle>
                                <H3 className="uppercase">{option.title}</H3>
                            </CardTitle>
                            {option.subtitle && (
                                <CardDescription className="font-semibold text-base">
                                    {option.subtitle}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <P className="mb-4">{option.description}</P>
                            <ul className="space-y-2">
                                {option.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <TagChevronIcon  className="size-3 mt-1.25" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
                <div className="flex items-center justify-center mt-8">
                    <Button asChild size="skew_lg">
                        <Link href="/checkout"><span>Purchase Tickets</span></Link>
                    </Button>
                </div>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={layoutImages}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
            />
        </div>
    );
}
