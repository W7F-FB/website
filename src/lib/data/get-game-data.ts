import { getF1Fixtures } from "@/app/api/opta/feeds";
import { mapOptaFixture } from "@/lib/opta/map-f1";
import { getTeamByOptaId } from "@/cms/queries/team"
import { normalizeOptaId } from "@/lib/opta/utils"

export async function getGameData(competitionId: string, seasonId: string) {

  const optaData = await getF1Fixtures(competitionId, seasonId)
  console.log(optaData)
  const matches = optaData?.SoccerFeed?.SoccerDocument?.MatchData || []
  const fixtures = matches.map(mapOptaFixture)

  const enriched = await Promise.all(
    fixtures.map(async (fixture) => {
      const homeTeam = await getTeamByOptaId(normalizeOptaId(fixture.home.id))
      const awayTeam = await getTeamByOptaId(normalizeOptaId(fixture.away.id))

      return {
        ...fixture,
        homeTeam,
        awayTeam,
      }
    })
  )
  return enriched
}