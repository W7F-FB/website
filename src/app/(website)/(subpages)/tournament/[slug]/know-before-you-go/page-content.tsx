import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, H2, H3, H4, P, Blockquote, List, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument } from "../../../../../../../prismicio-types"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero"
import { Button } from "@/components/ui/button"
import { PalmtreeIcon } from "@/components/website-base/icons"
import { formatDateRange, formatCurrencyInWords, cn } from "@/lib/utils"
import { isFilled } from "@prismicio/client"
import { Background } from "@/components/ui/background"
import Link from "next/link"
import { PrismicRichText } from "@prismicio/react"

type Props = {
    tournament: TournamentDocument
}

export default function TournamentKnowBeforeYouGoPageContent({ tournament }: Props) {
    const hasTickets = tournament.data.tickets_available
    const hasPdf = isFilled.link(tournament.data.know_before_you_go_pdf) && tournament.data.know_before_you_go_pdf.link_type === "Media"
    const hasBothButtons = hasTickets && hasPdf
    
    return (
        <div>
            <PaddingGlobal>
                <div>
                    <SubpageHeroSecondary className="max-w-none w-full">
                        <Background className="flex items-start justify-between">
                            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
                            <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
                        </Background>
                        <div className="relative max-w-3xl mx-auto">
                            <Subtitle className="text-primary">{tournament.data.title}</Subtitle>
                            <H1 className="uppercase">Know Before You Go</H1>
                            <P className="text-lg"><span className="font-semibold">{formatDateRange(tournament.data.start_date, tournament.data.end_date)}</span><span className="ml-3 font-light text-sm">{tournament.data.stadium_name}</span></P>
                            {isFilled.number(tournament.data.prize_pool) && (
                                <P noSpace className="text-lg mt-1"><span className="font-semibold">{formatCurrencyInWords(tournament.data.prize_pool)}</span><span className="ml-3 font-light text-sm">Prize Pool</span></P>
                            )}
                            {(hasTickets || hasPdf) && (
                                <div className={cn(
                                    "mt-8 gap-4 w-auto",
                                    hasBothButtons ? "grid grid-cols-1 lg:grid-cols-2" : "flex items-center justify-center"
                                )}>
                                    {hasTickets && (
                                        <Button asChild size="skew_lg" className={hasBothButtons ? "w-full" : ""}>
                                            <Link href="/checkout"><span>Purchase Tickets</span></Link>
                                        </Button>
                                    )}
                                    {hasPdf && tournament.data.know_before_you_go_pdf.link_type === "Media" && "url" in tournament.data.know_before_you_go_pdf && (
                                        <Button asChild size="skew_lg" variant={hasTickets ? "outline" : undefined} className={hasBothButtons ? "w-full" : ""}>
                                            <a href={tournament.data.know_before_you_go_pdf.url} download target="_blank" rel="noopener noreferrer">
                                                <span>Download PDF Guide</span>
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </SubpageHeroSecondary>
                    <Container maxWidth="lg">
                        <Section padding="md">
                            <div className="max-w-5xl mx-auto prose prose-invert prose-p:mb-6">
                                {isFilled.richText(tournament.data.know_before_you_go) && (
                                    <PrismicRichText
                                        field={tournament.data.know_before_you_go}
                                        components={{
                                            heading1: ({ children }) => <H1 className="mt-8 mb-4">{children}</H1>,
                                            heading2: ({ children }) => <H2 className="mt-8 mb-4">{children}</H2>,
                                            heading3: ({ children }) => <H3 className="mt-6 mb-3">{children}</H3>,
                                            heading4: ({ children }) => <H4 className="mt-6 mb-3">{children}</H4>,
                                            paragraph: ({ children }) => <P className="mb-6">{children}</P>,
                                            preformatted: ({ children }) => <Blockquote className="my-6">{children}</Blockquote>,
                                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                            em: ({ children }) => <em className="italic">{children}</em>,
                                            listItem: ({ children }) => <li className="mb-2">{children}</li>,
                                            oListItem: ({ children }) => <li className="mb-2">{children}</li>,
                                            list: ({ children }) => <List className="my-6">{children}</List>,
                                            oList: ({ children }) => <ol className="my-6 ml-6 list-decimal space-y-2">{children}</ol>,
                                            hyperlink: ({ node, children }) => {
                                                const isExternal = node.data.link_type === "Web"
                                                return (
                                                    <a
                                                        href={node.data.url || ""}
                                                        className="underline underline-offset-2 text-primary"
                                                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                    >
                                                        {children}
                                                    </a>
                                                )
                                            },
                                        }}
                                    />
                                )}
                            </div>
                        </Section>
                    </Container>
                </div>
            </PaddingGlobal>
        </div>
    )
}

