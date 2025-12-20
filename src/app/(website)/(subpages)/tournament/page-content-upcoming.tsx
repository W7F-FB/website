import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { H1, H2, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument, BlogDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { CaretRightIcon } from "@/components/website-base/icons"
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle, SectionHeadingLeft, SectionHeadingRight } from "@/components/sections/section-heading"
import { ClubList } from "@/components/blocks/clubs/club-list"
import { Separator } from "@/components/ui/separator"
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid"
import { FAQBannerLayout } from "@/components/blocks/faq-banner-layout"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import { ScheduleTabs } from "@/components/blocks/tournament/schedule/schedule-tabs"
import { PrivateVipForm } from "@/components/blocks/forms/vip-cabanas/private-vip-form"
import { ImageSlider, ImageSliderSlide } from "@/components/blocks/image-slider"
import Image from "next/image"
import { formatDateRange, formatCurrencyInWords, mapBlogDocumentToMetadata } from "@/lib/utils"
import { isFilled } from "@prismicio/client"
import { Badge } from "@/components/ui/badge"
import { PostGrid } from "@/components/blocks/posts/post-grid"
import { PrismicLink } from "@prismicio/react"
import { getUpcomingTournamentFaqSection } from "@/cms/queries/faqs"
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text"

type Props = {
    tournament: TournamentDocument
    tournamentBlogs: BlogDocument[]
}

export default async function TournamentPageUpcoming({ tournament, tournamentBlogs }: Props) {
    const upcomingTournamentFaqSection = await getUpcomingTournamentFaqSection()
    const faqData = upcomingTournamentFaqSection?.data.faqs || []

    return (
        <div>
            <PaddingGlobal>
                <div>
                    <SubpageHero>
                        <SubpageHeroContent>
                            <Subtitle>{tournament.data.title}</Subtitle>
                            <H1 className="uppercase">{tournament.data.hero_headline || "Tickets on sale now"}</H1>
                            <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
                            {isFilled.number(tournament.data.prize_pool) && (
                                <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
                            )}
                            <div className="mt-8 flex justify-center md:justify-start">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button asChild size="skew_lg">
                                        <Link href="/checkout"><span>Purchase Tickets</span></Link>
                                    </Button>
                                    <Button asChild size="skew_lg" variant="outline">
                                        <Link href={`/tournament/${tournament.uid}/schedule`}><span>View Schedule</span></Link>
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
                                {isFilled.link(tournament.data.hero_media_banner_cta) && tournament.data.hero_media_banner_text && (
                                    <SubpageHeroMediaBanner>
                                        <P noSpace>{tournament.data.hero_media_banner_text} <span>
                                            <Button asChild variant="link" size="sm" className=" ml-1 p-0 h-auto !px-0">
                                                <PrismicLink field={tournament.data.hero_media_banner_cta}>
                                                    {tournament.data.hero_media_banner_cta.text || "Learn More"}
                                                    <CaretRightIcon className="size-3 mt-px" />
                                                </PrismicLink>
                                            </Button>
                                        </span></P>
                                    </SubpageHeroMediaBanner>
                                )}
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
                        <Separator variant="gradient" />
                        <Section padding="md">
                            <TicketOptionsGrid />
                        </Section>
                        <Section padding="md" id="schedule">
                            <SectionHeading variant="split" className="pb-8">
                                <SectionHeadingLeft>
                                    <SectionHeadingHeading variant="h2" className="pb-0">Schedule</SectionHeadingHeading>
                                    <P noSpace>All times are subject to change</P>
                                </SectionHeadingLeft>
                                <SectionHeadingRight className="hidden lg:flex">
                                    <Button asChild  variant="secondary" size="skew" className="mt-auto">
                                        <Link href={`/tournament/${tournament.uid}/schedule`}><span>View Match Schedule</span></Link>
                                    </Button>
                                </SectionHeadingRight>
                            </SectionHeading>
                            <ScheduleTabs tournamentSlug={tournament.uid} />
                            <div className="flex justify-center mt-4 lg:hidden">
                                <Button asChild variant="secondary" size="skew" className="mx-auto">
                                    <Link href={`/tournament/${tournament.uid}/schedule`}><span>View Match Schedule</span></Link>
                                </Button>
                            </div>
                        </Section>
                        <Separator variant="gradient" />
                        <Section padding="lg" id="vip-cabanas" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
                            <div className="relative h-80 md:h-full w-full">
                                <div className="absolute top-4 left-4 z-10">
                                    <Badge fast size="lg" variant="secondary">VIP Cabanas</Badge>
                                </div>
                                <ImageSlider autoplay autoplayDelay={5000}>
                                    <ImageSliderSlide >
                                        <Image
                                            src="/images/static-media/vip-cabanas.jpg"
                                            alt="VIP Cabanas"
                                            fill
                                            className="w-full h-full object-cover"
                                        />
                                    </ImageSliderSlide>
                                    <ImageSliderSlide>
                                        <Image
                                            src="/images/static-media/vip-cabanas-2.webp"
                                            alt="VIP Cabanas View"
                                            fill
                                            className="w-full h-full object-cover"
                                        />
                                    </ImageSliderSlide>
                                </ImageSlider>
                            </div>
                            <PrivateVipForm />
                        </Section>
                        {tournamentBlogs.length > 0 && (
                            <>
                                <Separator variant="gradient" />
                                <Section padding="md">
                                    <SectionHeading variant="split">
                                        <SectionHeadingSubtitle>
                                            Latest Coverage
                                        </SectionHeadingSubtitle>
                                        <SectionHeadingHeading>
                                            Tournament News
                                        </SectionHeadingHeading>
                                        <Button asChild size="skew" variant="outline" className="w-fit ml-0 md:ml-auto mt-auto">
                                            <PrismicLink href="/news"><span>All News</span></PrismicLink>
                                        </Button>
                                    </SectionHeading>
                                    <PostGrid posts={tournamentBlogs.slice(0, 4).map(mapBlogDocumentToMetadata)} />
                                </Section>
                            </>
                        )}
                    </Container>
                    <Section padding="md">
                        <Container maxWidth="lg">
                            <FAQBannerLayout
                                images={tournament.data.hero_image && getImageUrl(tournament.data.hero_image) ? [{
                                    url: getImageUrl(tournament.data.hero_image)!,
                                    altText: getImageAlt(tournament.data.hero_image)
                                }] : undefined}
                            >
                                <Card className="border-border/35">
                                    <CardHeader>
                                        <CardTitle>
                                            <H2>FAQs</H2>
                                        </CardTitle>
                                        <CardDescription className="text-lg">Frequently asked questions about World Sevens Football</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            {faqData.map((faq, index) => (
                                                <AccordionItem key={`competition-faq-${index}`} value={`competition-faq-${index}`}>
                                                    <AccordionTrigger>
                                                        <span className="font-medium">{faq.question}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <PrismicRichTextComponent field={faq.answer} />
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
                        </Container>
                    </Section>
                </div>
            </PaddingGlobal>
        </div>
    )
}

