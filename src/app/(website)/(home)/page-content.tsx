import Image from "next/image";
import Link from "next/link";

import { PaddingGlobal, Section, Container } from "@/components/website-base/padding-containers";
import { HeroSlider, HeroSliderSlide, HeroSliderSlideBackground, HeroSliderSlideContent } from "@/components/blocks/hero-slider";
import { H1, H2, H3, P, Subtitle, TextProtect } from "@/components/website-base/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQItem } from "@/types/basic";
import { ClubList } from "@/components/blocks/clubs/club-list";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle, SectionHeadingText } from "@/components/sections/section-heading";
import { RecentNewsGrid } from "@/components/blocks/recent-news-grid";
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { Separator } from "@/components/ui/separator";
import { PostCardHoriz } from "@/components/blocks/posts/post";
import { PrismicLink } from "@prismicio/react";
import { FAQBannerLayout } from "@/components/blocks/faq-banner-layout";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import { CaretRightIcon } from "@/components/website-base/icons";
import { TuneInBanner } from "@/components/blocks/tune-in-banner";
import type { TournamentDocument, BlogDocument, BroadcastPartnersDocument } from "../../../../prismicio-types";

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

type Props = {
    tournament: TournamentDocument;
    estorilTournament: TournamentDocument | null;
    featuredRecapBlog: BlogDocument | null;
    dazn: BroadcastPartnersDocument | null;
    tnt: BroadcastPartnersDocument | null;
    truTV: BroadcastPartnersDocument | null;
    hboMax: BroadcastPartnersDocument | null;
    univision: BroadcastPartnersDocument | null;
    espn: BroadcastPartnersDocument | null;
    disneyPlus: BroadcastPartnersDocument | null;
};

export default function HomePageContent({
    tournament,
    estorilTournament,
    featuredRecapBlog,
    dazn,
    tnt,
    truTV,
    hboMax,
    univision,
    espn,
    disneyPlus,
}: Props) {
    return (
        <PaddingGlobal>
            <Section padding="sm">
                <HeroSlider autoplay={true}>
                    <HeroSliderSlide className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
                        <HeroSliderSlideBackground className="h-[25rem] top-auto lg:top-0 lg:h-full">
                            <Image src="/images/static-media/fl-hero.avif" alt="Hero Slider 1" fill className="object-cover object-bottom-right lg:object-center" />
                        </HeroSliderSlideBackground>
                        <HeroSliderSlideContent className="w-full lg:max-w-3xl justify-self-start px-8 pb-24  lg:pr-48 flex flex-col items-start justify-end">
                            <Image src="/images/static-media/watercolor-bg.jpg" alt="Hero Slider 1" fill className="object-cover clip-watercolor-mask" />
                            <TextProtect className="relative z-10 block space-y-3 lg:space-y-5">
                                <Subtitle className="text-lg lg:text-xl text-primary">Tickets available now</Subtitle>
                                <H1 className="font-proxima uppercase font-black text-3xl lg:text-6xl">Fort Lauderdale,<br />FLorida, USA</H1>
                                <P noSpace className="text-xl lg:text-3xl text-balance font-headers font-medium text-foreground">New City. Same Stakes. <span className="font-bold">$5 Million Prize Pool.</span></P>
                            </TextProtect>
                            <div className="mt-6 w-full lg:mt-10 flex flex-col lg:flex-row gap-3 lg:gap-4">
                                <Button asChild size="skew_lg"><Link href="/checkout"><span>Purchase Tickets</span></Link></Button>
                                <Button asChild size="skew_lg" variant="accent"><Link href="/tournament/fort-lauderdale/schedule"><span>Schedule</span></Link></Button>
                            </div>
                        </HeroSliderSlideContent>
                        <HeroSliderSlideContent className="max-w-none w-full h-full pb-6 lg:pb-12 pr-4 lg:pr-36 flex flex-col items-start justify-end text-shadow-xl gap-2">
                            <H3 className="uppercase text-base lg:text-lg">Beyond Bancard Field</H3>
                            <p className="text-3xl lg:text-5xl font-black font-proxima uppercase">Dec 5-7, 2025</p>
                        </HeroSliderSlideContent>
                    </HeroSliderSlide>
                </HeroSlider>
                <div className="mt-4" id="tune-in">
                    <TuneInBanner 
                        dazn={dazn}
                        tnt={tnt}
                        truTV={truTV}
                        hboMax={hboMax}
                        univision={univision}
                        espn={espn}
                        disneyPlus={disneyPlus}
                    />
                </div>
            </Section>
            <Container>
                <Section padding="md">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Fort Lauderdale – Participants
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading>
                            Featuring Elite Global Talent
                        </SectionHeadingHeading>
                        <SectionHeadingText variant="lg">
                            The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.
                        </SectionHeadingText>
                    </SectionHeading>
                    <ClubList tournament={tournament} />
                </Section>
                <Section padding="md">
                    <TicketOptionsGrid />
                </Section>
                <Section padding="md">
                    <Separator variant="gradient" />
                </Section>
                <Section padding="md">
                    <SectionHeading variant="split">
                        <SectionHeadingSubtitle>
                            Event #1 Recap
                        </SectionHeadingSubtitle>
                        <SectionHeadingHeading>
                            World Sevens Football Kickoff
                        </SectionHeadingHeading>
                        <SectionHeadingText variant="lg">
                            The inaugural World Sevens Football (W7F) tournament in Estoril, Portugal, delivered an electrifying showcase of elite women&apos;s football. Bayern Munich emerged as champions after a thrilling 2–1 comeback victory over Manchester United in the final, securing the lion&apos;s share of the $5 million prize pool.
                        </SectionHeadingText>
                    </SectionHeading>
                    {featuredRecapBlog && (
                        <PostCardHoriz blog={mapBlogDocumentToMetadata(featuredRecapBlog)} />
                    )}
                </Section>
                <Section padding="md">
                    <VideoBanner
                        thumbnail="/images/static-media/video-banner.avif"
                        videoUrl="https://r2.vidzflow.com/source/a4c227f3-6918-4e29-8c72-b509a9cf3d5c.mp4"
                        label="Recap the action"
                    />
                </Section>
                <Section padding="md" >
                    <SectionHeading variant="split">
                        <div>
                            <SectionHeadingHeading variant="h2">
                                Event #1 Founding Participants
                            </SectionHeadingHeading>
                            <P className="text-lg pb-6 md:pb-0">
                                Estoril, Portugal • MAY 21-23, 2025
                            </P>
                        </div>
                        <Button asChild size="skew" variant="outline" className="w-fit ml-0 md:ml-auto mt-auto">
                            <PrismicLink document={estorilTournament}><span>View Results</span></PrismicLink>
                        </Button>
                    </SectionHeading>
                    {estorilTournament && <ClubList tournament={estorilTournament} />}
                </Section>
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
                    <RecentNewsGrid />
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

