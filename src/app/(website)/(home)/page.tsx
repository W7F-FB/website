import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Section, Container } from "@/components/website-base/padding-containers";
import { HeroSlider, HeroSliderSlide, HeroSliderSlideBackground, HeroSliderSlideContent } from "@/components/blocks/hero-slider";
import { H1, P, Subtitle, TextProtect } from "@/components/website-base/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQItem } from "@/types/basic";
import { ClubList } from "@/components/blocks/clubs/club-list";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle, SectionHeadingText } from "@/components/sections/section-heading";
import { getTournamentByUid } from "@/cms/queries/tournaments";
import { RecentNewsGrid } from "@/components/blocks/recent-news-grid";

export const metadata: Metadata = {
    title: "World Sevens Football - The Future of 7v7 Soccer",
    description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
    keywords: ["7v7 football", "soccer", "World Sevens", "elite football", "tournament", "professional soccer"],
    authors: [{ name: "World Sevens Football" }],
    creator: "World Sevens Football",
    publisher: "World Sevens Football",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "World Sevens Football - The Future of 7v7 Soccer",
        description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
        url: "https://worldsevensfootball.com",
        siteName: "World Sevens Football",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "World Sevens Football - The Future of 7v7 Soccer",
        description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
        creator: "@worldsevens",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    }
};

const faqData: FAQItem[] = [
    {
        id: "item-1",
        question: "What is the format of a W7F tournament?",
        answer: [
            "The fast-paced seven-a-side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.",
            "Each club will play between three and five games in total, depending on the progress of that club through the tournament."
        ]
    },
    {
        id: "item-2",
        question: "Who participates in W7F tournaments?",
        answer: [
            "Established professional clubs from the best leagues across the globe have committed to participating in W7F's seven-a-side tournaments. From that club pool, teams will be chosen to compete.",
            "For the May 2025 tournament in Estoril, participating clubs were: Ajax, Bayern, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma and FC Rosengard."
        ]
    },
    {
        id: "item-3",
        question: "How many clubs will take part in each W7F tournaments?",
        answer: "The first and second tournament feature eight sides from the club pool. As the series grows, we expect to expand the number of teams competing in each event."
    }
];

export default async function HomePage() {
    const tournament = await getTournamentByUid("fort-lauderdale");

    if (!tournament) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Tournament not found.</p>
            </div>
        );
    }

    return (
        <div>
            <Section padding="sm">
                <HeroSlider>
                    <HeroSliderSlide className="grid grid-cols-2">
                        <HeroSliderSlideBackground>
                            <Image src="/images/static-media/fl-hero.avif" alt="Hero Slider 1" fill className="object-cover" />
                        </HeroSliderSlideBackground>
                        <HeroSliderSlideContent className="max-w-3xl justify-self-start pr-48 flex items-end grid justify-items-start">
                            <Image src="/images/static-media/watercolor-bg.jpg" alt="Hero Slider 1" fill className="object-cover clip-watercolor-mask" />
                            <TextProtect className="relative z-10">
                                <Subtitle>Next Event</Subtitle>
                                <H1 className="font-proxima uppercase font-black text-6xl">Fort Lauderdale,<br />FLorida, USA</H1>
                                <P noSpace className="text-3xl text-balance font-headers font-medium mt-3">New City. Same Stakes. <span className="font-bold">$5 Million Prize Pool.</span></P>
                            </TextProtect>
                            <Button asChild size="skew_lg" className="mt-10"><Link href="#"><span>Early Access</span></Link></Button>
                        </HeroSliderSlideContent>
                    </HeroSliderSlide>
                    <HeroSliderSlide className="grid grid-cols-2">
                        <HeroSliderSlideBackground>
                            <Image src="/images/static-media/estoril-champs.avif" alt="Hero Slider 1" fill className="object-cover object-bottom" />
                            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-background/90 to-transparent" />
                        </HeroSliderSlideBackground>
                        <HeroSliderSlideContent className="max-w-3xl justify-self-start pr-48 flex items-end grid justify-items-start">
                            <TextProtect className="relative z-10">
                                <Subtitle>Recap</Subtitle>
                                <H1 className="font-proxima uppercase font-black text-6xl">Estoril,<br />Portugal</H1>
                                <P noSpace className="text-xl text-balance font-headers font-medium mt-3">Bayern take home the title and prize pool in an action packed event.</P>
                            </TextProtect>
                            <div className="mt-10 flex gap-4">
                                <Button asChild size="skew_lg"><Link href="#"><span>View Recap</span></Link></Button>
                                <Button asChild size="skew_lg_outline"><Link href="#"><span>All Results</span></Link></Button>
                            </div>
                        </HeroSliderSlideContent>
                    </HeroSliderSlide>
                </HeroSlider>
            </Section>
            <Container>
                <Section padding="md" className="min-h-screen">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Fort Lauderdale – Participants
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading className="text-4xl">
                            Featuring Elite Global Talent
                        </SectionHeadingHeading>
                        <SectionHeadingText>
                            The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.
                        </SectionHeadingText>
                    </SectionHeading>
                    <ClubList tournament={tournament} />
                </Section>
            </Container>
            <Container>
                <Section padding="md" className="min-h-screen">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Explore World Sevens
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading className="text-4xl">
                            Recent News
                        </SectionHeadingHeading>
                    </SectionHeading>
                    <RecentNewsGrid />
                </Section>
            </Container>
            <Section padding="md" className="">
                <Container maxWidth="lg">
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
                                            {Array.isArray(faq.answer) ? (
                                                faq.answer.map((paragraph, index) => (
                                                    <P key={index}>{paragraph}</P>
                                                ))
                                            ) : (
                                                <P>{faq.answer}</P>
                                            )}
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
        </div>
    );
}
