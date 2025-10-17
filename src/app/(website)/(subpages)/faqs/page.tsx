import type { Metadata } from "next";
import Link from "next/link";

import type { FAQItem } from "@/types/basic";
import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, H2, P } from "@/components/website-base/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "FAQs - World Sevens Football",
    description:
        "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
    keywords: [
        "World Sevens FAQ",
        "7v7 football rules",
        "tournament format",
        "qualification process",
        "prize pool information",
    ],
    openGraph: {
        title: "FAQs - World Sevens Football",
        description:
            "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
        url: "https://worldsevensfootball.com/faqs",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FAQs - World Sevens Football",
        description:
            "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
        creator: "@worldsevens",
    },
};


interface FAQSection {
    id: string;
    title: string;
    items: FAQItem[];
}

const faqSections: FAQSection[] = [
    {
        id: "competition-format",
        title: "Competition Format",
        items: [
            {
                id: "item-1",
                question: "What is the format of a W7F tournament?",
                answer: [
                    "The fast-paced seven-a side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.",
                    "Each club will play between three and five games in total, depending on the progress of that club through the tournament, over a three-day period."
                ]
            },
            {
                id: "item-2",
                question: "What is the format of a W7F match?",
                answer: [
                    "Matches are played on a pitch half of the size of a standard 11-a-side football pitch. Each match will last 30 minutes, divided into two halves of 15 minutes each, with extra time for a tie-break. There will be a 5-minute halftime. There are unlimited rolling substitutions and no offside rule.",
                ]
            },
            {
                id: "item-3",
                question: "Who participates in W7F tournaments?",
                answer: "Established professional clubs from the best leagues across the globe have committed to participating in W7F's seven-a side tournaments. From that club pool, teams will be chosen to compete."
            },
            {
                id: "item-4",
                question: "How many clubs will take part in each W7F tournament?",
                answer: "The tournament will feature eight sides from the club pool. As the series grows, we expect to expand the number of teams competing in each event."
            },
            {
                id: "item-5",
                question: "How long is each W7F Match?",
                answer: "Each match will last 30 minutes divided into two halves of 15 minutes each, with extra time for a tie-break. There will be a 5-minute halftime."
            },
            {
                id: "item-6",
                question: "What is the size of a W7F pitch?",
                answer: "Half of the size of a traditional football pitch."
            },
            {
                id: "item-7",
                question: "What is the total prize pool for a W7F tournament?",
                answer: "$5,000,000 per tournament."
            },
            {
                id: "item-8",
                question: "When and where will W7F tournaments take place?",
                answer: "Our second tournament will take place at Beyond Bancard Field in Fort Lauderdale, Florida on December 5-7, 2025."
            },
            {
                id: "item-9",
                question: "What teams will be participating in the second W7F tournament in Fort Lauderdale, Florida Dec 5-7?",
                answer: "Brazilian Flamengo FC and Mexican Club América are the first two clubs confirmed to participate in Fort Lauderdale, with the remaining six clubs to be announced in the coming weeks."
            }
        ]
    },
    {
        id: "event",
        title: "Event",
        items: [
            {
                id: "item-10",
                question: "Is re-entry allowed with my ticket?",
                answer: "Re-entry is permitted throughout the session for which you are ticketed event—just be sure to keep your wristband or credential on for easy access."
            },
            {
                id: "item-11",
                question: "How do I get to the event?",
                answer: ["The stadium address is Beyond Bancard Field, 520 SW 30th St, Davie, FL 33328", "Parking is available at the venue. Specific parking details and any associated costs will be provided closer to the event date.",
                    "By Ride Share: Drop-off and pick up location is 7520 SW 33rd Street, Davie, FL 33314 located just south of Beyond Bancard Field."
                ]
            },
            {
                id: "item-12",
                question: "Is there parking at the stadium?",
                answer: "Paid parking is located near the stadium in the HPD Parking Garage. Parking passes are available through here. HPD Parking Garage, 3250 SW 76th Avenue, Davie, FL 33314"
            },
            {
                id: "item-13",
                question: "Are accessibility tickets available?",
                answer: "Yes. We are committed to ensuring the World Sevens Football event in Fort Lauderdale is inclusive and welcoming for all fans. Accessibility tickets are available for spectators with disabilities or limited mobility, and include access to designated seating areas. For further assistance, please contact info@worldsevensfootball.com"
            },
            {
                id: "item-14",
                question: "What is the match schedule?",
                answer: "You can see the match schedule at here"
            },
            {
                id: "item-15",
                question: "What time does the stadium open?",
                answer: [
                    "Friday, December 5 (Session 1): Gates open at 3pm EST",
                    "Saturday, December 6 (Session 2): Gates open at 9:30am EST",
                    "Saturday, December 6 (Session 3): Gates open at 4pm EST",
                    "Sunday, December 7 (Session 4): Gates open at 9:30am EST",
                    "All times are subject to change"
                ]
            },
            {
                id: "item-16",
                question: "Are food and beverages available at the stadium?",
                answer: "Yes, the stadium will have concession stands open along with food trucks in the fan zone. No external food or drinks can be brought into the stadium."
            },
            {
                id: "item-17",
                question: "Facilities",
                answer: [
                    "Are there restrooms available?",
                    "Yes",
                    "Will there be W7F merchandise for sale?",
                    "Absolutely, treat yourself to some official World Sevens Football merchandise; a wide variety of quality items are available to buy while the stadium is open. ",
                    "Are first aid facilities available?",
                    "Our first aid team will be at the stadium, please ask a staff member if you need assistance during your visit.",
                    "Is smoking allowed within the stadium?",
                    "Smoking is not permitted inside Beyond Bancard Field outside of the designated smoking areas",
                ]
            },
            {
                id: "item-18",
                question: "Will there be shaded areas at the stadium?",
                answer: "The Premium Sideline seats have shaded areas, but many areas of the stadium do not have shade. As this is an outdoor event, you are advised to dress appropriately for the weather. If the forecast is looking sunny, remember to bring a hat, high SPF sunscreen and drink plenty of water.",
            },
            {
                id: "item-19",
                question: "Will this event take place rain or shine?",
                answer: "This event is scheduled to take place rain or shine. World Sevens Football does not refund tickets, except in situations where the event is cancelled.",
            },
            {
                id: "item-20",
                question: "What is your search policy?",
                answer: "For your safety, it is a condition of entry that all bags are subject to inspection by our security team before you enter the event site. Please see our Event Access Policies.  ",
            },
            {
                id: "item-21",
                question: "Are bags allowed at Beyond Bancard Field?",
                answer: "Medium and large sized bags are not allowed inside Beyond Bancard Field. Only clutches no larger than 5”x8” are permitted in the stadium. ",
            },
            {
                id: "item-22",
                question: "What is your bag policy?",
                answer: "Bags and backpacks are not allowed within the stadium. Clutches no larger than 5”x8” are permitted. Medical device bags and infant bags may be permitted and checked at the gate of entry. ",
            },
            {
                id: "item-23",
                question: "Are there any prohibited items?",
                answer: "Yes. You are not permitted to bring in air horns, cowbells, animals except certified service dogs, backpacks, coolers and outside food bags of any kind, outside food or drink, cameras with lenses longer than 12”, confetti, ice chests, fireworks or other explosives, bicycles, skateboards, flag poles, footwear with wheels, glass/plastic bottles or cans, inflatable items, items that could be projectiles, lasers, outside alcoholic beverages or illegal drugs, roller blades, signs containing commercial, political, or derogatory language of any kind, sticks/clubs, tobacco products, umbrellas, vuvuzelas, and water guns. This is not an exhaustive list and any permissible items are at the discretion of our Security Team; forbidden items will be confiscated and disposed of by our security staff before you can enter the event site."
            }
        ]
    },
    {
        id: "ticketing",
        title: "Ticketing",
        items: [
            {
                id: "item-24",
                question: "Does purchase of a ticket include entry into the Fan Fest?",
                answer: "Yes, the purchase of a ticket includes entry into the Fan Fest"
            },
            {
                id: "item-25",
                question: "Are Premium Sideline seats and Premium Sideline Youth seats available together?",
                answer: "Yes, all Premium Sideline seats are located in the same section"
            },
            {
                id: "item-26",
                question: "Do you have to be 21+ to purchase Goal Line Party Deck tickets?",
                answer: "No, people under 21 can purchase Goal Line Party Deck tickets, but you must be 21+ to purchase and drink alcoholic beverages"
            },
            {
                id: "item-27",
                question: "Do Three-Day Passes allow access to both Saturday sessions?",
                answer: "Yes, Three-Day Passes allow access to all sessions and entry into the Fan Fest"
            },
            {
                id: "item-28",
                question: "What ages are included for youth tickets?",
                answer: "Youth tickets are for ages 3-13. Children under the age of 3 do not require a ticket."
            },
            {
                id: "item-29",
                question: "I purchased a 3-day pass. How do I get my merch credit?",
                answer: "We will send an email with how to redeem your merch credit as the event gets closer."
            }
        ]
    }
];

export default function FAQsPage() {
    return <Container maxWidth="lg">
                <Section padding="none">
                    <H1 className="uppercase text-2xl md:text-6xl text-left md:my-16">Faq</H1>
                </Section>

                <Section padding="md" className="min-h-screen grid grid-cols-12 gap-16">
                    <div className="col-span-3 sticky top-24 self-start space-y-4">
                        {faqSections.map((section) => (
                            <Button
                                key={section.id}
                                variant="outline"
                                className="text-left w-full justify-start"
                                asChild
                            >
                                <Link href={`#${section.id}`}>
                                    {section.title}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    <div className="col-span-9 space-y-10">
                        {faqSections.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-24">
                                <Accordion type="single" collapsible className="w-full">
                                    <H2 className="uppercase">{section.title}</H2>
                                    {section.items.map((faq) => (
                                        <AccordionItem key={faq.id} value={faq.id}>
                                            <AccordionTrigger>
                                                <span className="font-semibold">{faq.question}</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {Array.isArray(faq.answer) ? (
                                                    faq.answer.map((paragraph, idx) => <P key={idx}>{paragraph}</P>)
                                                ) : (
                                                    <P>{faq.answer}</P>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </Section>
            </Container>
}
