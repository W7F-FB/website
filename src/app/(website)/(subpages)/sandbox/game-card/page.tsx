import { Section, Container } from "@/components/website-base/padding-containers"
import { GameCardRow } from "@/components/blocks/game/game-card-row"
import { getGameData } from "@/lib/data/get-game-data"

export default async function GameCardSandboxPage() {

  const competitionId = "1303"
  const seasonId = "2025"

  const fixtures = await getGameData(competitionId, seasonId)
  console.log(fixtures)
  return (
    <Container>
      <Section padding="md">
        <div className="space-y-10">
          <GameCardRow
            fixtures={fixtures}
            showDate={false}
          />
        </div>
      </Section>
    </Container>
  )
}
