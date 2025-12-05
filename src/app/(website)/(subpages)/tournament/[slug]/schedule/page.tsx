import { redirect } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function TournamentSchedulePage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (tournament?.data.status === "Complete") {
    redirect(`/tournament/${slug}`)
  }

  redirect(`/tournament/${slug}/tickets#schedule`)
}
