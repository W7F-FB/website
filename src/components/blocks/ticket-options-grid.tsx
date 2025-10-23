"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { H2, P, H3 } from "@/components/website-base/typography";
import Image from "next/image";
import { CheckIcon, CalendarBlankIcon, MapPinAreaIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
            <div className="col-span-1 p-10 space-y-6 border w-[30rem] sticky mb-[6rem] top-[10rem] self-start">
                <div className="border-b flex flex-col pb-6">
                    <span className="font-[450] font-headers uppercase text-accent-foreground mb-4 col-span-2">
                        {eventDetails.title}
                    </span>
                    <H2 className="text-3xl font-bold uppercase text-white">
                        {eventDetails.location}
                    </H2>
                </div>

                <div className="border-b pb-6">
                    <div className="flex items-center gap-3">
                        <CalendarBlankIcon size={20} />
                        <span className="text-lg">{eventDetails.date}</span>
                        <Button asChild variant="link" size="sm" className="p-0">
                            <Link href="/">View Schedule</Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPinAreaIcon size={20} />
                        <span className="text-lg">{eventDetails.venue}</span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setLightboxOpen(true)}
                            className="p-0"
                        >
                            View Layout
                        </Button>
                    </div>
                </div>

                <div>
                    <ul className="space-y-2">
                        {eventDetails.includedFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckIcon size={16} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button asChild size="skew">
                    <Link href="#"><span>Purchase Tickets</span></Link>
                </Button>

                <div>
                    <P className="text-sm mb-2">
                        Interested in watching the action from a pitchside cabana?
                        <span>
                            <Button asChild variant="link" size="sm" className="p-0">
                                <Link href="/">
                                    Contact Us
                                </Link>
                            </Button>
                        </span>
                    </P>
                </div>

                <Link href="https://www.dazn.com/en-US/competition/Competition:2ysblq9gh9ulnfw31299e659p?utm_source=web&utm_medium=organicpartner&utm_campaign=dazn_global_gl_display_soccer_acquisition_fs_2024&utm_term=allwomensfootballfreemium-worldsevensfootball_fixed" className="flex gap-3">
                    <Image src="/images/decorative/dazn_logo.svg" width={30} height={30} alt="DAZN Logo" className="opacity-80" />
                    <P noSpace className="leading-none font-headers font-bold">Watch LIVE for <br />free on DAZN</P>
                </Link>
            </div>

            <div className="grid gap-6">
                {ticketOptions.map(option => (
                    <div key={option.id} className="py-6 px-7 border overflow-hidden relative">
                        <div className="absolute w-[0.25rem] left-0 top-0 bottom-0 bg-primary"></div>
                        <div className="border-b">
                            <H3 className="uppercase mt-2 mb-2">{option.title}</H3>
                            {option.subtitle && (
                                <P noSpace className="mb-2">{option.subtitle}</P>
                            )}
                        </div>
                        <P className="mb-4">{option.description}</P>
                        <ul className="space-y-2">
                            {option.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-1">
                                    <CaretRightIcon size={15} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div className="flex items-center justify-center mt-8">
                    <Button asChild size="skew">
                        <Link href="#"><span>Purchase Tickets</span></Link>
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
