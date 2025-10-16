import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getF3Standings } from "@/app/api/opta/feeds"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  try {
    // Test Opta API call - using example competition and season
    const optaResponse = await getF3Standings(1303, 2025)
    console.log('Opta F3 Standings Response:', JSON.stringify(optaResponse, null, 2))
  } catch (error) {
    console.error('Opta API Error:', error)
  }

  return <div></div>
}
