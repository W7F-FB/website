import { notFound, redirect } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getTeamsByTournament } from "@/cms/queries/team"
import { getF1Fixtures } from "@/app/api/opta/feeds"
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, P, Subtitle } from "@/components/website-base/typography"
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero"
import { PalmtreeIcon } from "@/components/website-base/icons"
import { Background } from "@/components/ui/background"
import { PrivateVipForm } from "@/components/blocks/forms/vip-cabanas/private-vip-form"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"
import type { F1MatchData, F1TeamData } from "@/types/opta-feeds/f1-fixtures"
import type { TeamDocument } from "../../../../../../../prismicio-types"
import { groupMatchesByDate } from "../../utils"
import { dev } from "@/lib/dev"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) {
    return {
      title: "VIP Cabanas - World Sevens Football",
      description: "Experience the ultimate pitchside luxury with a private VIP cabana at World Sevens Football.",
    }
  }

  const title = `VIP Cabanas - ${tournament.data.title} - World Sevens Football`
  const description = `Experience the ultimate pitchside luxury with a private VIP cabana at ${tournament.data.title}. Submit your inquiry for exclusive VIP access.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/tournament/${slug}/vip`,
      siteName: "World Sevens Football",
      type: "website",
      images: [
        {
          url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
          width: 1200,
          height: 630,
          alt: "World Sevens Football",
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@worldsevens",
    },
  }
}

export default async function VipCabanasPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.status === "Complete") {
    redirect(`/tournament/${slug}`)
  }

  const competitionId = tournament.data.opta_competition_id
  const seasonId = tournament.data.opta_season_id

  let groupedFixtures: Map<string, F1MatchData[]> = new Map()
  let prismicTeams: TeamDocument[] = []
  let optaTeams: F1TeamData[] = []
  if (competitionId && seasonId && tournament.uid) {
    try {
      const [fixtures, teams] = await Promise.all([
        getF1Fixtures(competitionId, seasonId),
        getTeamsByTournament(tournament.uid)
      ])
      prismicTeams = teams

      if (fixtures && prismicTeams.length > 0) {
        const doc = fixtures.SoccerFeed.SoccerDocument
        optaTeams = doc.Team || doc.TeamData || []
        const matchData = doc.MatchData
        
        if (matchData && Array.isArray(matchData)) {
          groupedFixtures = groupMatchesByDate(matchData)
        }
      }
    } catch (error) {
      dev.log('Error fetching fixtures for game slider:', error)
    }
  }

  return (
    <>
      <NavMain 
        showBreadcrumbs 
        customBreadcrumbs={[
          { label: "Home", href: "/" },
          { label: tournament.data.title, href: `/tournament/${tournament.uid}` },
          { label: "VIP Cabanas", href: `/tournament/${tournament.uid}/vip` }
        ]}
        groupedFixtures={groupedFixtures.size > 0 ? groupedFixtures : undefined}
        prismicTeams={prismicTeams.length > 0 ? prismicTeams : undefined}
        optaTeams={optaTeams.length > 0 ? optaTeams : undefined}
        tournament={tournament}
      />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
          <div>
            <SubpageHeroSecondary className="max-w-none w-full">
              <Background className="flex items-start justify-between">
                <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
                <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
              </Background>
              <div className="relative max-w-3xl mx-auto">
                <Subtitle className="text-primary">{tournament.data.title}</Subtitle>
                <H1 className="uppercase">VIP Cabanas</H1>
                <P className="text-lg">Experience the ultimate pitchside luxury with a private VIP cabana</P>
              </div>
            </SubpageHeroSecondary>
            <Container maxWidth="sm">
              <Section padding="md">
                <PrivateVipForm />
              </Section>
            </Container>
          </div>
        </PaddingGlobal>
      </main>
      <Footer />
    </>
  )
}

