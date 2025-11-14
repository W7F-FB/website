import { FAQItem, InfoCardItem } from "@/types/basic";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { P, Subtitle } from "@/components/website-base/typography";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubpageHero, SubpageHeroContent, SubpageHeroMedia } from "@/components/blocks/subpage-hero";
import { H1, H2, Footnote } from "@/components/website-base/typography";
import Image from "next/image";
import { InfoCard } from "@/components/blocks/info-card";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "Rising Sevens Youth Tournament - World Sevens Football",
    description: "Join Rising Sevens youth tournament December 6-7, 2025 at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida. Girls U9-U12 teams compete in 7v7 format.",
    keywords: ["Rising Sevens", "youth soccer tournament", "girls soccer Florida", "7v7 tournament", "Davie youth soccer", "NSU soccer tournament", "World Sevens Football youth", "U9 U10 U11 U12 soccer"],
    openGraph: {
        title: "Rising Sevens Youth Tournament - World Sevens Football",
        description: "Join Rising Sevens youth tournament December 6-7, 2025 at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida. Girls U9-U12 teams compete in 7v7 format.",
        url: "https://worldsevensfootball.com/rising-sevens",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Rising Sevens Youth Tournament - World Sevens Football",
        description: "Join Rising Sevens youth tournament December 6-7, 2025 at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida. Girls U9-U12 teams compete in 7v7 format.",
        creator: "@worldsevens",
    },
};

const infoData: InfoCardItem[] = [
    {
        id: "item-1",
        subtitle: "Ages",
        title: "Girls U9, U10, U11, U12",
    },
    {
        id: "item-2",
        subtitle: "Registration Fee",
        title: "$650.00",
        description: "(includes referee fees)"
    },
    {
        id: "item-3",
        subtitle: "Deadline",
        title: "Friday, November 21, 2025",
    },
    {
        id: "item-4",
        subtitle: "Venue",
        title: "Dolphin Field (NSU)",
        description: "Davie, Florida",
    },
    {
        id: "item-5",
        subtitle: "Format",
        title: "7v7",
        description: "2x15 min games, 3 group games, plus semi-finals, 3rd place, and Finals",
    },
    {
        id: "item-6",
        subtitle: "Awards",
        description: "Rising Sevens Youth Tournament by W7F medals and trophies for Champions & Finalists. The winning teams of each age group will be recognized on the professional tournament’s stadium field and will also receive $500 to be donated to one of W7F’s local nonprofit Community Champions.",
    },
    {
        id: "item-7",
        subtitle: "W7F",
        description: "All participating players will receive a W7F t-shirt, plus a free ticket to one session of W7F professional matches. Plus, Rising Sevens by W7F players will get to meet W7F’s Player Advisory Council members and current players participating in the W7F professional tournament.",
    },
];

const faqData: FAQItem[] = [
    {
        id: "item-1",
        question: "How Do I Register?",
        answer: (
            <>
                <P>Teams must register via Bracket Teams. Please complete the online application fully. Incomplete applications cannot be processed.  Any team not accepted will receive a full refund. Any team which withdraws after the application deadline of November 21, 2025 will not be eligible for a refund.</P>
            </>
        )
    },
    {
        id: "item-2",
        question: "Tournament Information",
        answer: (
            <>
                <P><strong>Register:</strong> <span><Link href="https://bracketteam.com/event/6693/Rising_7s/registration">REGISTER YOUR TEAM</Link></span></P>
                <P>Questions, please email Claudia Rodriguez, Rising Sevens Tournament Director, at <span><Link href="mailto:crodriquez@tournamentsuccessgroup.com">crodriquez@tournamentsuccessgroup.com</Link></span></P>
            </>
        )
    },
];

export default function RisingSevensPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <PaddingGlobal>
                <SubpageHero>
                    <SubpageHeroContent>
                        <Subtitle>Youth Tournament</Subtitle>
                        <H1 className="uppercase text-6xl">Rising Sevens</H1>
                        <P>By World Sevens Football</P>
                    </SubpageHeroContent>
                    <SubpageHeroMedia>
                        <Image src="/images/static-media/social-impact.avif" alt="Social Impact Hero" fill className="object-cover" />
                    </SubpageHeroMedia>
                </SubpageHero>
            <div>
            <Container maxWidth="lg">
                <Section padding="md" className="text-center">
                    <Container maxWidth="md">
                        <H2 variant="h1" className="uppercase py-12">Rising Sevens Youth Tournament by W7F</H2>
                        <P noSpace>December 6-7, 2025</P>
                        <P noSpace>Beyond Bancard Field & Dolphin Field at NSU</P>
                        <P noSpace>Fort Lauderdale, Florida</P>
                        <div className="mt-8">
                            <Button asChild size="skew">
                                <Link href="https://bracketteam.com/event/6693/Rising_7s/registration" target="_blank"><span>Register Now</span></Link>
                            </Button>
                        </div>
                    </Container>
                </Section>
                <Section padding="md">
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <H2 className="uppercase mb-6">About Rising Sevens</H2>
                            <P>World Sevens Football proudly introduces Rising Sevens, a youth version of the W7F experience — giving the next generation of elite players the opportunity to be part of this groundbreaking global series. Rising Sevens will take place at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida — adjacent to Beyond Bancard Stadium, the site of the professional tournament.</P>
                            <P>The youth event is open to girls’ teams in the U9 through U12 age groups. All four age groups will compete on Saturday, December 6 and Sunday, December 7.</P>
                            <Footnote>Rising Sevens is not affiliated with FYSA or US Club Soccer and is open to all clubs, coaches, and teams. Whether you’re a club coach, trainer, or team parent, you can organize a team and take part in this exciting new addition to the World Sevens Football series.</Footnote>
                            <div className="mt-8">
                                <Button asChild size="skew">
                                    <Link href="https://bracketteam.com/event/6693/Rising_7s/registration" target="_blank"><span>Register Your Team</span></Link>
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="flex mb-8 mt-3">
                                <Badge fast variant="backdrop_blur" className="uppercase">Tournament Info</Badge>
                            </div>
                            <div className="grid grid-cols-2 grid-rows-2 auto-cols-fr gap-6">
                                {infoData.map((info, index) => (
                                    <InfoCard
                                        key={info.id}
                                        subtitle={info.subtitle}
                                        title={info.title}
                                        description={info.description}
                                        className={index === infoData.length - 1 ? "col-span-2" : ""}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
                <Section padding="md">
                    <Container maxWidth="md">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-4xl font-headers font-semibold">
                                    FAQs
                                </CardTitle>
                                <CardDescription className="text-base">Frequently asked questions about World Sevens Football</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqData.map((faq) => (
                                        <AccordionItem key={faq.id} value={faq.id}>
                                            <AccordionTrigger>
                                                <strong>{faq.question}</strong>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <div className="mt-8 text-center">
                                    <Button asChild size="skew">
                                        <Link href="/faqs"><span>Read More</span></Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Container>
                </Section>
            </Container>
        </div>
        </PaddingGlobal>
        </>
    )
}