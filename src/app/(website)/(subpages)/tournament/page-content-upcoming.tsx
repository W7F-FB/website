import { getF3Standings } from "@/app/api/opta/feeds"
import { Section, Container } from "@/components/website-base/padding-containers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FAQItem } from "@/types/basic"
import { H1, H2, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { CaretRightIcon } from "@/components/website-base/icons"
import { SectionHeading, SectionHeadingHeading } from "@/components/sections/section-heading"
import { ClubList } from "@/components/blocks/clubs/club-list"
import { Separator } from "@/components/ui/separator"
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid"
import { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent } from "@/components/ui/motion-tabs"

const faqData: FAQItem[] = [
    {
        id: "item-1",
        question: "What is the format of a W7F tournament?",
        answer: (
            <>
                <P>The fast-paced seven-a-side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.</P>
                <P>Each club will play between three and five games in total, depending on the progress of that club through the tournament.</P>
            </>
        )
    },
    {
        id: "item-2",
        question: "Who participates in W7F tournaments?",
        answer: (
            <>
                <P>Established professional clubs from the best leagues across the globe have committed to participating in W7F's seven-a-side tournaments. From that club pool, teams will be chosen to compete.</P>
                <P>For the May 2025 tournament in Estoril, participating clubs were: Ajax, Bayern, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma and FC Rosengard.</P>
            </>
        )
    },
    {
        id: "item-3",
        question: "How many clubs will take part in each W7F tournament?",
        answer: (
            <P>The first and second tournament feature eight sides from the club pool. As the series grows, we expect to expand the number of teams competing in each event.</P>
        )
    }
];

type Props = {
    tournament: TournamentDocument
}

export default async function TournamentPageUpcoming({ tournament }: Props) {
    try {
        const optaResponse = await getF3Standings(1303, 2025)
        console.log('Opta F3 Standings Response:', JSON.stringify(optaResponse, null, 2))
    } catch (error) {
        console.error('Opta API Error:', error)
    }

    return (
        <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>Event #2</Subtitle>
                    <H1 className="uppercase">Tickets on sale now</H1>
                    <P className="text-lg">Join in to experience a new brand of football.</P>
                    <div className="mt-8 flex justify-start">
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild size="skew_lg">
                                <Link href="/checkout"><span>Purchase Tickets</span></Link>
                            </Button>
                            <Button asChild size="skew_lg" variant="outline">
                                <Link href="#"><span>View Schedule</span></Link>
                            </Button>
                        </div>
                    </div>
                </SubpageHeroContent>
                {tournament.data.hero_image && (
                    <SubpageHeroMedia>
                        <PrismicNextImage
                            field={tournament.data.hero_image}
                            fill
                            className="object-cover"
                        />
                        <SubpageHeroMediaBanner>
                            <P>Interested in watching the action from a pitchside cabana? <span>
                                <Button asChild variant="link" size="sm" className=" ml-1 p-0 h-auto !px-0">
                                    <Link href="/">
                                        Contact Us
                                        <CaretRightIcon className="size-3 mt-px" />
                                    </Link>
                                </Button>
                            </span></P>
                        </SubpageHeroMediaBanner>
                    </SubpageHeroMedia>
                )}
            </SubpageHero>
            <Container maxWidth="lg">
                <Section padding="md">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">Participating Clubs</SectionHeadingHeading>
                    </SectionHeading>
                    <ClubList tournament={tournament} />
                </Section>
                <Separator />
                <Section padding="md">
                    <TicketOptionsGrid />
                </Section>
                <Section padding="md">
                    <SectionHeading className="pb-8">
                        <SectionHeadingHeading variant="h2">Schedule</SectionHeadingHeading>
                    </SectionHeading>
                    <Tabs defaultValue="tab1">
                        <TabsList className="w-full h-18">
                            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                        </TabsList>
                        <TabsContents>
                            <TabsContent value="tab1"><div className="flex items-center justify-center py-8 bg-muted/10">Tab Content</div></TabsContent>
                            <TabsContent value="tab2"><div className="flex items-center justify-center py-18 bg-muted/10">Tab Content</div></TabsContent>
                            <TabsContent value="tab3"><div className="flex items-center justify-center py-28 bg-muted/10">Tab Content</div></TabsContent>
                        </TabsContents>
                    </Tabs>
                </Section>
            </Container>
            <Section padding="md">
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
        </div>
    )
}

