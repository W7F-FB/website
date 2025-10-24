import { getF1Fixtures } from "@/app/api/opta/feeds";
import { mapOptaFixture } from "@/lib/opta/map-f1";
import { getTeamByUid } from "@/cms/queries/team"

export async function getGameData(competitionId: string, seasonId: string) {

  const optaData = await getF1Fixtures(competitionId, seasonId)

  const matches = optaData?.SoccerFeed?.SoccerDocument?.MatchData || []

  const fixtures = matches.map(mapOptaFixture)

  const enriched = await Promise.all(
    fixtures.map(async (fixture) => {
      const homeTeam = await getTeamByUid(fixture.home.id)
      const awayTeam = await getTeamByUid(fixture.away.id)

      return {
        ...fixture,
        homeTeam,
        awayTeam,
      }
    })
  )
  return enriched
}