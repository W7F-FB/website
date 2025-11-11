import { Section, Container } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import type { TournamentDocument } from "../../../../../prismicio-types"
import { SubpageHero, SubpageHeroMedia, SubpageHeroContent, SubpageHeroMediaBanner } from "@/components/blocks/subpage-hero"
import { PrismicNextImage } from "@prismicio/next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CaretRightIcon } from "@/components/website-base/icons"

type Props = {
    tournament: TournamentDocument
}

export default async function TournamentPagePast({ tournament }: Props) {
    const startDate = tournament.data.start_date ? new Date(tournament.data.start_date) : null
    const endDate = tournament.data.end_date ? new Date(tournament.data.end_date) : null
    
    const formatDateRange = () => {
        if (!startDate || !endDate) return ''
        
        const month = startDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase()
        const startDay = startDate.getUTCDate()
        const endDay = endDate.getUTCDate()
        const year = startDate.getUTCFullYear()
        
        return `${month} ${startDay}-${endDay} ${year}`
    }

    return (
        <div>
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>Results</Subtitle>
                    <H1 className="uppercase">{tournament.data.title}</H1>
                    <P className="text-lg">{formatDateRange()}<br />{tournament.data.stadium_name}</P>
                    <div className="mt-8 flex justify-start">
                        <div className="grid grid-cols-2 gap-4">
                            <Button asChild size="skew_lg">
                                <Link href="#highlights"><span>View Highlights</span></Link>
                            </Button>
                            <Button asChild size="skew_lg" variant="outline">
                                <Link href="#results"><span>Final Results</span></Link>
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
                            <P noSpace>Want to learn more about upcoming tournaments? <span>
                                <Button asChild variant="link" size="sm" className=" ml-1 p-0 h-auto !px-0">
                                    <Link href="/tournament">
                                        View Upcoming Events
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
                    <P>Past tournament content coming soon...</P>
                </Section>
            </Container>
        </div>
    )
}

