"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { H2, H4, P } from "@/components/website-base/typography";
import { MapPinAreaIcon, TagChevronIcon } from "@/components/website-base/icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";
import "yet-another-react-lightbox/styles.css";



interface TicketOption {
    id: string;
    title: string;
    description: string;
    features: string[];
}

const ticketsCard = {
    subtitle: "Event #2",
    title: "Ticket Types",
    description: "Learn more about the available ticket types below",
    venue: "Beyond Bancard Field",
}

const ticketOptions: TicketOption[] = [
    {
        id: "item-1",
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
        id: "item-2",
        title: "Premium Sideline",
        description: "Prime sideline views, chair back seats or front-row bleachers, and full access to the W7F Fan Fest—where the action never stops.",
        features: [
            "Includes access to W7F Fan Fest with food and beverages for purchase.",
        ]
    },
    {
        id: "item-3",
        title: "Pitchside",
        description: "Just feet from the player benches with cushioned seating or bar-rail views—right in the heart of the action. Includes access to W7F Fan Fest.",
        features: [
            "Includes access to W7F Fan Fest with food and beverages for purchase.",
        ]
    },
    {
        id: "item-4",
        title: "Goal Line Party Deck",
        description: "Goal line standing room with nonstop energy, live DJ, and the loudest crowd in the stadium. Includes one drink (21+ for alcohol) and access to W7F Fan Fest.",
        features: [
            "Includes one drink (of any kind, must be 21+ for alcohol) access to W7F Fan Fest activities and food and beverages for purchase.",
        ]
    },
    {
        id: "item-5",
        title: "VIP Sideline Cabana",
        description: "Touchline shaded lounge seating with premium hospitality and unbeatable views. Includes all-day food, drinks, exclusive merchandise and access to W7F Fan Fest.",
        features: [
            "Includes all-day access to food and beverages (must be 21+ for alcohol), exclusive merchandise and more.",
        ]
    },
]

export function TicketTypes() {

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const layoutImages = [
        {
            src: "/images/static-media/layout.avif",
            alt: "Stadium Layout"
        }
    ];

    return (
        <div>
            <Card className="w-full md:w-[30rem]">
                <CardHeader>
                    <CardTitle>
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-[450] font-headers uppercase text-accent-foreground block">
                                {ticketsCard.subtitle}
                            </span>
                            <Button asChild variant="outline" size="sm" className="text-foreground">
                                <Link href={`/tournament/fort-lauderdale/schedule`}>View Schedule</Link>
                            </Button>
                        </div>
                        <H2 className="text-3xl uppercase text-white">
                            {ticketsCard.title}
                        </H2>
                        <P noSpace className="text-sm">{ticketsCard.description}</P>
                    </CardTitle>
                    <Separator className="mt-4" />
                </CardHeader>
                <CardContent>
                    <div>
                        <Accordion type="single" collapsible className="w-full ">
                            {ticketOptions.map((option) => (
                                <AccordionItem key={option.id} value={option.id}>
                                    <AccordionTrigger className="py-3">
                                        <H4 className="text-base">{option.title}</H4>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm">
                                        <div className="space-y-4">
                                            <P>{option.description}</P>
                                            {option.features.length > 0 && (
                                                <div className="space-y-2">
                                                    <ul className="space-y-1.5">
                                                        {option.features.map((feature, index) => (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <TagChevronIcon  className="size-3 mt-1.25" />
                                                                <span className="mt-0.5">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-6">
                        <div className="flex items-center gap-3">
                            <MapPinAreaIcon className="size-3.5 mb-0.75" />
                            <span className="text-lg">{ticketsCard.venue}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLightboxOpen(true)}
                            className="text-foreground"
                        >
                            View Layout
                        </Button>
                    </div>
                </CardContent>
            </Card>

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
    )
}