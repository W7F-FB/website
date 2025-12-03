import { notFound, redirect } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getBlogsByTournament } from "@/cms/queries/blog"
import { getTeamsByTournament } from "@/cms/queries/team"
import TournamentSchedulePageContent from "./page-content"
import { dev } from "@/lib/dev"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) {
    return {
      title: "Schedule - World Sevens Football",
      description: "View tournament schedules and match fixtures for World Sevens Football.",
    }
  }

  const title = `Schedule - ${tournament.data.title} - World Sevens Football`
  const description = `View the complete match schedule for ${tournament.data.title}. Check fixtures, match times, and track your favorite teams throughout the tournament.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/tournament/${slug}/schedule`,
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

export default async function TournamentSchedulePage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  if (tournament.data.status === "Complete") {
    redirect(`/tournament/${slug}`)
  }

  const [tournamentBlogs, prismicTeams] = await Promise.all([
    getBlogsByTournament(tournament.id),
    getTeamsByTournament(slug)
  ])

  dev.log('tournament', tournament)
  dev.log('tournamentBlogs', tournamentBlogs)
  dev.log('prismicTeams', prismicTeams)

  return (
    <>
      <NavMain showBreadcrumbs customBreadcrumbs={[
        { label: "Home", href: "/" },
        { label: tournament.data.title, href: `/tournament/${tournament.uid}` },
        { label: "Schedule", href: `/tournament/${tournament.uid}/schedule` }
      ]} />
      <main className="flex-grow min-h-[30rem]">
        <TournamentSchedulePageContent
          tournament={tournament}
          tournamentBlogs={tournamentBlogs}
          prismicTeams={prismicTeams}
        />
      </main>
      <Footer />
    </>
  )
}
