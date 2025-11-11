import { redirect } from "next/navigation"
import { getNavigationTournaments } from "@/cms/queries/tournaments"

export default async function TournamentIndexPage() {
  const tournaments = await getNavigationTournaments()
  
  if (tournaments.length > 0 && tournaments[0].uid) {
    redirect(`/tournament/${tournaments[0].uid}`)
  }
  
  redirect("/")
}

