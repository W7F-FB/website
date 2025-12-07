import Link from "next/link"
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, H2, P, Subtitle } from "@/components/website-base/typography"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero"
import { PalmtreeIcon, CaretRightIcon } from "@/components/website-base/icons"
import { Background } from "@/components/ui/background"
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid"
import { ScheduleTabs } from "@/components/blocks/tournament/schedule/schedule-tabs"
import { SectionHeading, SectionHeadingHeading, SectionHeadingLeft, SectionHeadingRight } from "@/components/sections/section-heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FAQBannerLayout } from "@/components/blocks/faq-banner-layout"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getTicketingFaqs } from "@/lib/data/faqs"
import { formatDateRange, formatCurrencyInWords } from "@/lib/utils"
import { isFilled } from "@prismicio/client"
import { getImageUrl, getImageAlt } from "@/cms/utils"
import type { TournamentDocument } from "../../../../../../../prismicio-types"

type Props = {
  tournament: TournamentDocument
}

export default function TicketsPageContent({ tournament }: Props) {
  const ticketingFaqs = getTicketingFaqs()

  return (
    <PaddingGlobal>
      <div>
        <SubpageHeroSecondary className="max-w-none w-full">
          <Background className="flex items-start justify-between">
            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
          </Background>
          <div className="relative max-w-3xl mx-auto">
            <Subtitle className="text-primary">{tournament.data.title}</Subtitle>
            <H1 className="uppercase">Tickets</H1>
            <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
            {isFilled.number(tournament.data.prize_pool) && (
              <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
            )}
            <div className={`mt-8 grid gap-4 ${tournament.data.tickets_available ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
              {tournament.data.tickets_available && (
                <Button asChild size="skew_lg" className="w-full">
                  <Link href="/checkout"><span>Purchase Tickets</span></Link>
                </Button>
              )}
              <Button asChild size="skew_lg" variant={tournament.data.tickets_available ? "outline" : undefined} className="w-full">
                <Link href="#schedule"><span>View Schedule</span></Link>
              </Button>
            </div>
          </div>
        </SubpageHeroSecondary>
        <Container maxWidth="lg">
          <Section padding="md">
            <TicketOptionsGrid tournament={tournament} />
          </Section>
          <Separator variant="gradient" />
          <Section padding="md" id="schedule">
            <SectionHeading variant="split" className="pb-8">
              <SectionHeadingLeft>
                <SectionHeadingHeading variant="h2" className="pb-0">Schedule</SectionHeadingHeading>
                <P noSpace>All times are subject to change</P>
              </SectionHeadingLeft>
              <SectionHeadingRight className="hidden lg:flex">
                <Button asChild variant="secondary" size="skew" className="mt-auto">
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
          <Section padding="md">
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
                  <CardDescription className="text-lg">Frequently asked questions about tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {ticketingFaqs.map((faq) => (
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
                        <CaretRightIcon className="size-3 mt-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FAQBannerLayout>
          </Section>
        </Container>
      </div>
    </PaddingGlobal>
  )
}

