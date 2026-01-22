"use client";

import Image from "next/image";
import Link from "next/link";

import { PaddingGlobal, Section, Container } from "@/components/website-base/padding-containers";
import { HeroSlider, HeroSliderSlide, HeroSliderSlideContent } from "@/components/blocks/hero-slider";
import { H1, H2, P } from "@/components/website-base/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQItem } from "@/types/basic";
import { ClubListClient, type ClubListData } from "@/components/blocks/clubs/club-list-client";
import { ClubBadge } from "@/components/blocks/clubs/club";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle, SectionHeadingText } from "@/components/sections/section-heading";
import { RecentNewsGridClient } from "@/components/blocks/recent-news-grid-client";
import type { BlogMetadata } from "@/components/blocks/posts/post";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { Separator } from "@/components/ui/separator";
import { PrismicLink } from "@prismicio/react";
import { FAQBannerLayout } from "@/components/blocks/faq-banner-layout";
import { TournamentCard } from "@/components/blocks/tournament-card";
import { TestimonialCarousel } from "@/components/blocks/testimonial-carousel";
import { formatDateRange, formatCurrencyInWords } from "@/lib/utils";
import { CaretRightIcon, PalmtreeIcon } from "@/components/website-base/icons";
import { Background } from "@/components/ui/background";
import { StayUpdatedBanner } from "@/components/blocks/stay-updated-banner";
import type { TournamentDocument, BlogDocument, TeamDocument } from "../../../../prismicio-types";
import { Status } from "@/components/ui/status";
import { GradientBg } from "@/components/ui/gradient-bg";
import { getImageUrl } from "@/cms/utils";

const faqData: FAQItem[] = [
    {
        id: "item-1",
        question: "What is the format of a W7F tournament?",
        answer: (
            <>
                <P>The fast-paced seven-a side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.</P>
                <P>Each club will play between three and five games in total, depending on the progress of that club through the tournament, over a three-day period.</P>
            </>
        )
    },
    {
        id: "item-2",
        question: "What is the format of a W7F match?",
        answer: (
            <P>Our second tournament will take place at Beyond Bancard Field in Fort Lauderdale, Florida on December 5-7, 2025.Matches are played on a pitch half of the size of a standard 11-a-side football pitch. Each match will last 30 minutes, divided into two halves of 15 minutes each, with extra time for a tie-break. There will be a 5-minute halftime. There are unlimited rolling substitutions and no offside rule.</P>
        )
    },
    {
        id: "item-3",
        question: "Who participates in W7F tournaments?",
        answer: (
            <P>Established professional clubs from the best leagues across the globe have committed to participating in W7F&apos;s seven-a side tournaments. From that club pool, teams will be chosen to compete.</P>
        )
    }
];

type HeroTournamentWithChampion = {
    tournament: TournamentDocument;
    champion: TeamDocument | null;
};

type Props = {
    heroTournamentsWithChampions: HeroTournamentWithChampion[];
    featuredRecapBlog: BlogDocument | null;
    allTournaments: TournamentDocument[];
    clubListData: ClubListData[];
    recentNewsPosts: BlogMetadata[];
};

export default function HomePageContent({
    heroTournamentsWithChampions,
    featuredRecapBlog: _featuredRecapBlog,
    allTournaments,
    clubListData,
    recentNewsPosts,
}: Props) {
    return (
        <PaddingGlobal>
            <Section padding="sm">
                <HeroSlider autoplay={true}>
                    {/* Intro slide */}
                    <HeroSliderSlide key="intro" className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
                        <HeroSliderSlideContent className="relative z-10 w-full lg:max-w-3xl justify-self-start flex flex-col items-start justify-center bg-extra-muted !min-h-0 px-6 lg:px-18 py-12 lg:py-24">
                            <div className="absolute top-0 bottom-0 -right-[0.5rem] -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-secondary/15 backdrop-blur-sm border-r border-foreground/10" />
                            <div className="absolute top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-extra-muted" />
                            <GradientBg className="top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] opacity-30" />
                            <div className="relative z-10 text-center md:text-left flex flex-col items-center md:items-start">
                                <H1 className="uppercase">World Sevens Football</H1>
                                <P className="text-2xl mt-2">
                                    A fast-paced, action-packed global 7v7 women's football series
                                </P>
                                <div className="mt-8">
                                    <Button asChild size="skew_lg" className="clip-chop-sm">
                                        <Link href="#tournaments"><span>Tournaments</span></Link>
                                    </Button>
                                </div>
                            </div>
                        </HeroSliderSlideContent>
                        <div className="relative h-80 lg:h-auto overflow-hidden">
                            <Image src="/images/static-media/W7FTrophy.avif" alt="World Sevens Football Trophy" fill className="object-cover object-center" />
                        </div>
                    </HeroSliderSlide>
                    {/* Tournament slides */}
                    {[...heroTournamentsWithChampions].reverse().map(({ tournament: t, champion }, index) => {
                        const heroImage = getImageUrl(t.data.hero_image);
                        const eventNumber = heroTournamentsWithChampions.length - index;

                        return (
                            <HeroSliderSlide key={t.uid} className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
                                {/* Content column - matches SubpageHeroContent structure */}
                                <HeroSliderSlideContent className="relative z-10 w-full lg:max-w-3xl justify-self-start flex flex-col items-start justify-center bg-extra-muted !min-h-0 px-6 lg:px-18 py-12 lg:py-24">
                                    <div className="absolute top-0 bottom-0 -right-[0.5rem] -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-secondary/15 backdrop-blur-sm border-r border-foreground/10" />
                                    <div className="absolute top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] bg-extra-muted" />
                                    <GradientBg className="top-0 bottom-0 right-0 -left-[50%] origin-bottom-right -skew-x-[var(--skew-btn)] opacity-30" />
                                    {t.uid === "fort-lauderdale" && (
                                        <Background className="flex items-start justify-start">
                                            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
                                        </Background>
                                    )}
                                    <div className="relative z-10 text-center md:text-left flex flex-col items-center md:items-start">
                                        <Status className="text-lg mb-5 gap-3">Event #{eventNumber}</Status>
                                        <H1 className="uppercase">{t.data.nickname}</H1>
                                        <P className="text-lg">
                                            <span className="font-semibold">{formatDateRange(t.data.start_date, t.data.end_date)}</span>
                                            <span className="ml-3 font-light text-sm">{t.data.stadium_name}</span>
                                        </P>
                                        {t.data.prize_pool && (
                                            <P noSpace className="text-lg mt-1">
                                                <span className="font-semibold">{formatCurrencyInWords(t.data.prize_pool)}</span>
                                                <span className="ml-3 font-light text-sm">Prize Pool</span>
                                            </P>
                                        )}
                                        {champion && (
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="font-semibold text-lg">Champion</span>
                                                <ClubBadge team={champion} />
                                            </div>
                                        )}
                                        <div className="mt-8 flex justify-start">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Button asChild size="skew_lg" className="clip-chop-sm">
                                                    <Link href={`/tournament/${t.uid}#group-stage`}><span>Results</span></Link>
                                                </Button>
                                                <Button asChild size="skew_lg" variant="outline">
                                                    <Link href={`/tournament/${t.uid}#stat-sheet`}><span>Stat Sheet</span></Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </HeroSliderSlideContent>
                                {/* Image column - matches SubpageHeroMedia structure */}
                                <div className="relative h-80 lg:h-auto overflow-hidden">
                                    {heroImage && (
                                        <Image src={heroImage} alt={`${t.data.title} Tournament`} fill className="object-cover object-center" />
                                    )}
                                </div>
                            </HeroSliderSlide>
                        );
                    })}
                </HeroSlider>
                <div className="mt-4" id="stay-updated">
                    <StayUpdatedBanner />
                </div>
            </Section>
            <Container>
                <Section padding="md">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Fast. Fierce. Action Packed.
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading>
                            Featuring Professional Global Talent
                        </SectionHeadingHeading>
                        <SectionHeadingText variant="lg">
                            The global 7v7 series reimagining the game. Professional clubs, star players, high-stakes matches, and a $5M prize pool per tournament.
                        </SectionHeadingText>
                    </SectionHeading>
                    <VideoBanner
                        thumbnail="/images/static-media/video-banner.avif"
                        videoUrl="https://r2.vidzflow.com/source/5428a452-4e87-47df-9685-a1e034113d79.mp4"
                        label="2025 Playback"
                        variant="emphasised"
                        aspectRatio="aspect-[9/16]"
                        className="[&_.video-player]:max-h-[85vh]"
                    />
                </Section>
                <Section padding="md" id="tournaments">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Global Events
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading>
                            Tournaments
                        </SectionHeadingHeading>
                    </SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:gap-4 gap-16">
                        <div className="flex flex-col gap-4">
                            <TournamentCard tournament={allTournaments[0]} />
                            {clubListData[0] && <ClubListClient data={clubListData[0]} variant="small" noSkew />}
                        </div>
                        <Separator variant="gradient" orientation="vertical" className="hidden md:block !h-auto" />
                        <div className="flex flex-col gap-4">
                            <TournamentCard tournament={allTournaments[1]} />
                            {clubListData[1] && <ClubListClient data={clubListData[1]} variant="small" noSkew />}
                        </div>
                    </div>

                    
                </Section>
                <Separator variant="gradient" />
                <Section padding="md">
                    
                    <TestimonialCarousel />
                </Section>
                <Separator variant="gradient" />
                <Section padding="md" className="min-h-screen">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Explore World Sevens
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading>
                            Recent News
                        </SectionHeadingHeading>
                        <Button asChild size="skew" variant="outline" className="w-fit ml-0 md:ml-auto mt-auto">
                            <PrismicLink href="/news"><span>All News</span></PrismicLink>
                        </Button>
                    </SectionHeading>
                    <RecentNewsGridClient posts={recentNewsPosts} />
                </Section>
                <Separator variant="gradient" className="my-16" />
                <Section padding="md">
                    <FAQBannerLayout>
                        <Card className="border-border/35">
                            <CardHeader>
                                <CardTitle>
                                    <H2>FAQs</H2>
                                </CardTitle>
                                <CardDescription className="text-lg">Frequently asked questions about World Sevens Football</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqData.map((faq) => (
                                        <AccordionItem key={faq.id} value={faq.id}>
                                            <AccordionTrigger>
                                                <span className="font-medium">{faq.question}</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <div className="mt-8 pl-2 w-full flex justify-end">
                                    <Button asChild variant="link">
                                        <Link href="/faqs">
                                            <span>Read More</span>
                                            <CaretRightIcon
                                                className="size-3 mt-0.5"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </FAQBannerLayout>
                </Section>
            </Container>
        </PaddingGlobal>
    );
}

