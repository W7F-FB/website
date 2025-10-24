import { Section, Container } from "@/components/website-base/padding-containers"
import { GameCardRow } from "@/components/blocks/game/game-card-row"
import { getGameData } from "@/lib/data/get-game-data"

export default async function TicketsPage() {
  const fixtures = [
    {
      id: "1",
      startTime: "2025-10-24T19:30:00Z",
      status: "Scheduled",
      home: { id: "100", score: null },
      away: { id: "200", score: null },
      awayTeam: {
        data: {
          name: "Man City",
          country: "USA",
          logo: { url: "/images/static-media/estoril-champs.avif" },
        },
      },
    },
    {
      id: "2",
      startTime: "2025-10-25T19:30:00Z",
      status: "In Progress",
      home: { id: "101", score: 0 },
      away: { id: "201", score: 2 },
      homeTeam: {
        data: {
          name: "Ajax",
          country: "USA",
          logo: { url: "/images/static-media/estoril-champs.avif" },
        },
      },
      awayTeam: {
        data: {
          name: "FC Bayern",
          country: "USA",
          logo: { url: "/images/static-media/estoril-champs.avif" },
        },
      },
    },
    {
      id: "3",
      startTime: "2025-10-26T20:00:00Z",
      status: "Played",
      home: { id: "102", score: 3 },
      away: { id: "202", score: 2 },
      homeTeam: {
        data: {
          name: "Team 1",
          country: "USA",
        },
      },
      awayTeam: {
        data: {
          name: "Team 2",
          country: "USA",
        },
      },
    },
    {
      id: "4",
      startTime: "2025-10-26T20:00:00Z",
      status: "Postponed",
      home: { id: "102", score: 1 },
      away: { id: "202", score: 1 },
      homeTeam: {
        data: {
          name: "Team 1",
          country: "USA",
        },
      },
      awayTeam: {
        data: {
          name: "Team 2",
          country: "USA",
        },
      },
    },
  ]

  return (
    <Container>
      <Section padding="md">
        <div className="space-y-10">
          <GameCardRow
            fixtures={fixtures}
            title="Test Fixtures"
            showDate
          />
        </div>
      </Section>
    </Container>
  )
}
